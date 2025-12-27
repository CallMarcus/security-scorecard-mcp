# Create a new indicator exclusion

- **Method:** `POST`
- **Path:** `/max/v1/indicators/exclusion`
- **Tag:** `V1`
- **operationId:** `postV1IndicatorsExclusion`

## Request Body
```json
{
  "type": "object",
  "properties": {
    "issue_type": {
      "type": "string",
      "description": "ID of the indicator and Issue Type"
    },
    "scope": {
      "type": "string",
      "enum": [
        "partner",
        "customer",
        "vendor"
      ],
      "description": "Scope of the exclusion, can be: partner (everybody), vendor or customer"
    },
    "customer_id": {
      "type": "string",
      "description": "ID of the customer if the scope is customer"
    },
    "vendor_id": {
      "type": "string",
      "description": "ID of the vendor if the scope is vendor"
    },
    "reason": {
      "type": "string",
      "description": "Reason for the exclusion"
    }
  },
  "required": [
    "issue_type",
    "scope"
  ],
  "additionalProperties": false
}
```

## Responses
### 201
Indicator Exclusion created correctly.
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string"
    },
    "issue_type": {
      "type": "string",
      "description": "ID of the indicator and Issue Type"
    },
    "scope": {
      "type": "string",
      "enum": [
        "partner",
        "customer",
        "vendor"
      ],
      "description": "Scope of the exclusion, can be: partner (everybody), vendor or customer"
    },
    "customer_id": {
      "type": "string",
      "description": "ID of the customer if the scope is customer"
    },
    "customer_name": {
      "type": "string",
      "description": "Name of the customer if the scope is customer"
    },
    "vendor_id": {
      "type": "string",
      "description": "ID of the vendor if the scope is vendor"
    },
    "vendor_name": {
      "type": "string",
      "description": "Name of the vendor if the scope is vendor"
    },
    "vendor_domain": {
      "type": "string",
      "description": "Domain of the vendor if the scope is vendor"
    },
    "redundant": {
      "type": "boolean",
      "description": "If the exclusion is redundant"
    },
    "edited_at": {
      "type": "string",
      "description": "Date of the last edition"
    },
    "edited_by": {
      "type": "string",
      "description": "User Email of the last editor"
    },
    "reason": {
      "type": "string",
      "description": "Reason for the exclusion"
    },
    "issue_type_name": {
      "type": "string",
      "description": "Name of the issue type"
    },
    "issue_type_severity": {
      "type": "string",
      "description": "Severity of the issue type"
    },
    "issue_type_category": {
      "type": "string",
      "description": "Category of the issue type"
    },
    "issue_type_breach_risk": {
      "type": "string",
      "description": "Breach risk"
    },
    "issue_type_threat_level": {
      "type": "string",
      "description": "Threat level"
    }
  },
  "required": [
    "id",
    "issue_type",
    "scope",
    "redundant",
    "edited_at",
    "edited_by",
    "issue_type_name",
    "issue_type_severity",
    "issue_type_category",
    "issue_type_breach_risk",
    "issue_type_threat_level"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/indicators/exclusion' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

