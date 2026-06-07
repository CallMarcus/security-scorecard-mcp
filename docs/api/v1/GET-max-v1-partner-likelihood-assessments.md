# Gets the list of likelihood assessments reports of the partner

- **Method:** `GET`
- **Path:** `/max/v1/partner/likelihood-assessments`
- **Tag:** `V1`
- **operationId:** `getV1PartnerLikelihoodAssessments`

## Query Parameters
- `search` (optional, string) — word or phrase to search for
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `vendor_domain` (optional, string) — Vendor domains whoes report is needed comma separated
- `tiers` (optional, string) — Tiers comma separated
- `tag` (optional, string) — Comma-separated list of tag names to filter vendors by
- `incident_likelihoods` (optional, string) — incident likelihood comma separated
- `business_impacts` (optional, string) — business impacts comma separated
- `customer_domain` (optional, string) — Customer Domain whoes report is needed comma separated
- `published` (optional, string) — If true returns published reports, false returns draft reports and no value return all reports
- `published_at` (optional, string) — published at filter, accept stringified object with date value and operator
- `hide_report_body` (optional, string) — pass true if we dont need the report body

## Responses
### 200
A list of likelihood report data
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "id": {
            "type": "string"
          },
          "customer_name": {
            "type": "string",
            "description": "Name of the customer"
          },
          "customer_domain": {
            "type": "string"
          },
          "customer_id": {
            "type": "string"
          },
          "vendor_name": {
            "type": "string"
          },
          "vendor_domain": {
            "type": "string"
          },
          "vendor_id": {
            "type": "string"
          },
          "created_at": {
            "type": "string"
          },
          "updated_at": {
            "type": "string"
          },
          "updated_by": {
            "type": "string"
          },
          "is_published": {
            "type": "boolean"
          },
          "published_at": {
            "type": "string"
          },
          "published_by": {
            "type": "string"
          },
          "incident_likelihood_score": {
            "type": "number"
          },
          "incident_likelihood": {
            "type": "string"
          },
          "business_impact": {
            "type": "string"
          },
          "is_legacy_report": {
            "type": "boolean"
          },
          "tier": {
            "type": "string"
          },
          "likelihood_data": {
            "type": "object",
            "properties": {
              "score": {
                "type": "object",
                "properties": {
                  "start": {
                    "type": "number",
                    "description": "Initial score"
                  },
                  "end": {
                    "type": "number",
                    "description": "End score"
                  },
                  "rating": {
                    "type": "string",
                    "description": "Rating type"
                  }
                },
                "required": [
                  "start",
                  "end",
                  "rating"
                ],
                "additionalProperties": false
              },
              "rating_breakdown": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "info_security_objective": {
                      "type": "string",
                      "description": "Information securitive objective"
                    },
                    "score": {
                      "type": "number",
                      "description": "Score"
                    },
                    "rating": {
                      "type": "string",
                      "description": "Rating"
                    }
                  },
                  "required": [
                    "info_security_objective",
                    "score",
                    "rating"
                  ],
                  "additionalProperties": false
                }
              },
              "rating_breakdown_info": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "info_security_objective": {
                      "type": "string",
                      "description": "Information securitive objective"
                    },
                    "info_security_activity": {
                      "type": "string",
                      "description": "Information Security Activity"
                    },
                    "score": {
                      "type": "number",
                      "description": "Score"
                    },
                    "rating": {
                      "type": "string",
                      "description": "Rating"
                    }
                  },
                  "required": [
                    "info_security_objective",
                    "info_security_activity",
                    "score",
                    "rating"
                  ],
                  "additionalProperties": false
                }
              },
              "enhance_information_security_activity": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "info_security_activity": {
                      "type": "string",
                      "description": "Information securitive activity"
                    },
                    "info_security_objective": {
                      "type": "string",
                      "description": "Information securitive objective"
                    },
                    "recommendation": {
                      "type": "string",
                      "description": "Recommendation"
                    },
                    "criticality": {
                      "type": "string",
                      "description": "Criticality"
                    },
                    "current_information": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "title": {
                            "type": "string",
                            "description": "title of the issue type"
                          },
                          "key": {
                            "type": "string",
                            "description": "key of the issue type"
                          },
                          "count": {
                            "type": "number",
                            "description": "count of the issue type"
                          },
                          "periods": {
                            "type": "array",
                            "description": "if this issue is about past findings, these are the periods when they were observed",
                            "items": {
                              "type": "string"
                            }
                          },
                          "severity": {
                            "type": "string",
                            "description": "Indicator MAX severity (low, medium, high or critical)"
                          }
                        },
                        "required": [
                          "title",
                          "key"
                        ],
                        "additionalProperties": false
                      },
                      "description": "Current information"
                    },
                    "findings_count": {
                      "type": "number",
                      "description": "Finding count"
                    }
                  },
                  "required": [
                    "info_security_activity",
                    "info_security_objective",
                    "recommendation",
                    "criticality",
                    "current_information"
                  ],
                  "additionalProperties": false
                }
              },
              "ransomware_and_data_breach_incidents": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "severity": {
                      "type": "string",
                      "description": "Current information"
                    },
                    "no_of_issues": {
                      "type": "number",
                      "description": "Current information"
                    },
                    "indicator_key": {
                      "type": "string",
                      "description": "indicator key"
                    },
                    "information_security_indicator": {
                      "type": "string",
                      "description": "Information security indicator"
                    }
                  },
                  "required": [
                    "severity",
                    "no_of_issues",
                    "information_security_indicator"
                  ],
                  "additionalProperties": false
                }
              },
              "vulnerabilities_to_address": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "cve_nvd_severity": {
                      "type": "string",
                      "description": "Current information"
                    },
                    "no_of_vulnerabilities": {
                      "type": "number",
                      "description": "Current information"
                    },
                    "no_of_cisa_known_vulnerabilities": {
                      "type": "number",
                      "description": "Information security indicator"
                    }
                  },
                  "required": [
                    "cve_nvd_severity",
                    "no_of_vulnerabilities",
                    "no_of_cisa_known_vulnerabilities"
                  ],
                  "additionalProperties": false
                }
              },
              "suspicious_activity": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "severity": {
                      "type": "string",
                      "description": "Severity"
                    },
                    "no_of_issues": {
                      "type": "number",
                      "description": "No of issues"
                    },
                    "indicator_key": {
                      "type": "string",
                      "description": "indicator key"
                    },
                    "information_security_indicator": {
                      "type": "string",
                      "description": "Information security indicator"
                    }
                  },
                  "required": [
                    "severity",
                    "no_of_issues",
                    "information_security_indicator"
                  ],
                  "additionalProperties": false
                }
              },
              "exposed_services_to_investigate": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "severity": {
                      "type": "string",
                      "description": "Severity"
                    },
                    "no_of_issues": {
                      "type": "number",
                      "description": "No of issues"
                    },
                    "indicator_key": {
                      "type": "string",
                      "description": "indicator key"
                    },
                    "information_security_indicator": {
                      "type": "string",
                      "description": "Information security indicator"
                    }
                  },
                  "required": [
                    "severity",
                    "no_of_issues",
                    "information_security_indicator"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "score",
              "rating_breakdown_info",
              "enhance_information_security_activity",
              "ransomware_and_data_breach_incidents",
              "suspicious_activity",
              "exposed_services_to_investigate"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "customer_name",
          "customer_domain",
          "vendor_name",
          "vendor_domain",
          "created_at",
          "updated_at",
          "updated_by",
          "is_published",
          "published_at",
          "published_by"
        ],
        "additionalProperties": false
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "integer"
    }
  },
  "additionalProperties": true,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ]
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/likelihood-assessments' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

