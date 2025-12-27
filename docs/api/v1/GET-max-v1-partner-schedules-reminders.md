# Gets the reminder for the schedules

- **Method:** `GET`
- **Path:** `/max/v1/partner/schedules/reminders`
- **Tag:** `V1`
- **operationId:** `getV1PartnerSchedulesReminders`

## Responses
### 200
List if customer vendor pair and their schedules
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "description": "Array of reminders",
      "items": {
        "type": "object",
        "properties": {
          "status": {
            "type": "string",
            "description": "upcoming or overdue status"
          },
          "count": {
            "type": "number",
            "description": "count of status"
          },
          "customer_count": {
            "type": "number",
            "description": "count of customer"
          },
          "days": {
            "type": "number",
            "description": "no of day overdue by or upcoming"
          }
        },
        "required": [
          "status",
          "count",
          "customer_count",
          "days"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/schedules/reminders' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

