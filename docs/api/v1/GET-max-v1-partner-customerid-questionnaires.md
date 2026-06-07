# Gets questionnaires for a managed customer

- **Method:** `GET`
- **Path:** `/max/v1/partner/{customerId}/questionnaires`
- **Tag:** `V1`
- **operationId:** `getV1PartnerByCustomeridQuestionnaires`

## Path Parameters
- `customer_id` (**required**) — Customer organization ID

## Query Parameters
- `page` (optional, number) — Page number
- `size` (optional, number) — Page size
- `sort` (optional, string) — Comma-separated sort fields
- `search` (optional, string) — Search term
- `form_roles` (**required**, string) — Comma-separated form roles
- `status` (optional, string) — Comma-separated status values
- `target_domains` (optional, string) — Comma-separated target domains
- `sent_time_from` (optional, string) — Start sent date in YYYY-MM-DD format
- `sent_time_to` (optional, string) — End sent date in YYYY-MM-DD format
- `overdue` (optional, string) — Filter overdue questionnaires
- `close_to_due_date` (optional, string) — Filter questionnaires close to due date
- `completed_before_due_date` (optional, string) — Filter questionnaires completed before due date
- `assessment_id` (optional, string) — Specific assessment ID

## Responses
### 200
Questionnaires list
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "status": {
            "type": "string"
          },
          "created_at": {
            "type": "string"
          },
          "updated_at": {
            "type": "string"
          },
          "due_date": {
            "type": "string"
          },
          "target_company": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "domain": {
                "type": "string"
              }
            },
            "additionalProperties": true
          },
          "form": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string"
              },
              "name": {
                "type": "string"
              }
            },
            "additionalProperties": true
          }
        },
        "additionalProperties": true,
        "required": [
          "id"
        ]
      }
    },
    "pagination_stats": {
      "type": "object",
      "properties": {
        "total_count": {
          "type": "number"
        }
      },
      "additionalProperties": true
    },
    "msg": {
      "type": "string"
    }
  },
  "additionalProperties": true,
  "required": [
    "entries"
  ]
}
```
### 404
Questionnaire bot mapping not found for customer

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/partner/{customerId}/questionnaires' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

