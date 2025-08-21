# Update partially the overall score improvement plan by ID

- **Method:** `PATCH`
- **Path:** `/plans/overall-score-improvement/{id}`
- **Category:** `improvement-plans`
- **Operation ID:** `patchPlansOverallScoreImprovementById`

## Path Parameters

- `id` (**Required**) - unique plan id

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
    "target": {
      "type": "object",
      "properties": {
        "overall_score": {
          "type": "number",
          "description": "Overall score target"
        }
      },
      "required": [
        "overall_score"
      ],
      "additionalProperties": false
    }
  },
  "additionalProperties": false
}
```

## Responses

### 204

## Example Request

```bash
curl -X PATCH \
  'https://platform.securityscorecard.io/plans/overall-score-improvement/<id>' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
