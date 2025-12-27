# get all available compliance frameworks

- **Method:** `GET`
- **Path:** `/compliance-frameworks`
- **Tag:** `compliance`
- **operationId:** `get_compliance-frameworks`

## Description
get all available compliance frameworks

## Responses
### 200
List of ComplianceFrameworkSummaries
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
            "x-example": "pci"
          },
          "name": {
            "type": "string",
            "x-example": "PCI",
            "description": "human-readable name"
          }
        },
        "additionalProperties": false,
        "required": [
          "key",
          "name"
        ],
        "description": "a compliance framework basic information"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of ComplianceFrameworkSummaries"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//compliance-frameworks' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

