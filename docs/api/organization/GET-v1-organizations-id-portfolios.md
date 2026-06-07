# search portfolios belonging to an organization

- **Method:** `GET`
- **Path:** `/v1/organizations/{id}/portfolios`
- **Tag:** `Organization`
- **operationId:** `get_v1-organizations-id-portfolios`

## Description
search portfolios belonging to an organization

## Path Parameters
- `id` (**required**) — id of user organization

## Query Parameters
- `page_size` (optional, integer) — page size, the amount of returnable matches (max: 400, default: 10)
- `search` (optional, string) — search text representing portfolio name

## Responses
### 200
List of PortfolioSearches
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "list_id": {
            "type": "string",
            "description": "portfolio id"
          },
          "name": {
            "type": "string",
            "description": "portfolio name"
          },
          "description": {
            "type": "string",
            "description": "description of the portfolio"
          },
          "type": {
            "type": "string",
            "description": "portfolio privacy level"
          },
          "is_editable": {
            "type": "boolean",
            "description": "boolean flag representing if a portfolio can be edited"
          },
          "team_id": {
            "type": "string",
            "description": "uuid of team that portfolio belongs to"
          },
          "team_name": {
            "type": "string",
            "description": "name of team that portfolio belongs to"
          },
          "created_by": {
            "type": "string",
            "description": "creator user"
          },
          "created_on": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "date of the creation of the tag"
          },
          "updated_on": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "date of the update of the tag"
          }
        },
        "additionalProperties": false,
        "required": [
          "list_id",
          "name",
          "type"
        ],
        "description": "reference to a portfolio"
      }
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "List of PortfolioSearches"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/organizations/<id>/portfolios' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

