# Gets the export urls for the published reports of the vendors

- **Method:** `GET`
- **Path:** `/max/v1/customer/reports/download`
- **Tag:** `V1`
- **operationId:** `getV1CustomerReportsDownload`

## Query Parameters
- `page` (optional, number) — page number, 0 is the first page
- `limit` (optional, number) — page size, the amount of items per page (max: 200)

## Responses
### 200
A list of published report urls of vendors of the customer
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "description": "Exported PDF urls of the vendors of the customer"
          },
          "format": {
            "type": "string",
            "description": "Format of the file"
          },
          "vendor_domain": {
            "type": "string",
            "description": "vendor domain"
          },
          "completed_at": {
            "type": "string",
            "description": "completed at date of the report"
          }
        },
        "required": [
          "url",
          "format",
          "vendor_domain",
          "completed_at"
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
  "additionalProperties": true,
  "required": [
    "entries",
    "page",
    "size",
    "total"
  ]
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/reports/download' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

