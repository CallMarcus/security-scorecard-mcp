# CompanyReportWithPdfOrCsvCreation

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
      "x-example": "pdf"
    }
  },
  "required": [
    "scorecard_identifier"
  ]
}
```
