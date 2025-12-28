# ExpandedRiskEvent

```json
{
  "description": "An event pertaining to a company's environmental, social, or governance risk",
  "properties": {
    "confidence": {
      "example": "High",
      "type": "string"
    },
    "category": {
      "example": "STATE_OWNED_COMPANY",
      "type": "string"
    },
    "comments": {
      "example": "Example comment",
      "type": "string"
    },
    "company_name": {
      "example": "Example Ltd",
      "type": "string"
    },
    "created_at": {
      "example": "2020-01-01T00:00:00.000Z",
      "format": "date-time",
      "type": "string"
    },
    "event": {
      "example": "SOE involved in Public Services",
      "type": "string"
    },
    "event_urls": {
      "items": {
        "example": "https://example.com/event1",
        "type": "string"
      },
      "type": "array"
    },
    "primary_source": {
      "example": "Website",
      "type": "string"
    },
    "scorecard_domain": {
      "example": "example.com",
      "type": "string"
    },
    "scorecard_id": {
      "example": "aea7dae2-370f-4279-a458-4c7cb9661778",
      "type": "string"
    },
    "source_url": {
      "example": "https://example.com/scanned",
      "type": "string"
    },
    "sub_category": {
      "example": "SOE: Govt Owned Corp",
      "type": "string"
    },
    "updated_date": {
      "example": "2020-01-01T00:00:00.000Z",
      "format": "date-time",
      "type": "string"
    }
  }
}
```
