# Get remediation plan by ID

- **Method:** `GET`
- **Path:** `/plans/remediation/{id}`
- **Tag:** `action plans`
- **operationId:** `getPlansRemediationById`

## Path Parameters
- `id` (**required**) — unique plan id

## Responses
### 200
the plan entity
```json
{
  "type": "object",
  "properties": {
    "roles": {
      "type": "array",
      "description": "Role list",
      "items": {
        "type": "string",
        "description": "READ | WRITE | DELETE"
      }
    },
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
    "created_by": {
      "description": "username of the creator",
      "type": "string"
    },
    "created_at": {
      "description": "creation timestamp",
      "type": "string",
      "format": "date-time"
    },
    "updated_by": {
      "description": "username who last updated",
      "type": "string"
    },
    "updated_at": {
      "description": "last update timestamp",
      "type": "string",
      "format": "date-time"
    },
    "organization_domain": {
      "description": "Domain of the organization the plan belong to",
      "type": "string"
    },
    "archived_at": {
      "description": "archived timestamp",
      "type": "string",
      "format": "date-time"
    },
    "company_name": {
      "description": "scorecard company name",
      "type": "string"
    },
    "company_score": {
      "description": "scorecard company score",
      "type": "number"
    },
    "remediation_version": {
      "description": "remedaition version",
      "type": "string",
      "default": "1.0"
    },
    "items": {
      "type": "array",
      "description": "list of items to be resolved to complete the plan",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "status of the the remediation"
          },
          "risk_severity": {
            "type": "string",
            "description": "Risk severity"
          },
          "risk_category": {
            "type": "string",
            "description": "Category of risk"
          },
          "remediation_actions": {
            "type": "string",
            "description": "Remediation actions"
          },
          "risk_factor": {
            "type": "string",
            "description": ""
          },
          "evidence": {
            "type": "array",
            "description": "Evidence list",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Title of the issue type"
                },
                "key": {
                  "type": "string",
                  "description": "Key of the issue type"
                },
                "count": {
                  "type": "number",
                  "description": "count of findings associated with the issue type"
                }
              },
              "required": [
                "title",
                "key"
              ],
              "additionalProperties": false
            }
          },
          "status": {
            "type": "string",
            "description": "status of the the remediation",
            "default": "open",
            "enum": [
              "open",
              "in_progress",
              "under_review",
              "closed"
            ]
          }
        },
        "required": [
          "risk_severity",
          "risk_category",
          "remediation_actions",
          "evidence"
        ],
        "additionalProperties": false
      }
    },
    "is_managed": {
      "type": "boolean",
      "description": "True if is a managed scorecard"
    },
    "managed_scorecard": {
      "type": "string",
      "description": "Score which manages the scorecard for which the action plan is created"
    },
    "is_published": {
      "type": "boolean"
    },
    "type": {
      "description": "type of action plan",
      "type": "string"
    },
    "id": {
      "description": "id of action plan",
      "type": "string"
    }
  },
  "required": [
    "due_date",
    "scorecard",
    "guests",
    "created_by",
    "created_at",
    "updated_by",
    "updated_at",
    "organization_domain",
    "company_name",
    "company_score",
    "items",
    "is_managed",
    "managed_scorecard",
    "type",
    "id"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//plans/remediation/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

