# Get the score plan by score target

- **Method:** `GET`
- **Path:** `/companies/{domain}/score-plans/by-target/{score}`
- **Category:** `companies`
- **Operation ID:** `get_companies-domain-score-plans-by-target-score`

## Path Parameters

- `domain` (**Required**) - primary domain identifying a company
- `score` (**Required**) - score target: the score you want to reach

## Responses

### 200
issue context in similar companies
```json
{
  "$ref": "#/definitions/ScorePlan"
}
```

### 403
to access this scorecard, company must be added to a portfolio first.

### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<domain>/score-plans/by-target/<score>' \
  -H 'Authorization: Bearer <your-api-token>'
```
