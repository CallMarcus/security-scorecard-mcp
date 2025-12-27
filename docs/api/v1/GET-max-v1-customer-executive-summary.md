# Gets executive summary for the customer

- **Method:** `GET`
- **Path:** `/max/v1/customer/executive-summary`
- **Tag:** `V1`
- **operationId:** `getV1CustomerExecutiveSummary`

## Responses
### 200
Executive summary for the customer
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the executive summary"
    },
    "body": {
      "type": "string",
      "description": "Body of the executive summary"
    },
    "created_at": {
      "type": "string",
      "description": "Date and time the executive summary was created"
    },
    "updated_at": {
      "type": "string",
      "description": "Date and time the executive summary was last updated"
    },
    "created_by": {
      "type": "string",
      "description": "User who created the executive summary"
    },
    "updated_by": {
      "type": "string",
      "description": "User who last updated the executive summary"
    }
  },
  "required": [
    "title",
    "body",
    "created_at",
    "updated_at",
    "created_by",
    "updated_by"
  ],
  "additionalProperties": false
}
```
### 204
No executive summary found.
### 403
Access denied due to insufficient permissions.

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/executive-summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

