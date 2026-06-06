# Delete a scorecard tag

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{id}`
- **Category:** `companies`
- **Operation ID:** `delete_scorecard-tags-id`

## Description

Delete a scorecard tag

## Path Parameters

- `id` (**Required**) - scorecard tag id

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/scorecard-tags/<id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
