# Search companies in bulk

- **Method:** `POST`
- **Path:** `/companies/bulk-searches`
- **Tag:** `Company`
- **operationId:** `post_companies-bulk-searches`

## Description
Search companies in bulk

## Request Body
```json
{
  "type": "object",
  "properties": {
    "searches": {
      "type": "array",
      "items": {
        "type": "string",
        "x-example": "Microsoft"
      },
      "description": "search text array"
    },
    "maxSearches": {
      "type": "integer",
      "default": 100000,
      "description": "number of searches to perform"
    }
  },
  "additionalProperties": false,
  "required": [
    "searches"
  ]
}
```

## Responses
### 201
bulk searches results
```json
{
  "type": "object",
  "properties": {
    "scorecards": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "order": {
            "type": "number"
          },
          "id": {
            "type": "string",
            "x-example": "5f1b0b5b-5b9b-4b0a-9e1a-0b5b9b4b0a9e"
          },
          "domain": {
            "type": "string",
            "x-example": "example.com"
          },
          "name": {
            "type": "string",
            "x-example": "Example Ltd"
          },
          "follows": {
            "type": "number",
            "x-example": 128
          },
          "searches": {
            "description": "list of scorecard original searches",
            "type": "object",
            "properties": {
              "original_query": {
                "type": "string",
                "x-example": "example ltd"
              },
              "match_query": {
                "type": "string",
                "x-example": "example"
              },
              "result": {
                "type": "string",
                "x-example": "example.com"
              },
              "source": {
                "type": "string",
                "x-example": "algolia"
              },
              "reason": {
                "type": "string",
                "x-example": "third party restricted match"
              },
              "category": {
                "type": "string",
                "x-example": "category of scorecard"
              },
              "attempt": {
                "type": "number",
                "x-example": 5
              },
              "confidence": {
                "type": "number",
                "x-example": 5
              },
              "is_new": {
                "type": "boolean",
                "x-example": true
              },
              "is_already_using_slot": {
                "type": "boolean",
                "x-example": true
              },
              "is_new_tagged": {
                "type": "boolean",
                "x-example": true
              },
              "is_already_tagged": {
                "type": "boolean",
                "x-example": true
              }
            },
            "additionalProperties": false
          },
          "contacts_count": {
            "type": "number",
            "x-example": 10
          },
          "industry_id": {
            "type": "string",
            "x-example": "retail"
          },
          "active": {
            "type": "boolean",
            "x-example": true
          }
        },
        "additionalProperties": false,
        "required": [
          "domain"
        ],
        "description": "scorecard search result"
      },
      "description": "list of domains found"
    },
    "not_found": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "order": {
            "type": "number"
          },
          "attempts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "x-example": "example ltd"
                },
                "reason": {
                  "type": "string",
                  "x-example": "global exact search no match"
                },
                "category": {
                  "type": "string",
                  "x-example": "category"
                },
                "attempt": {
                  "type": "number",
                  "x-example": 2
                },
                "original_query": {
                  "type": "string",
                  "x-example": "example ltd"
                },
                "match_query": {
                  "type": "string",
                  "x-example": "example"
                },
                "match_domain": {
                  "type": "string",
                  "x-example": "example.com"
                },
                "confidence": {
                  "type": "number",
                  "x-example": 5
                }
              },
              "additionalProperties": false,
              "description": "attempt data"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "order",
          "attempts"
        ],
        "description": "not found search data"
      },
      "description": "list of searches which has not found"
    },
    "repeated_domains": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "list of domains found and repeated"
    },
    "scorecards_repeated": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "order": {
            "type": "number"
          },
          "id": {
            "type": "string",
            "x-example": "5f1b0b5b-5b9b-4b0a-9e1a-0b5b9b4b0a9e"
          },
          "domain": {
            "type": "string",
            "x-example": "example.com"
          },
          "name": {
            "type": "string",
            "x-example": "Example Ltd"
          },
          "follows": {
            "type": "number",
            "x-example": 128
          },
          "searches": {
            "description": "list of scorecard original searches",
            "type": "object",
            "properties": {
              "original_query": {
                "type": "string",
                "x-example": "example ltd"
              },
              "match_query": {
                "type": "string",
                "x-example": "example"
              },
              "result": {
                "type": "string",
                "x-example": "example.com"
              },
              "source": {
                "type": "string",
                "x-example": "algolia"
              },
              "reason": {
                "type": "string",
                "x-example": "third party restricted match"
              },
              "category": {
                "type": "string",
                "x-example": "category of scorecard"
              },
              "attempt": {
                "type": "number",
                "x-example": 5
              },
              "confidence": {
                "type": "number",
                "x-example": 5
              },
              "is_new": {
                "type": "boolean",
                "x-example": true
              },
              "is_already_using_slot": {
                "type": "boolean",
                "x-example": true
              },
              "is_new_tagged": {
                "type": "boolean",
                "x-example": true
              },
              "is_already_tagged": {
                "type": "boolean",
                "x-example": true
              }
            },
            "additionalProperties": false
          },
          "contacts_count": {
            "type": "number",
            "x-example": 10
          },
          "industry_id": {
            "type": "string",
            "x-example": "retail"
          },
          "active": {
            "type": "boolean",
            "x-example": true
          }
        },
        "additionalProperties": false,
        "required": [
          "domain"
        ],
        "description": "scorecard search result"
      },
      "description": "list of scorecards repeated"
    },
    "not_found_repeated": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "order": {
            "type": "number"
          },
          "attempts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "query": {
                  "type": "string",
                  "x-example": "example ltd"
                },
                "reason": {
                  "type": "string",
                  "x-example": "global exact search no match"
                },
                "category": {
                  "type": "string",
                  "x-example": "category"
                },
                "attempt": {
                  "type": "number",
                  "x-example": 2
                },
                "original_query": {
                  "type": "string",
                  "x-example": "example ltd"
                },
                "match_query": {
                  "type": "string",
                  "x-example": "example"
                },
                "match_domain": {
                  "type": "string",
                  "x-example": "example.com"
                },
                "confidence": {
                  "type": "number",
                  "x-example": 5
                }
              },
              "additionalProperties": false,
              "description": "attempt data"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "order",
          "attempts"
        ],
        "description": "not found search data"
      },
      "description": "list of searches which has not found and repeated"
    }
  },
  "additionalProperties": false,
  "required": [
    "scorecards",
    "not_found",
    "repeated_domains"
  ],
  "description": "bulk searches results"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//companies/bulk-searches' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

