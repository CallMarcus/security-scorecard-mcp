# ScorecardFootprintCSVReportCreationV2

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "domain": {
      "type": "string",
      "description": "Domain name for the Footprint export",
      "x-example": "example.com"
    },
    "assets": {
      "type": "string",
      "description": "selected assets for the Footprint export"
    }
  },
  "required": [
    "domain"
  ]
}
```
