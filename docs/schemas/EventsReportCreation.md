# EventsReportCreation

```json
{
  "type": "object",
  "properties": {
    "params": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "scorecard_identifier": {
          "type": "string",
          "description": "primary identifier of a company or scorecard",
          "x-example": "example.com"
        },
        "date": {
          "type": "string",
          "description": "the day when the events happened",
          "x-example": "2018-11-08"
        }
      },
      "required": [
        "scorecard_identifier",
        "date"
      ]
    }
  }
}
```
