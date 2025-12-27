# get metadata for the factors used when scoring com

- **Method:** `GET`
- **Path:** `/metadata/factors`
- **Tag:** `metadata`
- **operationId:** `get_metadata-factors`

## Description
get metadata for the factors used when scoring companies

## Responses
### 200
List of FactorMetadata
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
            "x-example": "application_security"
          },
          "name": {
            "type": "string",
            "x-example": "Application Security",
            "description": "human-readable name"
          },
          "description": {
            "type": "string",
            "x-example": "Application Security",
            "description": "human-readable name"
          },
          "long_description": {
            "type": "string",
            "x-example": "Application Security",
            "description": "long explanation of the factor"
          }
        },
        "additionalProperties": false,
        "required": [
          "key",
          "name",
          "description"
        ],
        "description": "metadata for a factor used when scoring a company"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of FactorMetadata"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//metadata/factors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

