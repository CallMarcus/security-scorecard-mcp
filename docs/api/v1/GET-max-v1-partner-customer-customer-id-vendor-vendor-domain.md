# Gets the domain details for the vendor of the specific customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/customer/{customer_id}/vendor/{vendor_domain}`
- **Tag:** `V1`
- **operationId:** `getV1PartnerCustomerByCustomeridVendorByVendordomain`

## Path Parameters
- `customer_id` (**required**) — Id of the customer whoes vendor details are requested
- `vendor_domain` (**required**) — domain of the vendor whoes details are requested

## Responses
### 200
Gets the vendor details
```json
{
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
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/customer/<customer_id>/vendor/<vendor_domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

