# Add scorecard tag to a scorecard tag group

- **Method:** `POST`
- **Path:** `/scorecard-tags/{tag_id}/groups/{tag_group_id}`
- **Tag:** `Tag`
- **operationId:** `post_scorecard-tags-tag-id-groups-tag-group-id`

## Description
Add scorecard tag to a scorecard tag group

## Path Parameters
- `tag_group_id` (**required**) — tag group id
- `tag_id` (**required**) — tag id

## Responses
### 200
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//scorecard-tags/<tag_id>/groups/<tag_group_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

