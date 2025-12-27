# Get all companies associated with a scorecard tag

- **Method:** `GET`
- **Path:** `/scorecard-tags/{id}/companies`
- **Tag:** `scorecard-tags`
- **operationId:** `get_scorecard-tags-id-companies`

## Path Parameters
- `id` (**required**) — a scorecard tag unique id

## Query Parameters
- `grade` (optional, string) — company score grade filter
- `industry` (optional, string) — industry filter
- `vulnerability` (optional, string) — CVE vulnerability filter
- `issue_type` (optional, string) — issue type filter
- `status` (optional, string) — company status
- `had_breach_within_last_days` (optional, number) — companies with breaches in last N days

## Responses
### 200
the list of companies
```json
{
  "$ref": "#/definitions/PortfolioCompaniesList"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scorecard-tags/<id>/companies' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

