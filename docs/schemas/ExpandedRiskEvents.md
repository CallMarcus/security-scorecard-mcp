# ExpandedRiskEvents

```json
{
  "allOf": [
    {
      "$ref": "#/definitions/ExpandedRiskCollectionResponse"
    }
  ],
  "description": "Events associated with a domain",
  "properties": {
    "entries": {
      "items": {
        "$ref": "#/definitions/ExpandedRiskEvent"
      },
      "type": "array"
    }
  },
  "type": "object"
}
```
