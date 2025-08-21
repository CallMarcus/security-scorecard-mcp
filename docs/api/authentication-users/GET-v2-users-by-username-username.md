# get user by username

- **Method:** `GET`
- **Path:** `/v2/users/by-username/{username}`
- **Category:** `authentication-users`
- **Operation ID:** `get_v2-users-by-username-username`

## Description

get user by username

## Path Parameters

- `username` (**Required**) - username of an existing user

## Responses

### 200
a person that uses any system at SecurityScorecard
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "description": "a user id"
    },
    "username": {
      "type": "string",
      "x-example": "john.smith@example.com"
    },
    "email": {
      "type": "string",
      "format": "email",
      "pattern": "^.+@.+$",
      "x-example": "john.smith@example.com"
    },
    "first_name": {
      "type": "string",
      "x-example": "John"
    },
    "last_name": {
      "type": "string",
      "x-example": "Smith"
    },
    "is_bot": {
      "type": "boolean",
      "description": "true if user is not human, this kind of users is used by customer integration apps"
    },
    "has_access_tokens": {
      "type": "boolean",
      "description": "true if the user has access tokens"
    },
    "created": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "creation datetime"
    },
    "customer_id": {
      "type": "string",
      "x-example": "5640d975e4b0f93fc5c4beea",
      "description": "the organization id of the user"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "collection of user access levels"
    },
    "vendor_id": {
      "type": "string",
      "description": "vendor that is associated with the user and organization"
    },
    "last_logged_in": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "last activity date"
    },
    "notification_last_read": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "notification last read date"
    },
    "settings": {
      "type": "object",
      "properties": {
        "digest_email": {
          "type": "object",
          "properties": {
            "daily": {
              "type": "boolean",
              "description": "indicates whether to receive alert email"
            }
          },
          "additionalProperties": false
        },
        "designated_contact_email": {
          "type": "object",
          "properties": {
            "enabled": {
              "type": "boolean",
              "description": "indicates whether to receive contact request email"
            }
          },
          "additionalProperties": false,
          "required": [
            "enabled"
          ]
        },
        "vendor_invitation_notification_email": {
          "type": "object",
          "properties": {
            "enabled": {
              "type": "boolean",
              "description": "indicates whether to receive emails about sent vendor invitations"
            }
          },
          "additionalProperties": false,
          "required": [
            "enabled"
          ]
        },
        "portfolios": {
          "type": "object",
          "properties": {},
          "additionalProperties": true
        },
        "homepage": {
          "type": "string",
          "description": "user default's home page"
        },
        "user_preferences": {
          "type": "object",
          "properties": {
            "frameworks": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "factors_order": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "tables": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "columns_order": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "columns_hidden": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "columns_sorting": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "column": {
                          "type": "string"
                        },
                        "order": {
                          "type": "string"
                        }
                      },
                      "additionalProperties": false
                    }
                  }
                },
                "additionalProperties": false
              }
            },
            "company_overview": {
              "type": "object",
              "properties": {
                "opt_in": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false,
              "required": [
                "opt_in"
              ]
            },
            "attribution_log": {
              "type": "object",
              "properties": {
                "opt_in": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false,
              "required": [
                "opt_in"
              ]
            },
            "v3scoring": {
              "type": "object",
              "properties": {
                "show_impacts_in_issues_table": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false,
              "required": [
                "show_impacts_in_issues_table"
              ]
            },
            "feedback": {
              "type": "object",
              "properties": {
                "issues": {
                  "type": "object",
                  "properties": {},
                  "additionalProperties": true
                }
              },
              "additionalProperties": false,
              "required": [
                "issues"
              ]
            },
            "max_dashboard_layout": {
              "type": "object",
              "properties": {
                "sections": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "widgets": {
                  "type": "object",
                  "properties": {},
                  "additionalProperties": true
                }
              },
              "additionalProperties": false
            },
            "language": {
              "type": "string"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false,
      "description": "User settings"
    },
    "teams": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
            "description": "team id"
          },
          "name": {
            "type": "string",
            "description": "team name"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "name"
        ]
      },
      "description": "teams the user is member of"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "wizard_steps": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "list of proceeded onboarding wizard steps"
        },
        "wizards": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "steps": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            "additionalProperties": false,
            "required": [
              "name",
              "steps"
            ]
          },
          "description": "array of name and steps of wizard, steps - array of strings"
        },
        "user_role": {
          "type": "string",
          "description": "user role within his company"
        },
        "user_goals": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "list of chosen goals in business trial"
        },
        "business_trial": {
          "type": "object",
          "properties": {
            "completed_wizards": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "list of completed wizards"
            },
            "has_visited_getting_started_page": {
              "type": "boolean",
              "description": "if the user has visited the Getting Started page (/start) on the platform"
            }
          },
          "additionalProperties": false,
          "description": "additional information about business trials"
        },
        "smb_dashboard": {
          "type": "object",
          "properties": {
            "completed_tasks": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "list of IDs of completed Today's tasks"
            }
          },
          "additionalProperties": false,
          "description": "additional information about SMB dashboard"
        }
      },
      "additionalProperties": false,
      "description": "user's metadata"
    },
    "two_factor_enabled": {
      "type": "boolean",
      "description": "true if the user has 2fa enabled"
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "username",
    "email",
    "created",
    "customer_id",
    "roles"
  ],
  "description": "a person that uses any system at SecurityScorecard"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/v2/users/by-username/<username>' \
  -H 'Authorization: Bearer <your-api-token>'
```
