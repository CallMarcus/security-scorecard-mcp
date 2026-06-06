# Update partially the issue resolution plan by ID

- **Method:** `PATCH`
- **Path:** `/plans/issue-resolution/{id}`
- **Tag:** `action plans`
- **operationId:** `patchPlansIssueResolutionById`

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
    },
    "criteria": {
      "type": "object",
      "properties": {
        "issues": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of issues active/present to be included as plan items"
        }
      },
      "required": [
        "issues"
      ],
      "additionalProperties": false
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
  'https://api.securityscorecard.io//plans/issue-resolution/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

