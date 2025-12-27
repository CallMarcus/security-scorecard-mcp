# Gets the domain details for the vendor of the specific customer

- **Method:** `GET`
- **Path:** `/max/v1/customer/vendor/{vendor_domain}`
- **Tag:** `V1`
- **operationId:** `getV1CustomerVendorByVendordomain`

## Path Parameters
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
  'https://api.securityscorecard.io//max/v1/customer/vendor/<vendor_domain>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

