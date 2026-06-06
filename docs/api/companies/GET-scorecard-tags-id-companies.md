# Get all companies associated with a scorecard tag

- **Method:** `GET`
- **Path:** `/scorecard-tags/{id}/companies`
- **Category:** `companies`
- **Operation ID:** `get_scorecard-tags-id-companies`

## Path Parameters

- `id` (**Required**) - a scorecard tag unique id

## Query Parameters

- `grade` (string, Optional) - company score grade filter
- `industry` (string, Optional) - industry filter
- `vulnerability` (string, Optional) - CVE vulnerability filter
- `issue_type` (string, Optional) - issue type filter
- `status` (string, Optional) - company status
- `had_breach_within_last_days` (number, Optional) - companies with breaches in last N days

## Responses

### 200
the list of companies
```json
{
  "$ref": "#/definitions/PortfolioCompaniesList"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/scorecard-tags/<id>/companies' \
  -H 'Authorization: Bearer <your-api-token>'
```
