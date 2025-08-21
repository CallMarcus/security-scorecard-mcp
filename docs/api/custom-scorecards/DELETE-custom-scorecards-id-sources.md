# Delete custom scorecard sources

- **Method:** `DELETE`
- **Path:** `/custom-scorecards/{id}/sources`
- **Tag:** `custom scorecards`
- **operationId:** `delete_custom-scorecards-id-sources`

## Description
Delete custom scorecard sources

## Path Parameters
- `id` (**required**) — id of custom scorecard to delete sources

## Request Body
```json
{
  "type": "object",
  "properties": {
    "sources": {
      "type": "array",
      "items": {
        "type": "string",
        "x-example": "[\"5f5e1b1b4b1f4b0001b1f4b0\", \"cisco.com\"]"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "sources"
  ]
}
```

## Responses
### 200
response for creating a custom scorecard
```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "x-example": "9b3b2932-c5a0-46cf-825a-163ed51e7a8d",
      "description": "custom scorecard id"
    },
    "uuid": {
      "type": "string",
      "format": "uuid",
      "pattern": "^[\\da-z-]{16,}$",
      "x-example": "9b3b2932-c5a0-46cf-825a-163ed51e7a8d",
      "description": "uuid to identify custom scorecard"
    },
    "name": {
      "type": "string",
      "x-example": "custom scorecard name",
      "description": "name of the custom scorecard"
    },
    "description": {
      "type": "string",
      "x-example": "custom scorecard description",
      "description": "description of the custom scorecard"
    },
    "managed_by": {
      "type": "string",
      "x-example": "private",
      "description": "specify edit access levels of private (me only), team, or company"
    },
    "share_with": {
      "type": "string",
      "description": "specify who can access this scorecard, if company wide or public to anyone in the platform"
    },
    "visibility_level": {
      "type": "string",
      "description": "specify who can see this scorecard, if private, company or public in the platform"
    },
    "team_id": {
      "type": "string",
      "x-example": "eac3f898-4a47-41bf-9a6d-fa3cb5bd4762",
      "description": "unique identifier of the team that manages a custom scorecard"
    },
    "owned_by": {
      "type": "string",
      "x-example": "user@example.com",
      "description": "specify who owns the custom scorecard, only when managedBy value is private"
    },
    "is_entity": {
      "type": "boolean",
      "x-example": true
    },
    "has_write_permissions": {
      "type": "boolean",
      "description": "The user has permissions to modify the custom scorecard"
    },
    "customer_id": {
      "type": "string",
      "x-example": "5640d975e4b0f93fc5c4beea",
      "description": "the organization id of the user who created the custom scorecard"
    },
    "base": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "domain": {
            "type": "string",
            "x-example": "securityscorecard.com",
            "description": "domain of the custom scorecard"
          },
          "name": {
            "type": "string",
            "x-example": "SecurityScorecard",
            "description": "name of the custom scorecard"
          },
          "grade": {
            "type": "string",
            "x-example": "A",
            "description": "grade of the custom scorecard"
          },
          "score": {
            "type": "integer",
            "x-example": 100,
            "description": "score of the custom scorecard"
          }
        },
        "additionalProperties": false
      },
      "description": "collection of parent scorecards whose digital footprints were\n      filtered in order to create a custom scorecard"
    },
    "filter": {
      "type": "object",
      "properties": {
        "ips": {
          "type": "array",
          "items": {
            "type": "string",
            "x-example": "[\"1.22.33.44\"]"
          },
          "description": "collection of footprint ip filters"
        },
        "domains": {
          "type": "array",
          "items": {
            "type": "string",
            "x-example": "[\"example.org\"]"
          },
          "description": "collection of footprint domain filters"
        },
        "countries": {
          "type": "array",
          "items": {
            "type": "string",
            "x-example": "[\"US\"]"
          },
          "description": "collection of footprint country filters"
        },
        "filter_toggle_setting": {
          "type": "string",
          "description": "filter toggle setting"
        }
      },
      "additionalProperties": false,
      "required": [
        "ips",
        "domains"
      ],
      "description": "base footprint filters that make up a custom scorecard"
    },
    "bulk": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "filename": {
            "type": "string",
            "description": "name of the file used to load this bulk"
          },
          "excludes": {
            "type": "boolean",
            "description": "true to exclude assets matching bulk filters (defaults to false, meaning, to include)"
          },
          "ips": {
            "type": "array",
            "items": {
              "type": "string",
              "x-example": "[\"1.1.1.1\"]"
            },
            "description": "collection of footprint ip filters"
          },
          "domains": {
            "type": "array",
            "items": {
              "type": "string",
              "x-example": "[\"example.org\"]"
            },
            "description": "collection of footprint domain filters"
          }
        },
        "additionalProperties": false,
        "required": [
          "filename"
        ]
      },
      "description": "optional footprint filters loaded in bulk from a file (CSV)"
    },
    "created": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "created date"
    },
    "created_by": {
      "type": "string",
      "x-example": "user@example.com",
      "description": "user who created the custom scorecard"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
      "description": "updated date"
    },
    "updated_by": {
      "type": "string",
      "x-example": "editor@example.com",
      "description": "user who last updated the custom scorecard"
    },
    "grade": {
      "type": "string",
      "x-example": "A",
      "description": "grade of the custom scorecard"
    },
    "score": {
      "type": "number",
      "x-example": 94,
      "description": "score of the custom scorecard"
    },
    "provisional": {
      "type": "boolean",
      "description": "true if a custom scorecard was scored by Fast Score"
    },
    "version": {
      "type": "number",
      "x-example": 3,
      "description": "Version number of Recipe field"
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "string",
        "x-example": "[\"5f5e1b1b4b1f4b0001b1f4b0\", \"cisco.com\"]"
      },
      "description": "Source Scorecards list"
    },
    "filters": {
      "type": "object",
      "properties": {
        "includes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "index": {
                "type": "number",
                "description": "index of the filter"
              },
              "include": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "index": {
                      "type": "number",
                      "description": "index of the filter"
                    },
                    "condition": {
                      "type": "string",
                      "x-example": "is, is not, not, includes_all",
                      "description": "condition to apply to the filter"
                    },
                    "ip": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-example": "[\"1.1.1.1\", \"192.168.0.1\"]"
                      },
                      "description": "list of footprint ips filters to add"
                    },
                    "domain": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-example": "[\"example.com\", \"example.org\"]"
                      },
                      "description": "list of footprint domains filters to add"
                    },
                    "country": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-example": "[\"US\", \"CA\"]"
                      },
                      "description": "list of footprint countries filters to add"
                    },
                    "footprint_tags": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-example": "[\"eac3f898-4a47-41bf-9a6d-fa3cb5bd4762\"]"
                      },
                      "description": "list of footprint tags filters to add"
                    },
                    "associated_assets": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-example": "[\"includes_domain\", \"includes_ip\"]"
                      },
                      "description": "condition to apply to the filter"
                    }
                  },
                  "additionalProperties": false,
                  "description": "custom scorecard filter condition"
                },
                "description": "list of footprint filters to include"
              }
            },
            "additionalProperties": false
          },
          "description": "list of include filters to include"
        },
        "excludes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "index": {
                "type": "number",
                "description": "index of the filter"
              },
              "condition": {
                "type": "string",
                "x-example": "is, is not, not, includes_all",
                "description": "condition to apply to the filter"
              },
              "ip": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-example": "[\"1.1.1.1\", \"192.168.0.1\"]"
                },
                "description": "list of footprint ips filters to add"
              },
              "domain": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-example": "[\"example.com\", \"example.org\"]"
                },
                "description": "list of footprint domains filters to add"
              },
              "country": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-example": "[\"US\", \"CA\"]"
                },
                "description": "list of footprint countries filters to add"
              },
              "footprint_tags": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-example": "[\"eac3f898-4a47-41bf-9a6d-fa3cb5bd4762\"]"
                },
                "description": "list of footprint tags filters to add"
              },
              "associated_assets": {
                "type": "array",
                "items": {
                  "type": "string",
                  "x-example": "[\"includes_domain\", \"includes_ip\"]"
                },
                "description": "condition to apply to the filter"
              }
            },
            "additionalProperties": false,
            "description": "custom scorecard filter condition"
          },
          "description": "list of footprint filters to exclude"
        },
        "issues": {
          "type": "object",
          "properties": {
            "include": {
              "type": "array",
              "items": {
                "type": "string",
                "x-example": "[\"api_key_exposed\", \"age_exposed\"]"
              },
              "description": "list of issues to filter"
            },
            "exclude": {
              "type": "array",
              "items": {
                "type": "string",
                "x-example": "[\"api_key_exposed\", \"age_exposed\"]"
              },
              "description": "list of issues to filter"
            }
          },
          "additionalProperties": false,
          "description": "list of issues to filter"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false,
  "required": [
    "id",
    "uuid",
    "name",
    "customer_id",
    "base",
    "filter",
    "created",
    "created_by",
    "version",
    "sources",
    "filters"
  ],
  "description": "response for creating a custom scorecard"
}
```

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//custom-scorecards/<id>/sources' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

