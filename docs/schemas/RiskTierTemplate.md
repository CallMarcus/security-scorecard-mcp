# RiskTierTemplate

```json
{
  "type": "object",
  "description": "Per-organization assignment of an Atlas template to a risk tier.",
  "required": [
    "id",
    "organizationId",
    "riskTier",
    "templateId",
    "createdAt",
    "createdBy",
    "updatedAt",
    "updatedBy"
  ],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Row id."
    },
    "organizationId": {
      "type": "string",
      "format": "uuid",
      "description": "Owning organization id."
    },
    "riskTier": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "critical"
      ],
      "description": "Risk tier label."
    },
    "templateId": {
      "type": "string",
      "description": "Atlas template UUID; empty string means \"No assessment\"."
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    },
    "createdBy": {
      "type": "string"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time"
    },
    "updatedBy": {
      "type": "string"
    }
  }
}
```
