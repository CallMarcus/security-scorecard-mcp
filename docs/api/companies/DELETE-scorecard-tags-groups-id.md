# Delete a scorecard tag group

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/groups/{id}`
- **Category:** `companies`
- **Operation ID:** `delete_scorecard-tags-groups-id`

## Description

Delete a scorecard tag group

## Path Parameters

- `id` (**Required**) - tag group id

## Responses

### 204
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/scorecard-tags/groups/<id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
