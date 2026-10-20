# Score vendors from an uploaded CSV

- **Method:** `POST`
- **Path:** `/max/v1/partner/customers/{customer_id}/vendor-suggestions/upload`
- **Tag:** `V1`
- **operationId:** `postV1PartnerCustomersByCustomeridVendorSuggestionsUpload`

## Description
Multipart CSV variant of the vendor-suggestions scoring. POST rather than GET because the request carries a file upload. Same buckets and semantics as the JSON base path -- see its description. Behind the MAX_VENDOR_SUGGESTIONS flag. Optional `fuzzy: true` resolves rows whose value is a name or DUNS through svc-users (flag-gated); such rows come back with resolution "fuzzy" and must be confirmed before import.

## Path Parameters
- `customer_id` (**required**) — Customer (portfolio owner) ID

## Request Body
```json
{
  "type": "object",
  "properties": {},
  "additionalProperties": true
}
```

## Responses
### 200
Suggested vendors, fitted to available slots
```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string",
      "format": "uuid",
      "description": "Customer the preview was produced for"
    },
    "source": {
      "type": "string",
      "enum": [
        "csv",
        "monitored",
        "procurement"
      ],
      "description": "Source the vendor list was drawn from"
    },
    "slots": {
      "type": "object",
      "properties": {
        "total": {
          "type": "integer",
          "description": "Total contracted vendor slots across all tiers"
        },
        "used": {
          "type": "integer",
          "description": "Slots currently consumed by the roster"
        },
        "available": {
          "type": "integer",
          "description": "Free capacity the shortlist is sized against; never negative, even when a customer is over-allocated"
        },
        "by_tier": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "tier": {
                "type": "string",
                "enum": [
                  "platinum",
                  "gold",
                  "silver"
                ],
                "description": "Vendor tier"
              },
              "total": {
                "type": "integer",
                "description": "Slots allocated to this tier"
              },
              "used": {
                "type": "integer",
                "description": "Slots this tier has consumed"
              },
              "available": {
                "type": "integer",
                "description": "Free slots in this tier; never negative"
              }
            },
            "required": [
              "tier",
              "total",
              "used",
              "available"
            ],
            "additionalProperties": false
          },
          "description": "Per-tier capacity the tier mapping fitted against and the review counters use"
        }
      },
      "description": "Capacity the shortlist was fitted to",
      "required": [
        "total",
        "used",
        "available",
        "by_tier"
      ],
      "additionalProperties": false
    },
    "recommended": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "format": "uuid",
            "description": "Scorecard id the prediction and any later import key on"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "name": {
            "type": "string",
            "description": "Vendor display name; null when the scorecard has none"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "unknown"
            ],
            "description": "Effective impact for this row: the source-supplied value when there is one, otherwise the prediction"
          },
          "impact_source": {
            "type": "string",
            "description": "Where the effective impact came from: the source name (e.g. 'csv') when source-supplied, or 'predicted'."
          },
          "suggested_tier": {
            "type": [
              "string",
              "null"
            ],
            "x-nullable": true,
            "description": "Tier to pre-fill in the review table: the source-supplied tier, or one derived from business impact and per-tier capacity when tier mapping is enabled; null otherwise."
          },
          "tier_source": {
            "type": "string",
            "enum": [
              "csv",
              "mapped",
              "moved"
            ],
            "description": "Provenance of suggested_tier: csv (source-supplied), mapped (default impact-to-tier rule), moved (the mapped tier was full, so the next tier with room was used)"
          },
          "tier_reason": {
            "type": "string",
            "description": "Why suggested_tier has its value, or why it is null when a tier was expected. Set only by tier mapping."
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Source-supplied tags, carried through to the commit"
          },
          "predicted": {
            "type": "object",
            "properties": {
              "business_impact": {
                "type": "string",
                "enum": [
                  "critical",
                  "high",
                  "medium",
                  "low",
                  "unknown"
                ],
                "description": "Business impact the model predicted"
              },
              "confidence": {
                "type": "object",
                "properties": {
                  "pred_score": {
                    "type": "number",
                    "description": "The model's raw prediction score"
                  },
                  "percentile_rank": {
                    "type": "number",
                    "description": "The vendor's percentile rank within the scored population"
                  }
                },
                "description": "The model's raw scores; null when it supplied none",
                "additionalProperties": false
              },
              "rationale": {
                "type": "object",
                "properties": {
                  "summary": {
                    "type": "string",
                    "description": "One-line reason, suitable for rendering in a Why column"
                  },
                  "factors": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "kind": {
                          "type": "string",
                          "description": "Factor category, e.g. peer_consensus"
                        },
                        "detail": {
                          "type": "string",
                          "description": "Free-text elaboration"
                        },
                        "value": {
                          "type": "string",
                          "description": "Impact value this factor points at"
                        },
                        "agree": {
                          "type": "integer",
                          "description": "How many observations support the value"
                        },
                        "total": {
                          "type": "integer",
                          "description": "Observations considered"
                        }
                      },
                      "required": [
                        "kind"
                      ],
                      "additionalProperties": false
                    },
                    "description": "Structured contributing factors, when the source supplies any"
                  }
                },
                "description": "Why the value was assigned; null when the source supplies no reason",
                "required": [
                  "summary"
                ],
                "additionalProperties": false
              }
            },
            "description": "The model's own answer, retained even when overridden; null when no prediction was returned for this vendor",
            "required": [
              "business_impact"
            ],
            "additionalProperties": false
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "How the row was matched to its scorecard: exact (domain or deterministic lookup), fuzzy (svc-users name match \u2014 the review table requires confirmation before import), unresolved."
          },
          "match_confidence": {
            "type": "integer",
            "description": "svc-users step-based confidence, 1\u201310; 10 for an exact domain hit"
          },
          "match_source": {
            "type": "string",
            "description": "Which resolver answered: database, algolia or clearbit-google"
          },
          "match_reason": {
            "type": "string",
            "description": "Why the row matched, as svc-users phrased it"
          },
          "original_query": {
            "type": "string",
            "description": "The string that was sent to svc-users (the source value), for display above the matched vendor"
          }
        },
        "required": [
          "vendor_scorecard_id",
          "domain",
          "business_impact",
          "suggested_tier"
        ],
        "additionalProperties": false
      },
      "description": "Shortlist, ranked critical \u2192 low and never longer than slots.available"
    },
    "overflow": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "format": "uuid",
            "description": "Scorecard id the prediction and any later import key on"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "name": {
            "type": "string",
            "description": "Vendor display name; null when the scorecard has none"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "unknown"
            ],
            "description": "Effective impact for this row: the source-supplied value when there is one, otherwise the prediction"
          },
          "impact_source": {
            "type": "string",
            "description": "Where the effective impact came from: the source name (e.g. 'csv') when source-supplied, or 'predicted'."
          },
          "suggested_tier": {
            "type": [
              "string",
              "null"
            ],
            "x-nullable": true,
            "description": "Tier to pre-fill in the review table: the source-supplied tier, or one derived from business impact and per-tier capacity when tier mapping is enabled; null otherwise."
          },
          "tier_source": {
            "type": "string",
            "enum": [
              "csv",
              "mapped",
              "moved"
            ],
            "description": "Provenance of suggested_tier: csv (source-supplied), mapped (default impact-to-tier rule), moved (the mapped tier was full, so the next tier with room was used)"
          },
          "tier_reason": {
            "type": "string",
            "description": "Why suggested_tier has its value, or why it is null when a tier was expected. Set only by tier mapping."
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Source-supplied tags, carried through to the commit"
          },
          "predicted": {
            "type": "object",
            "properties": {
              "business_impact": {
                "type": "string",
                "enum": [
                  "critical",
                  "high",
                  "medium",
                  "low",
                  "unknown"
                ],
                "description": "Business impact the model predicted"
              },
              "confidence": {
                "type": "object",
                "properties": {
                  "pred_score": {
                    "type": "number",
                    "description": "The model's raw prediction score"
                  },
                  "percentile_rank": {
                    "type": "number",
                    "description": "The vendor's percentile rank within the scored population"
                  }
                },
                "description": "The model's raw scores; null when it supplied none",
                "additionalProperties": false
              },
              "rationale": {
                "type": "object",
                "properties": {
                  "summary": {
                    "type": "string",
                    "description": "One-line reason, suitable for rendering in a Why column"
                  },
                  "factors": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "kind": {
                          "type": "string",
                          "description": "Factor category, e.g. peer_consensus"
                        },
                        "detail": {
                          "type": "string",
                          "description": "Free-text elaboration"
                        },
                        "value": {
                          "type": "string",
                          "description": "Impact value this factor points at"
                        },
                        "agree": {
                          "type": "integer",
                          "description": "How many observations support the value"
                        },
                        "total": {
                          "type": "integer",
                          "description": "Observations considered"
                        }
                      },
                      "required": [
                        "kind"
                      ],
                      "additionalProperties": false
                    },
                    "description": "Structured contributing factors, when the source supplies any"
                  }
                },
                "description": "Why the value was assigned; null when the source supplies no reason",
                "required": [
                  "summary"
                ],
                "additionalProperties": false
              }
            },
            "description": "The model's own answer, retained even when overridden; null when no prediction was returned for this vendor",
            "required": [
              "business_impact"
            ],
            "additionalProperties": false
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "How the row was matched to its scorecard: exact (domain or deterministic lookup), fuzzy (svc-users name match \u2014 the review table requires confirmation before import), unresolved."
          },
          "match_confidence": {
            "type": "integer",
            "description": "svc-users step-based confidence, 1\u201310; 10 for an exact domain hit"
          },
          "match_source": {
            "type": "string",
            "description": "Which resolver answered: database, algolia or clearbit-google"
          },
          "match_reason": {
            "type": "string",
            "description": "Why the row matched, as svc-users phrased it"
          },
          "original_query": {
            "type": "string",
            "description": "The string that was sent to svc-users (the source value), for display above the matched vendor"
          }
        },
        "required": [
          "vendor_scorecard_id",
          "domain",
          "business_impact",
          "suggested_tier"
        ],
        "additionalProperties": false
      },
      "description": "Scored vendors that did not fit, in the same ranked order"
    },
    "unscored": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "format": "uuid",
            "description": "Scorecard id the prediction and any later import key on"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "name": {
            "type": "string",
            "description": "Vendor display name; null when the scorecard has none"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "unknown"
            ],
            "description": "Effective impact for this row: the source-supplied value when there is one, otherwise the prediction"
          },
          "impact_source": {
            "type": "string",
            "description": "Where the effective impact came from: the source name (e.g. 'csv') when source-supplied, or 'predicted'."
          },
          "suggested_tier": {
            "type": [
              "string",
              "null"
            ],
            "x-nullable": true,
            "description": "Tier to pre-fill in the review table: the source-supplied tier, or one derived from business impact and per-tier capacity when tier mapping is enabled; null otherwise."
          },
          "tier_source": {
            "type": "string",
            "enum": [
              "csv",
              "mapped",
              "moved"
            ],
            "description": "Provenance of suggested_tier: csv (source-supplied), mapped (default impact-to-tier rule), moved (the mapped tier was full, so the next tier with room was used)"
          },
          "tier_reason": {
            "type": "string",
            "description": "Why suggested_tier has its value, or why it is null when a tier was expected. Set only by tier mapping."
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Source-supplied tags, carried through to the commit"
          },
          "predicted": {
            "type": "object",
            "properties": {
              "business_impact": {
                "type": "string",
                "enum": [
                  "critical",
                  "high",
                  "medium",
                  "low",
                  "unknown"
                ],
                "description": "Business impact the model predicted"
              },
              "confidence": {
                "type": "object",
                "properties": {
                  "pred_score": {
                    "type": "number",
                    "description": "The model's raw prediction score"
                  },
                  "percentile_rank": {
                    "type": "number",
                    "description": "The vendor's percentile rank within the scored population"
                  }
                },
                "description": "The model's raw scores; null when it supplied none",
                "additionalProperties": false
              },
              "rationale": {
                "type": "object",
                "properties": {
                  "summary": {
                    "type": "string",
                    "description": "One-line reason, suitable for rendering in a Why column"
                  },
                  "factors": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "kind": {
                          "type": "string",
                          "description": "Factor category, e.g. peer_consensus"
                        },
                        "detail": {
                          "type": "string",
                          "description": "Free-text elaboration"
                        },
                        "value": {
                          "type": "string",
                          "description": "Impact value this factor points at"
                        },
                        "agree": {
                          "type": "integer",
                          "description": "How many observations support the value"
                        },
                        "total": {
                          "type": "integer",
                          "description": "Observations considered"
                        }
                      },
                      "required": [
                        "kind"
                      ],
                      "additionalProperties": false
                    },
                    "description": "Structured contributing factors, when the source supplies any"
                  }
                },
                "description": "Why the value was assigned; null when the source supplies no reason",
                "required": [
                  "summary"
                ],
                "additionalProperties": false
              }
            },
            "description": "The model's own answer, retained even when overridden; null when no prediction was returned for this vendor",
            "required": [
              "business_impact"
            ],
            "additionalProperties": false
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "How the row was matched to its scorecard: exact (domain or deterministic lookup), fuzzy (svc-users name match \u2014 the review table requires confirmation before import), unresolved."
          },
          "match_confidence": {
            "type": "integer",
            "description": "svc-users step-based confidence, 1\u201310; 10 for an exact domain hit"
          },
          "match_source": {
            "type": "string",
            "description": "Which resolver answered: database, algolia or clearbit-google"
          },
          "match_reason": {
            "type": "string",
            "description": "Why the row matched, as svc-users phrased it"
          },
          "original_query": {
            "type": "string",
            "description": "The string that was sent to svc-users (the source value), for display above the matched vendor"
          }
        },
        "required": [
          "vendor_scorecard_id",
          "domain",
          "business_impact",
          "suggested_tier"
        ],
        "additionalProperties": false
      },
      "description": "Vendors outside the ranking entirely; importable with impact left unset"
    },
    "already_monitored": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "format": "uuid",
            "description": "Scorecard id the prediction and any later import key on"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "name": {
            "type": "string",
            "description": "Vendor display name; null when the scorecard has none"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "unknown"
            ],
            "description": "Effective impact for this row: the source-supplied value when there is one, otherwise the prediction"
          },
          "impact_source": {
            "type": "string",
            "description": "Where the effective impact came from: the source name (e.g. 'csv') when source-supplied, or 'predicted'."
          },
          "suggested_tier": {
            "type": [
              "string",
              "null"
            ],
            "x-nullable": true,
            "description": "Tier to pre-fill in the review table: the source-supplied tier, or one derived from business impact and per-tier capacity when tier mapping is enabled; null otherwise."
          },
          "tier_source": {
            "type": "string",
            "enum": [
              "csv",
              "mapped",
              "moved"
            ],
            "description": "Provenance of suggested_tier: csv (source-supplied), mapped (default impact-to-tier rule), moved (the mapped tier was full, so the next tier with room was used)"
          },
          "tier_reason": {
            "type": "string",
            "description": "Why suggested_tier has its value, or why it is null when a tier was expected. Set only by tier mapping."
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Source-supplied tags, carried through to the commit"
          },
          "predicted": {
            "type": "object",
            "properties": {
              "business_impact": {
                "type": "string",
                "enum": [
                  "critical",
                  "high",
                  "medium",
                  "low",
                  "unknown"
                ],
                "description": "Business impact the model predicted"
              },
              "confidence": {
                "type": "object",
                "properties": {
                  "pred_score": {
                    "type": "number",
                    "description": "The model's raw prediction score"
                  },
                  "percentile_rank": {
                    "type": "number",
                    "description": "The vendor's percentile rank within the scored population"
                  }
                },
                "description": "The model's raw scores; null when it supplied none",
                "additionalProperties": false
              },
              "rationale": {
                "type": "object",
                "properties": {
                  "summary": {
                    "type": "string",
                    "description": "One-line reason, suitable for rendering in a Why column"
                  },
                  "factors": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "kind": {
                          "type": "string",
                          "description": "Factor category, e.g. peer_consensus"
                        },
                        "detail": {
                          "type": "string",
                          "description": "Free-text elaboration"
                        },
                        "value": {
                          "type": "string",
                          "description": "Impact value this factor points at"
                        },
                        "agree": {
                          "type": "integer",
                          "description": "How many observations support the value"
                        },
                        "total": {
                          "type": "integer",
                          "description": "Observations considered"
                        }
                      },
                      "required": [
                        "kind"
                      ],
                      "additionalProperties": false
                    },
                    "description": "Structured contributing factors, when the source supplies any"
                  }
                },
                "description": "Why the value was assigned; null when the source supplies no reason",
                "required": [
                  "summary"
                ],
                "additionalProperties": false
              }
            },
            "description": "The model's own answer, retained even when overridden; null when no prediction was returned for this vendor",
            "required": [
              "business_impact"
            ],
            "additionalProperties": false
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "How the row was matched to its scorecard: exact (domain or deterministic lookup), fuzzy (svc-users name match \u2014 the review table requires confirmation before import), unresolved."
          },
          "match_confidence": {
            "type": "integer",
            "description": "svc-users step-based confidence, 1\u201310; 10 for an exact domain hit"
          },
          "match_source": {
            "type": "string",
            "description": "Which resolver answered: database, algolia or clearbit-google"
          },
          "match_reason": {
            "type": "string",
            "description": "Why the row matched, as svc-users phrased it"
          },
          "original_query": {
            "type": "string",
            "description": "The string that was sent to svc-users (the source value), for display above the matched vendor"
          }
        },
        "required": [
          "vendor_scorecard_id",
          "domain",
          "business_impact",
          "suggested_tier"
        ],
        "additionalProperties": false
      },
      "description": "Vendors already on the roster, so neither a recommendation nor a capacity decision"
    },
    "to_offboard": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "format": "uuid",
            "description": "Scorecard id the prediction and any later import key on"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "name": {
            "type": "string",
            "description": "Vendor display name; null when the scorecard has none"
          },
          "business_impact": {
            "type": "string",
            "enum": [
              "critical",
              "high",
              "medium",
              "low",
              "unknown"
            ],
            "description": "Effective impact for this row: the source-supplied value when there is one, otherwise the prediction"
          },
          "impact_source": {
            "type": "string",
            "description": "Where the effective impact came from: the source name (e.g. 'csv') when source-supplied, or 'predicted'."
          },
          "suggested_tier": {
            "type": [
              "string",
              "null"
            ],
            "x-nullable": true,
            "description": "Tier to pre-fill in the review table: the source-supplied tier, or one derived from business impact and per-tier capacity when tier mapping is enabled; null otherwise."
          },
          "tier_source": {
            "type": "string",
            "enum": [
              "csv",
              "mapped",
              "moved"
            ],
            "description": "Provenance of suggested_tier: csv (source-supplied), mapped (default impact-to-tier rule), moved (the mapped tier was full, so the next tier with room was used)"
          },
          "tier_reason": {
            "type": "string",
            "description": "Why suggested_tier has its value, or why it is null when a tier was expected. Set only by tier mapping."
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Source-supplied tags, carried through to the commit"
          },
          "predicted": {
            "type": "object",
            "properties": {
              "business_impact": {
                "type": "string",
                "enum": [
                  "critical",
                  "high",
                  "medium",
                  "low",
                  "unknown"
                ],
                "description": "Business impact the model predicted"
              },
              "confidence": {
                "type": "object",
                "properties": {
                  "pred_score": {
                    "type": "number",
                    "description": "The model's raw prediction score"
                  },
                  "percentile_rank": {
                    "type": "number",
                    "description": "The vendor's percentile rank within the scored population"
                  }
                },
                "description": "The model's raw scores; null when it supplied none",
                "additionalProperties": false
              },
              "rationale": {
                "type": "object",
                "properties": {
                  "summary": {
                    "type": "string",
                    "description": "One-line reason, suitable for rendering in a Why column"
                  },
                  "factors": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "kind": {
                          "type": "string",
                          "description": "Factor category, e.g. peer_consensus"
                        },
                        "detail": {
                          "type": "string",
                          "description": "Free-text elaboration"
                        },
                        "value": {
                          "type": "string",
                          "description": "Impact value this factor points at"
                        },
                        "agree": {
                          "type": "integer",
                          "description": "How many observations support the value"
                        },
                        "total": {
                          "type": "integer",
                          "description": "Observations considered"
                        }
                      },
                      "required": [
                        "kind"
                      ],
                      "additionalProperties": false
                    },
                    "description": "Structured contributing factors, when the source supplies any"
                  }
                },
                "description": "Why the value was assigned; null when the source supplies no reason",
                "required": [
                  "summary"
                ],
                "additionalProperties": false
              }
            },
            "description": "The model's own answer, retained even when overridden; null when no prediction was returned for this vendor",
            "required": [
              "business_impact"
            ],
            "additionalProperties": false
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "How the row was matched to its scorecard: exact (domain or deterministic lookup), fuzzy (svc-users name match \u2014 the review table requires confirmation before import), unresolved."
          },
          "match_confidence": {
            "type": "integer",
            "description": "svc-users step-based confidence, 1\u201310; 10 for an exact domain hit"
          },
          "match_source": {
            "type": "string",
            "description": "Which resolver answered: database, algolia or clearbit-google"
          },
          "match_reason": {
            "type": "string",
            "description": "Why the row matched, as svc-users phrased it"
          },
          "original_query": {
            "type": "string",
            "description": "The string that was sent to svc-users (the source value), for display above the matched vendor"
          }
        },
        "required": [
          "vendor_scorecard_id",
          "domain",
          "business_impact",
          "suggested_tier"
        ],
        "additionalProperties": false
      },
      "description": "Monitored vendors the source marked for removal; the commit offboards these"
    },
    "ignored_domains": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "description": "Domain from the source row; empty when the row had none"
          },
          "errors": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Why this row could not be used"
          },
          "index": {
            "type": "integer",
            "description": "Zero-based source row number"
          },
          "resolution": {
            "type": "string",
            "enum": [
              "exact",
              "fuzzy",
              "unresolved"
            ],
            "description": "Set to unresolved when the resolver tried and failed; on a duplicate superseded by another row that resolved to the same scorecard, that row's own resolution (exact or fuzzy); absent for structural failures (missing or duplicate value)"
          },
          "original_query": {
            "type": "string",
            "description": "The string sent to svc-users, when one was"
          },
          "attempts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "description": "String svc-users tried; svc-users may omit it"
                },
                "reason": {
                  "type": "string",
                  "description": "Why this attempt did not match"
                },
                "category": {
                  "type": "string",
                  "description": "How svc-users classified the string, e.g. name or lookup"
                },
                "attempt": {
                  "type": "string",
                  "description": "Which resolver step this was, as svc-users labels it"
                },
                "confidence": {
                  "type": "number",
                  "description": "Confidence svc-users assigned to this attempt, when any"
                }
              },
              "additionalProperties": false
            },
            "description": "What svc-users tried on this row"
          }
        },
        "required": [
          "domain",
          "errors",
          "index"
        ],
        "additionalProperties": false
      },
      "description": "Per-row failures, in the shape the CSV import already returns"
    },
    "counts": {
      "type": "object",
      "properties": {
        "recommended": {
          "type": "integer",
          "description": "Rows fitting free slots"
        },
        "overflow": {
          "type": "integer",
          "description": "Scored rows beyond available capacity"
        },
        "unscored": {
          "type": "integer",
          "description": "Rows the model declined to classify"
        },
        "already_monitored": {
          "type": "integer",
          "description": "Rows already on the customer roster"
        },
        "to_offboard": {
          "type": "integer",
          "description": "Monitored vendors the source asked to remove"
        },
        "ignored": {
          "type": "integer",
          "description": "Rows that could not be resolved"
        }
      },
      "description": "Bucket sizes; these six reconcile to the source row count, since every row lands in exactly one bucket",
      "required": [
        "recommended",
        "overflow",
        "unscored",
        "already_monitored",
        "to_offboard",
        "ignored"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "customer_id",
    "source",
    "slots",
    "recommended",
    "overflow",
    "unscored",
    "already_monitored",
    "to_offboard",
    "ignored_domains",
    "counts"
  ],
  "additionalProperties": false
}
```
### 400
A missing or malformed CSV file, a missing required column, or an unsupported source
### 403
Access denied
### 404
Feature not enabled for this user

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/customers/<customer_id>/vendor-suggestions/upload' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

