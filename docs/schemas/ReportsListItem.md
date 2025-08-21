# ReportsListItem

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string"
    },
    "title": {
      "type": "string",
      "x-example": "Example co. Detailed Report",
      "description": "human-readable title for this report"
    },
    "format": {
      "type": "string",
      "x-example": "csv",
      "description": "file content format"
    },
    "report_type": {
      "type": "string",
      "x-example": "summary",
      "description": "type of report requested"
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "time the report was requested"
    },
    "completed_at": {
      "type": "string",
      "format": "date-time",
      "description": "time report generation completed (only when completed)"
    },
    "download_url": {
      "type": "string",
      "description": "url that can be used to download the completed report (only when completed successfully). that url might respond with a redirect (302) that you'll have to follow to download the file, most http agents will do this automatically."
    }
  }
}
```
