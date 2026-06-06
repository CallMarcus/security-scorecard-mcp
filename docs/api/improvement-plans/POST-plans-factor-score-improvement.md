# Create new factor score improvement plan

- **Method:** `POST`
- **Path:** `/plans/factor-score-improvement`
- **Category:** `improvement-plans`
- **Operation ID:** `postPlansFactorScoreImprovement`

## Request Body

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "plan name",
      "example": "Example Plan"
    },
    "description": {
      "type": "string",
      "description": "plan description",
      "example": "A plan description"
    },
    "due_date": {
      "type": "string",
      "format": "date-time",
      "description": "the plan due date"
    },
    "scorecard": {
      "type": "string",
      "description": "the scorecard which the plan is for",
      "example": "example.com"
    },
    "guests": {
      "type": "array",
      "description": "list of guests (user emails) that can access to the plan",
      "items": {
        "type": "string"
      },
      "example": []
    },
    "editors": {
      "type": "array",
      "description": "list of editors (user emails) that can edit the plan",
      "items": {
        "type": "string"
      },
      "example": [],
      "default": []
    },
    "score-type": {
      "type": "string",
      "description": "enables user to create plan with scoring v2 scores",
      "enum": [
        "scoring_v2",
        "scoring_v3"
      ]
    },
    "share_with_domain": {
      "type": "boolean",
      "description": "Whether the plan should be shared with the domain"
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
  "required": [
    "due_date",
    "scorecard",
    "guests",
    "target",
    "criteria"
  ],
  "additionalProperties": false
}
```

## Responses

### 201
new plan id
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "unique plan id"
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/plans/factor-score-improvement' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
