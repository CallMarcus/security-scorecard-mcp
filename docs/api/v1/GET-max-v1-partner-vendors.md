# Gets all the vendors and there information for a partner

- **Method:** `GET`
- **Path:** `/max/v1/partner/vendors`
- **Tag:** `V1`
- **operationId:** `getV1PartnerVendors`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `sort` (optional, string) — stringified object with value for column to sort by and operator
- `vendor_name` (optional, string) — Search by vendor name
- `customer_name` (optional, string) — Search by customer name
- `customer_id` (optional, string) — Search by customer id
- `tier` (optional, string) — Search using tier
- `lifecycle` (optional, string) — Search using lifecycle
- `engagement` (optional, string) — Search using engagement
- `incident_likelihood` (optional, string) — Search by incident likelihood
- `incident_likelihood_trend` (optional, string) — Incident likelihood trend
- `business_impact` (optional, string) — Business impact
- `initial_assessment` (optional, string) — Inital assessment
- `previous_assessment` (optional, string) — Previous assessment
- `risk_status` (optional, string) — Risk status
- `vendor_added_at` (optional, string) — Date the vendor was added, accept stringified object with date value and operator
- `search` (optional, string) — word or phrase to search findings for
- `quarter` (optional, string) — Filter vendors by incident likelihood in a specific quarter (format: 2025-Q1)
- `quarterly_incident_likelihood` (optional, string) — Filter vendors by quarterly incident likelihood level
- `end_date` (optional, string) — End date in YYYY-MM-DD format to calculate the 4-quarter range from

## Responses
### 200
Gets the list all the vendors of a partner
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_id": {
            "type": "string",
            "description": "vendors id"
          },
          "vendor_domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "customer_id": {
            "type": "string",
            "description": "Customer id"
          },
          "customer_domain": {
            "type": "string",
            "description": "customer domain"
          },
          "business_impact": {
            "type": "string",
            "description": "Business impact"
          },
          "tier": {
            "type": "string",
            "description": "Tier "
          },
          "lifecycle": {
            "type": "string",
            "description": "Lifecycle"
          },
          "risk_status": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "engagement": {
            "type": "string",
            "description": "Engagement status"
          },
          "incident_likelihood": {
            "type": "string",
            "description": "Incident likelihood"
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string",
                  "description": "Custom tag name"
                }
              },
              "required": [
                "name"
              ],
              "additionalProperties": false
            },
            "description": "Custom Tags"
          },
          "assessment_trend": {
            "type": "string",
            "description": "Incident likelihood trend"
          },
          "initial_assessment": {
            "type": "string",
            "description": "Initial likelihood assessment"
          },
          "previous_assessment": {
            "type": "string",
            "description": "Previous likelihood assessment"
          },
          "vendor_name": {
            "type": "string",
            "description": "Vendor Name"
          },
          "vendor_added_at": {
            "type": "string",
            "description": "Date the vendor was added"
          },
          "customer_name": {
            "type": "string",
            "description": "Vendor Name"
          },
          "breach_id": {
            "type": "string",
            "description": "latest vendor breach id which has not been overrriden for the customer"
          },
          "breach_date": {
            "type": "string",
            "description": "latest vendor breach date"
          }
        },
        "required": [
          "vendor_id",
          "vendor_domain",
          "customer_id",
          "customer_domain",
          "business_impact",
          "tier",
          "lifecycle",
          "risk_status",
          "engagement",
          "incident_likelihood",
          "custom_tags",
          "assessment_trend",
          "initial_assessment",
          "previous_assessment",
          "vendor_name",
          "vendor_added_at",
          "customer_name"
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
  'https://api.securityscorecard.io//max/v1/partner/vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

