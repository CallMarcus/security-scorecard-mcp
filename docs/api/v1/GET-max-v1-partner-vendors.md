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
- `customer_domain` (optional, string) — Search by customer domain
- `customer_id` (optional, string) — Search by customer id
- `tag` (optional, string) — Search by tag
- `tier` (optional, string) — Search using tier
- `lifecycle` (optional, string) — Search using lifecycle
- `engagement` (optional, string) — Search using engagement
- `grade` (optional, string) — Search by grade
- `incident_likelihood` (optional, string) — Search by incident likelihood
- `incident_likelihood_trend` (optional, string) — Incident likelihood trend
- `business_impact` (optional, string) — Business impact
- `initial_assessment` (optional, string) — Inital assessment
- `previous_assessment` (optional, string) — Previous assessment
- `risk_status` (optional, string) — Risk status
- `vendor_added_at` (optional, string) — Date the vendor was added, accept stringified object with date value and operator
- `has_active_breach` (optional, string) — Filter vendors by has active breach, accept true or false
- `search` (optional, string) — word or phrase to search for
- `quarter` (optional, string) — Filter vendors by incident likelihood in a specific quarter (format: 2025-Q1)
- `quarterly_incident_likelihood` (optional, string) — Filter vendors by quarterly incident likelihood level
- `month` (optional, string) — Filter vendors by score grade in a specific month (format: 2025-01)
- `monthly_grade` (optional, string) — Filter vendors by monthly score grade

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
          "risk_status": {
            "type": "array",
            "items": {
              "type": "string"
            }
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
          "grade": {
            "type": "string",
            "description": "Grade"
          },
          "breach_id": {
            "type": "string",
            "description": "latest vendor breach id which has not been overrriden for the customer"
          },
          "breach_date": {
            "type": "string",
            "description": "latest vendor breach date"
          },
          "has_active_breach": {
            "type": "boolean",
            "description": "Vendor has active breach"
          },
          "score": {
            "type": "number",
            "description": "Vendor score"
          },
          "trust_center_eligible": {
            "type": "boolean",
            "description": "Partner vendor list only. True when the vendor has questionnaire evidence in its Evidence Locker AND at least one contact on its own domain. Absent for every vendor while MAX_VENDOR_TRUST_CENTER is off."
          },
          "trust_center_reason": {
            "type": "string",
            "description": "Partner vendor list only. Why the vendor is not eligible. Empty when it is. Tells the analyst whether to wait for evidence or to go and find a corporate contact."
          },
          "trust_center_evidence_count": {
            "type": "integer",
            "description": "Partner vendor list only. Questionnaire evidence items the vendor owns, as of the last daily snapshot. Zero while the check is unavailable \u2014 read trustCenterEvidenceCheck before believing it."
          },
          "trust_center_evidence_check": {
            "type": "string",
            "enum": [
              "resolved",
              "unavailable"
            ],
            "description": "Partner vendor list only. Whether the evidence question could be answered. \"unavailable\" means the snapshot is missing or stale, which is NOT the same as a vendor having nothing; no vendor is eligible while it is unavailable."
          },
          "trust_center_questionnaire_count": {
            "type": "integer",
            "description": "Partner vendor list only. Questionnaires the partner customers have sent this vendor. Context only \u2014 it decides nothing. A high count beside a zero evidence count is a vendor that answered and attached nothing."
          }
        },
        "required": [
          "vendor_id",
          "vendor_domain",
          "customer_id",
          "customer_domain",
          "business_impact",
          "tier",
          "risk_status",
          "incident_likelihood",
          "custom_tags",
          "assessment_trend",
          "initial_assessment",
          "previous_assessment",
          "vendor_name",
          "vendor_added_at",
          "customer_name",
          "grade",
          "has_active_breach"
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

