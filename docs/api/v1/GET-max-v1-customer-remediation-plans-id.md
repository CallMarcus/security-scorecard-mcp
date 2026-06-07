# Get a single remediation plan by ID

- **Method:** `GET`
- **Path:** `/max/v1/customer/remediation-plans/{id}`
- **Tag:** `V1`
- **operationId:** `getV1CustomerRemediationPlansById`

## Path Parameters
- `id` (**required**) — Unique ID of the remediation plan

## Responses
### 200
Details of the remediation plan
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "updated_at": {
      "type": "string"
    },
    "updated_by": {
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
    "vendor_name": {
      "type": "string"
    },
    "vendor_domain": {
      "type": "string"
    },
    "created_at": {
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
    "incident_likelihood": {
      "type": "string"
    },
    "remediation_plan": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "risk_severity": {
            "type": "string"
          },
          "risk_category": {
            "type": "string"
          },
          "remediation_actions": {
            "type": "string"
          },
          "evidence": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string"
                },
                "key": {
                  "type": "string"
                }
              },
              "required": [
                "title",
                "key"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "risk_severity",
          "risk_category",
          "remediation_actions",
          "evidence"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "updated_at",
    "updated_by",
    "customer_name",
    "customer_domain",
    "vendor_name",
    "vendor_domain",
    "created_at",
    "is_published",
    "published_at",
    "published_by"
  ],
  "additionalProperties": false
}
```
### 404
Remediation plan not found

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/remediation-plans/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

