# Get list of managed action plans for managed customers vendors

- **Method:** `GET`
- **Path:** `/plans/{id}`
- **Tag:** `action plans`
- **operationId:** `getPlansManagedServices`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)
- `sort` (optional, string) — plans list sorted field
- `search` (optional, string) — search text to look into plans fields
- `filter` (optional, string) — url encoded json filter string

## Responses
### 200
a list of plans visible by the user
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
            "type": "string",
            "format": "uuid",
            "description": "unique plan id"
          },
          "remediation_version": {
            "type": "string"
          },
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
          "type": {
            "type": "string",
            "enum": [
              "expression",
              "overall_score_improvement",
              "factor_score_improvement",
              "issue_resolution",
              "compliance_framework",
              "assessments",
              "evidence_locker",
              "remediation"
            ]
          },
          "status": {
            "type": "string",
            "enum": [
              "active",
              "completed"
            ]
          },
          "status_v2": {
            "type": "string",
            "enum": [
              "draft",
              "not_started",
              "in_progress",
              "complete",
              "resolved"
            ]
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
          "synchronized_at": {
            "description": "synchronized timestamp",
            "type": "string",
            "format": "date-time"
          },
          "is_custom_scorecard": {
            "description": "true if the scorecard is a custom one",
            "type": "boolean"
          },
          "company_name": {
            "description": "scorecard company name",
            "type": "string"
          },
          "company_score": {
            "description": "scorecard company score",
            "type": "number"
          },
          "factor_scores": {
            "description": "scorecard factor scores",
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "factor": {
                  "type": "string",
                  "description": "factor name"
                },
                "score": {
                  "type": "number",
                  "description": "factor score"
                }
              },
              "required": [
                "factor",
                "score"
              ],
              "additionalProperties": false
            }
          },
          "target": {
            "type": "object",
            "properties": {
              "overall_score": {
                "type": "number",
                "description": "Overall score target"
              },
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
              },
              "entries": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "source": {
                      "type": "string",
                      "example": "scorecard.signals.high.count === 0"
                    },
                    "key": {
                      "type": "string",
                      "example": "a"
                    },
                    "metadata": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "example": "no high severity issues"
                        },
                        "description": {
                          "type": "string",
                          "example": ""
                        }
                      },
                      "additionalProperties": true
                    }
                  },
                  "additionalProperties": false
                }
              }
            },
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
              },
              "issues": {
                "type": "array",
                "items": {
                  "type": "string"
                },
                "description": "List of issues active/present to be included as plan items"
              }
            },
            "additionalProperties": false
          },
          "score_type": {
            "type": "string",
            "description": "enables user to create plan with scoring v2 scores",
            "enum": [
              "scoring_v2",
              "scoring_v3"
            ]
          },
          "is_managed": {
            "type": "boolean",
            "description": "True if is a managed scorecard"
          },
          "is_published": {
            "type": "boolean",
            "description": "True if is published"
          },
          "published_at": {
            "type": "string",
            "description": "time at which published"
          },
          "published_by": {
            "type": "string",
            "description": "published by name"
          },
          "managed_scorecard": {
            "type": "string",
            "description": "Score which manages the scorecard for which the action plan is created"
          },
          "total_issues": {
            "type": "number"
          },
          "closed_issues": {
            "type": "number"
          },
          "progress": {
            "type": "number"
          }
        },
        "required": [
          "id",
          "due_date",
          "scorecard",
          "guests",
          "created_by",
          "created_at",
          "updated_by",
          "updated_at",
          "type",
          "status",
          "status_v2",
          "organization_domain",
          "is_custom_scorecard",
          "company_name",
          "company_score"
        ],
        "additionalProperties": false
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    },
    "total": {
      "type": "integer"
    }
  },
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//plans/{id}' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

