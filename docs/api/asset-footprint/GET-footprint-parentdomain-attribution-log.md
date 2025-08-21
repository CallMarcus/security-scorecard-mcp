# Get the attribution log for the parent domain

- **Method:** `GET`
- **Path:** `/footprint/{parentDomain}/attribution-log`
- **Category:** `asset-footprint`
- **Operation ID:** `getByParentdomainAttributionLog`

## Path Parameters

- `parentDomain` (**Required**) - parent domain

## Query Parameters

- `date-from` (string, Optional) - start date time range
- `date-to` (string, Optional) - end date time range
- `sort-field` (string, Optional) - sort field
- `filters` (string, Optional) - filters field
- `filter-operator` (string, Optional) - filter operation, expected values: and | or
- `page` (number, Optional) - required page number, first page is 0
- `page-size` (number, Optional) - size of the pages in the paginated result

## Responses

### 200
asset attribution log schema
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "description": "attribution log asset date"
          },
          "impact": {
            "type": "number",
            "description": "sum impact of issue findings associated with the asset"
          },
          "asset_value": {
            "type": "string",
            "description": "domain or ip attributed"
          },
          "id": {
            "type": "string",
            "description": "id of the observation asset"
          },
          "unique_id": {
            "type": "string",
            "description": "id of the observation"
          },
          "change": {
            "type": "string",
            "description": "description of the change"
          },
          "latest_date": {
            "type": "string",
            "description": "date of the latest observation of the given asset"
          },
          "latest_change": {
            "type": "string",
            "description": "description of the latest change of the given asset"
          },
          "reason": {
            "type": "string",
            "description": "reason of the change"
          }
        },
        "required": [
          "date",
          "asset_value",
          "id",
          "unique_id",
          "change",
          "latest_date",
          "latest_change"
        ],
        "additionalProperties": false
      }
    },
    "size": {
      "type": "number"
    }
  },
  "required": [
    "entries",
    "size"
  ],
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/footprint/<parentDomain>/attribution-log' \
  -H 'Authorization: Bearer <your-api-token>'
```
