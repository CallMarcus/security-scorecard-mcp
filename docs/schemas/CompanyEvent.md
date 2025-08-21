# CompanyEvent

```json
{
  "type": "object",
  "properties": {
    "date": {
      "type": "string",
      "format": "date-time",
      "description": "event's date",
      "x-example": "2018-11-02"
    },
    "event_type": {
      "type": "string",
      "description": "type of event",
      "x-example": "breach"
    },
    "breach_data": {
      "type": "object",
      "properties": {
        "method": {
          "type": "string",
          "description": "the method used by the attacker(s)",
          "x-example": "Inside Job"
        },
        "description": {
          "type": "string",
          "description": "a long human-readable description of the incident",
          "x-example": "A former Intel employees pleaded guilty to stealing documents for competitive advantage.  The employee worked ..."
        },
        "link": {
          "type": "string",
          "description": "a link to an article that explains this breach"
        }
      }
    }
  }
}
```
