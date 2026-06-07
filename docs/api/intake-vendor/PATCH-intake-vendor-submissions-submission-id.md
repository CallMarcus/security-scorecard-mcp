# Update review state on an intake vendor form submission

- **Method:** `PATCH`
- **Path:** `/intake-vendor/submissions/{submission_id}`
- **Tag:** `intake-vendor`
- **operationId:** `patchSubmission`

## Description
Updates the review state on an intake vendor form submission for the current organization.

## Path Parameters
- `submission_id` (**required**) — ID of the submission to update.

## Request Body
```json
{
  "$ref": "#/definitions/IntakeVendorSubmissionPatch"
}
```

## Responses
### 200
Submission was updated successfully
```json
{
  "$ref": "#/definitions/IntakeVendorSubmission"
}
```
### 400
Invalid request body
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Submission was not found for this organization

## Example cURL Request
```bash
curl -X PATCH \
  'https://api.securityscorecard.io//intake-vendor/submissions/<submission_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

