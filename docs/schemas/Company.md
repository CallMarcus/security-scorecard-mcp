# Company

```json
{
  "type": "object",
  "required": [
    "id",
    "domain",
    "name",
    "added_date",
    "tags",
    "portfolios",
    "monitored"
  ],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the company"
    },
    "domain": {
      "type": "string",
      "description": "Domain of the company",
      "example": "example.com"
    },
    "name": {
      "type": "string",
      "description": "Name of the company",
      "example": "Example Inc"
    },
    "added_date": {
      "type": "string",
      "format": "date-time",
      "description": "Date on which the company started to be followed"
    },
    "last_logged_in": {
      "type": "string",
      "format": "date-time",
      "description": "Last time a user belonging to this company logged in to SecurityScorecard. Omitted by GET /all-companies and returned as an empty string by GET /all-companies/{domain} when the company has never logged in. Reflects the company's own platform activity, not your relationship with it."
    },
    "tags": {
      "description": "Tags visible to the current user that are linked to the company",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "example": "Example-Tag-01"
          }
        }
      }
    },
    "portfolios": {
      "description": "Portfolios visible to the current user where the company belongs to",
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid"
          },
          "name": {
            "type": "string",
            "example": "Example Portfolio"
          }
        }
      }
    },
    "monitored": {
      "description": "Flag that determines if the company is monitored (belongs to at least one portfolio) or non-monitored",
      "type": "boolean"
    },
    "monitoring_level": {
      "type": "string",
      "enum": [
        "full",
        "partial",
        "none"
      ],
      "description": "Org-scoped monitoring level derived only from tags owned by the organization: `full` when the company is in an org-owned portfolio, `partial` when it is only in an org-owned watch list, `none` otherwise. Omitted entirely, rather than defaulting to `none`, while the feature is not yet enabled for the caller."
    },
    "business_impact": {
      "$ref": "#/definitions/BusinessImpact"
    },
    "lifecycle_status": {
      "$ref": "#/definitions/LifecycleStatus"
    },
    "data_types_shared": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/DataTypesShared"
      }
    },
    "risk": {
      "$ref": "#/definitions/Risk"
    },
    "inherent_risk": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical",
        ""
      ],
      "description": "Risk tier computed by the intake questionnaire at submission time. Not editable via PATCH; a later intake submission for the same vendor overwrites it. Omitted by GET /all-companies and returned as an empty string by GET /all-companies/{domain} for vendors not onboarded through intake. Distinct from `risk`, which is the customer-maintained label."
    },
    "business_unit": {
      "$ref": "#/definitions/BusinessUnit"
    },
    "contract_end_date": {
      "$ref": "#/definitions/ContractEndDate"
    },
    "vendor_id": {
      "$ref": "#/definitions/CompanyId"
    },
    "internal_contact": {
      "$ref": "#/definitions/InternalContact"
    },
    "external_vendor_id": {
      "type": "string",
      "description": "External vendor ID assigned to the company",
      "example": "example-external-id"
    }
  }
}
```
