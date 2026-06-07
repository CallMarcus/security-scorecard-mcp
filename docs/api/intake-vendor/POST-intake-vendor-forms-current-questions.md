# Create questions on the current intake vendor form

- **Method:** `POST`
- **Path:** `/intake-vendor/forms/current/questions`
- **Tag:** `intake-vendor`
- **operationId:** `createCurrentFormQuestions`

## Description
Creates one or more questions on the current intake vendor form. Questions are appended in bulk, with display_order assigned by the server.

## Request Body
```json
{
  "type": "object",
  "required": [
    "questions"
  ],
  "properties": {
    "questions": {
      "type": "array",
      "description": "Questions to append to the current form.",
      "items": {
        "$ref": "#/definitions/IntakeVendorQuestionInput"
      }
    }
  }
}
```

## Responses
### 201
Questions were created successfully
```json
{
  "type": "object",
  "properties": {
    "questions": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/IntakeVendorQuestion"
      }
    }
  }
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
No current intake vendor form was found for this organization

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//intake-vendor/forms/current/questions' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

