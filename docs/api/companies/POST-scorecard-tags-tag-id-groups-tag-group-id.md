# Add scorecard tag to a scorecard tag group

- **Method:** `POST`
- **Path:** `/scorecard-tags/{tag_id}/groups/{tag_group_id}`
- **Category:** `companies`
- **Operation ID:** `post_scorecard-tags-tag-id-groups-tag-group-id`

## Description

Add scorecard tag to a scorecard tag group

## Path Parameters

- `tag_group_id` (**Required**) - tag group id
- `tag_id` (**Required**) - tag id

## Responses

### 200
No response body

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/scorecard-tags/<tag_id>/groups/<tag_group_id>' \
  -H 'Authorization: Bearer <your-api-token>'
```
