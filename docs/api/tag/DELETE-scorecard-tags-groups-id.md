# Delete a scorecard tag group

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/groups/{id}`
- **Tag:** `Tag`
- **operationId:** `delete_scorecard-tags-groups-id`

## Description
Delete a scorecard tag group

## Path Parameters
- `id` (**required**) — tag group id

## Responses
### 204
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//scorecard-tags/groups/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

