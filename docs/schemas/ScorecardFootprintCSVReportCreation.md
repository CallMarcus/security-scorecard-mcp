# ScorecardFootprintCSVReportCreation

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scorecard_identifier": {
      "type": "string",
      "description": "primary identifier of a company or scorecard",
      "x-example": "example.com"
    },
    "format": {
      "type": "string",
      "description": "output format",
      "enum": [
        "pdf",
        "csv"
      ],
      "x-example": "csv"
    },
    "ips": {
      "type": "array",
      "description": "array of string of ips"
    },
    "subdomains": {
      "type": "array",
      "description": "array of string of subdomains"
    },
    "countries": {
      "type": "array",
      "description": "array of string of county codes"
    }
  },
  "required": [
    "scorecard_identifier"
  ]
}
```
