# Remove a scorecard tag from a company

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{id}/companies/{domain}`
- **Category:** `companies`
- **Operation ID:** `delete_scorecard-tags-id-companies-domain`

## Path Parameters

- `id` (**Required**) - id of a scorecard tag you have write access to
- `domain` (**Required**) - company primary domain

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/scorecard-tags/<id>/companies/<domain>' \
  -H 'Authorization: Bearer <your-api-token>'
```
