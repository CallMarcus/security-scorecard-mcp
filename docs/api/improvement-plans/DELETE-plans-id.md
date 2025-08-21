# Delete plan by ID

- **Method:** `DELETE`
- **Path:** `/plans/{id}`
- **Category:** `improvement-plans`
- **Operation ID:** `deletePlansById`

## Path Parameters

- `id` (**Required**) - unique plan id

## Responses

### 204
Delete user plan by ID

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/plans/<id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
