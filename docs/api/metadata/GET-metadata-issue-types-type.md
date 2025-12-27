# get detailed metadata for the issue type

- **Method:** `GET`
- **Path:** `/metadata/issue-types/{type}`
- **Tag:** `metadata`
- **operationId:** `get_metadata-issue-types-type`

## Description
get detailed metadata for the issue type

## Path Parameters
- `type` (**required**) — the type of the issue

## Responses
### 200
detailed metadata for a type of issue
```json
{
  "type": "object",
  "properties": {
    "key": {
      "type": "string",
      "x-example": "spf_record_wildcard"
    },
    "severity": {
      "type": "string",
      "x-example": "high",
      "description": "level of severity according to security risk"
    },
    "factor": {
      "type": "string",
      "x-example": "dns_health",
      "description": "the factor this belongs to (see company score factors)"
    },
    "title": {
      "type": "string",
      "x-example": "Open DNS Resolver Detected"
    },
    "short_description": {
      "type": "string",
      "x-example": "Misconfigured DNS services were detected.",
      "description": "human-readable short description"
    },
    "long_description": {
      "type": "string",
      "x-example": "A DNS service was detected on an IP address that has ...",
      "description": "human-readable long description"
    },
    "recommendation": {
      "type": "string",
      "x-example": "According to the Open Resolver Project, the following DNS ...",
      "description": "recommendation to solve the issue"
    }
  },
  "additionalProperties": false,
  "required": [
    "key",
    "severity",
    "factor",
    "title",
    "short_description",
    "long_description",
    "recommendation"
  ],
  "description": "detailed metadata for a type of issue"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//metadata/issue-types/<type>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

