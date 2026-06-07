# get portfolios belonging to an organization

- **Method:** `GET`
- **Path:** `/v2/organizations/{id}/portfolios`
- **Tag:** `Organization`
- **operationId:** `get_v2-organizations-id-portfolios`

## Description
get portfolios belonging to an organization

## Path Parameters
- `id` (**required**) — id of user organization

## Query Parameters
- `query` (optional, string) — query portfolio by name
- `filter_by_team` (optional, string) — filter by team id
- `filter_by_visibility` (optional, string) — filter by visibility (PRIVATE | TEAM | COMPANY_PUBLIC)
- `count_companies` (optional, boolean) — count companies in a portfolio
- `sort` (optional, string) — sort portfolios, supported criteria: (-)name, (-)description, (-)visibility, (-)companies_count, (-)created_by, (-)created_at, (-)updated_by, (-)updated_at
- `page` (optional, integer) — page number, 0 is the first page (default: 0)
- `page_size` (optional, integer) — number of portfolios per page (max: 400, default: 50)

## Responses
### 200
A page in a list of OrganizationPortfolios
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
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
          "visibility": {
            "type": "string",
            "description": "visibility of the portfolio"
          },
          "companies_count": {
            "type": "number",
            "description": "number of companies in the portfolio"
          },
          "is_default": {
            "type": "boolean",
            "description": "if is the default portfolio"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "user creation datetime"
          },
          "created_by": {
            "type": "string",
            "description": "user created by"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "user update datetime"
          },
          "updated_by": {
            "type": "string",
            "description": "user updated by"
          },
          "owner_organization_id": {
            "type": "string"
          },
          "owner_user_id": {
            "type": "string"
          },
          "owner_team_id": {
            "type": "string"
          },
          "is_managed": {
            "type": "boolean",
            "description": "true if the portfolio is managed within the MAX"
          }
        },
        "additionalProperties": false,
        "required": [
          "id",
          "name",
          "description",
          "visibility",
          "is_default",
          "created_at",
          "created_by",
          "updated_at",
          "updated_by"
        ],
        "description": "reference to a portfolio"
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "page",
    "size"
  ],
  "description": "A page in a list of OrganizationPortfolios"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v2/organizations/<id>/portfolios' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

