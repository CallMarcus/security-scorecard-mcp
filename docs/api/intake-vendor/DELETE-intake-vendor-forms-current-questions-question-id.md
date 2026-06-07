# Delete a question from the current intake vendor form

- **Method:** `DELETE`
- **Path:** `/intake-vendor/forms/current/questions/{question_id}`
- **Tag:** `intake-vendor`
- **operationId:** `deleteCurrentFormQuestion`

## Description
Deletes a single question from the current intake vendor form.

## Path Parameters
- `question_id` (**required**) — ID of the question to delete.

## Responses
### 204
Question was deleted successfully
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Question or current intake vendor form was not found

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//intake-vendor/forms/current/questions/<question_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

