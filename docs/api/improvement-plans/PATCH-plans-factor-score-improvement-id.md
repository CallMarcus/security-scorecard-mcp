# Update partially the factor score improvement plan by ID

- **Method:** `PATCH`
- **Path:** `/plans/factor-score-improvement/{id}`
- **Category:** `improvement-plans`
- **Operation ID:** `patchPlansFactorScoreImprovementById`

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
        "factor_score_targets": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "factor": {
                "type": "string",
                "description": "factor type"
              },
              "score": {
                "type": "number",
                "description": "score target for the given factor"
              }
            },
            "required": [
              "factor",
              "score"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "factor_score_targets"
      ],
      "additionalProperties": false
    },
    "criteria": {
      "type": "object",
      "properties": {
        "factors": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "List of factors to filter issues active/present"
        }
      },
      "required": [
        "factors"
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
  'https://platform.securityscorecard.io/plans/factor-score-improvement/<id>' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
