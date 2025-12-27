# Remove scorecard tag from a scorecard tag group

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{tag_id}/groups/{tag_group_id}`
- **Tag:** `Tag`
- **operationId:** `delete_scorecard-tags-tag-id-groups-tag-group-id`

## Description
Remove scorecard tag from a scorecard tag group

## Path Parameters
- `tag_group_id` (**required**) — tag group id
- `tag_id` (**required**) — tag id

## Responses
### 200
No response body

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//scorecard-tags/<tag_id>/groups/<tag_group_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

