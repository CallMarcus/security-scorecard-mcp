# get metadata for all issue types that can be detec

- **Method:** `GET`
- **Path:** `/metadata/issue-types`
- **Tag:** `metadata`
- **operationId:** `get_metadata-issue-types`

## Description
get metadata for all issue types that can be detected in a company

## Responses
### 200
List of IssueTypeMetadata
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "key": {
            "type": "string",
            "x-example": "x_xss_protection_incorrect_v2"
          },
          "severity": {
            "type": "string",
            "x-example": "high",
            "description": "level of severity according to security risk"
          },
          "factor": {
            "type": "string",
            "x-example": "application_security",
            "description": "the factor this belongs to (see company score factors)"
          },
          "title": {
            "type": "string",
            "x-example": "Website does not implement X-XSS-Protection Best Practices",
            "description": "human-readable description"
          }
        },
        "additionalProperties": false,
        "required": [
          "key",
          "severity",
          "factor",
          "title"
        ],
        "description": "metadata for a type of issue that SecurityScorecard can identify in a company"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of IssueTypeMetadata"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//metadata/issue-types' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

