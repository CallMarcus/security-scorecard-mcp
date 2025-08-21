# Remove scorecard tag from a scorecard tag group

- **Method:** `DELETE`
- **Path:** `/scorecard-tags/{tag_id}/groups/{tag_group_id}`
- **Category:** `companies`
- **Operation ID:** `delete_scorecard-tags-tag-id-groups-tag-group-id`

## Description

Remove scorecard tag from a scorecard tag group

## Path Parameters

- `tag_group_id` (**Required**) - tag group id
- `tag_id` (**Required**) - tag id

## Responses

### 200
No response body

## Example Request

```bash
curl -X DELETE \
  'https://platform.securityscorecard.io/scorecard-tags/<tag_id>/groups/<tag_group_id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
