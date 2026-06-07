# Gets questionnaire status summary for a managed customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customerId}/questionnaires/status-summary`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridQuestionnairesStatusSummary`

## Path Parameters
- `customer_id` (**required**) — Customer organization ID

## Query Parameters
- `form_roles` (**required**, string) — Comma-separated form roles (for example: VRM,VRM_PROXY)
- `sent_time_from` (optional, string) — Start sent date in YYYY-MM-DD format
- `sent_time_to` (optional, string) — End sent date in YYYY-MM-DD format

## Responses
### 200
Questionnaire status summary
```json
{
  "type": "object",
  "properties": {
    "entry": {
      "type": "object",
      "properties": {
        "created": {
          "type": "number"
        },
        "vendor_in_progress": {
          "type": "number"
        },
        "vrm_in_progress": {
          "type": "number"
        },
        "accepted": {
          "type": "number"
        },
        "canceled": {
          "type": "number"
        },
        "archived": {
          "type": "number"
        },
        "unarchived": {
          "type": "number"
        },
        "overdue": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "msg": {
      "type": "string"
    }
  },
  "additionalProperties": true,
  "required": [
    "entry"
  ]
}
```
### 404
Questionnaire bot mapping not found for customer

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/{customerId}/questionnaires/status-summary' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

