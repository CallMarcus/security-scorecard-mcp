# get a compliance framework details

- **Method:** `GET`
- **Path:** `/compliance-frameworks/{key}`
- **Tag:** `compliance`
- **operationId:** `get_compliance-frameworks-key`

## Description
get a compliance framework details

## Path Parameters
- `key` (**required**) — compliance framework key

## Responses
### 200
a compliance framework
```json
{
  "type": "object",
  "properties": {
    "standard": {
      "type": "string",
      "x-example": "NIST Core 1.1 Draft",
      "description": "human-readable standard name"
    },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "x-example": "ID.AM",
            "description": "section unique identifier"
          },
          "title": {
            "type": "string",
            "x-example": "Asset Management",
            "description": "human-readable title of this section"
          },
          "questions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "x-example": "ID.AM-1",
                  "description": "question unique identifier"
                },
                "question": {
                  "type": "string",
                  "x-example": "ID.AM-1",
                  "description": "the human-readable question"
                },
                "issue_types": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "no_match": {
                  "type": "string",
                  "x-example": "No findings that indicate unmanaged remote access.",
                  "description": "a human-readable explanation that can be used when no issue types in a company match this question"
                }
              },
              "additionalProperties": false,
              "required": [
                "id",
                "question",
                "issue_types",
                "no_match"
              ]
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "title",
          "questions"
        ]
      },
      "description": "sections in this framework"
    }
  },
  "additionalProperties": false,
  "required": [
    "standard",
    "sections"
  ],
  "description": "a compliance framework"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//compliance-frameworks/<key>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

