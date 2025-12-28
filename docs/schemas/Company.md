# Company

```json
{
  "type": "object",
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
    }
  }
}
```
