# CompanyActiveIssueObservation

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "ip": {
      "type": "string",
      "description": "ip address"
    },
    "port": {
      "type": "integer",
      "description": "port"
    },
    "sni": {
      "type": "string",
      "description": "sni"
    },
    "last_seen_time": {
      "type": "string",
      "format": "date-time",
      "description": "last seen time",
      "x-example": "2018-11-02T00:00:00.000Z"
    }
  }
}
```
