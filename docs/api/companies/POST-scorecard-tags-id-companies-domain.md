# Add a scorecard tag to a company

- **Method:** `POST`
- **Path:** `/scorecard-tags/{id}/companies/{domain}`
- **Category:** `companies`
- **Operation ID:** `post_scorecard-tags-id-companies-domain`

## Path Parameters

- `id` (**Required**) - a scorecard tag unique id
- `domain` (**Required**) - a company's internet domain. this parameter accepts any valid internet domain.

## Responses

### 200
added company's summary
```json
{
  "$ref": "#/definitions/CompanySummary"
}
```

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/scorecard-tags/<id>/companies/<domain>' \
  -H 'Authorization: Bearer <your-api-token>'
```
