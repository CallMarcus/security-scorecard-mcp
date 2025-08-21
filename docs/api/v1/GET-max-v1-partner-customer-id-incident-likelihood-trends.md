# Return the customer vendors grouped by their incident likelihood trends

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customer_id}/incident-likelihood-trends`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridIncidentLikelihoodTrends`

## Path Parameters
- `customer_id` (**required**) — customer ID to get incident likelihood trends for

## Query Parameters
- `tiers` (optional, string) — Comma-separated list of tier names to filter vendors by

## Responses
### 200
Customer vendors grouped by their incident likelihood trends
```json
{
  "type": "object",
  "properties": {
    "initial_assessment": {
      "type": "object",
      "properties": {
        "low": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "medium": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "high": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "critical": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "additionalProperties": false
    },
    "previous_assessment": {
      "type": "object",
      "properties": {
        "low": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "medium": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "high": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "critical": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "additionalProperties": false
    },
    "latest_assessment": {
      "type": "object",
      "properties": {
        "low": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "medium": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "high": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "critical": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "additionalProperties": false
    },
    "trend": {
      "type": "object",
      "properties": {
        "low": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "medium": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "high": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        },
        "critical": {
          "type": "object",
          "properties": {
            "value": {
              "type": "integer"
            },
            "percentage": {
              "type": "integer"
            }
          },
          "required": [
            "value",
            "percentage"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "initial_assessment",
    "previous_assessment",
    "latest_assessment",
    "trend"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/<customer_id>/incident-likelihood-trends' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

