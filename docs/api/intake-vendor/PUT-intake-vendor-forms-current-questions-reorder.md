# Reorder all questions on the current intake vendor form

- **Method:** `PUT`
- **Path:** `/intake-vendor/forms/current/questions-reorder`
- **Tag:** `intake-vendor`
- **operationId:** `reorderCurrentFormQuestions`

## Description
Reorders all questions on the current intake vendor form by providing the full ordered list of question IDs. The order of IDs in the array determines the new display_order of each question.

## Request Body
```json
{
  "type": "object",
  "required": [
    "question_ids"
  ],
  "properties": {
    "question_ids": {
      "type": "array",
      "description": "Ordered list of question IDs on the current form.",
      "items": {
        "type": "string",
        "format": "uuid"
      }
    }
  }
}
```

## Responses
### 200
Questions were reordered successfully
```json
{
  "$ref": "#/definitions/IntakeVendorForm"
}
```
### 400
Invalid request body — the provided IDs do not match the current form's questions
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
No current intake vendor form was found for this organization

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//intake-vendor/forms/current/questions-reorder' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

