# Update partially the remediation plan by ID

- **Method:** `PATCH`
- **Path:** `/plans/remediation/{id}`
- **Tag:** `action plans`
- **operationId:** `patchPlansRemediationById`

## Path Parameters
- `id` (**required**) — unique plan id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "plan name"
    },
    "description": {
      "type": "string",
      "description": "plan description"
    },
    "due_date": {
      "type": "string",
      "format": "date-time",
      "description": "the plan due date"
    },
    "auto_add_new_issues": {
      "description": "true if the plan should auto add new issues",
      "type": "boolean"
    }
  },
  "additionalProperties": false
}
```

## Responses
### 204


## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//plans/remediation/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

