# Update a question on the current intake vendor form

- **Method:** `PUT`
- **Path:** `/intake-vendor/forms/current/questions/{question_id}`
- **Tag:** `intake-vendor`
- **operationId:** `updateCurrentFormQuestion`

## Description
Updates a single question on the current intake vendor form.

## Path Parameters
- `question_id` (**required**) — ID of the question to update.

## Request Body
```json
{
  "$ref": "#/definitions/IntakeVendorQuestionInput"
}
```

## Responses
### 200
Question was updated successfully
```json
{
  "$ref": "#/definitions/IntakeVendorQuestion"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Question or current intake vendor form was not found

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//intake-vendor/forms/current/questions/<question_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

