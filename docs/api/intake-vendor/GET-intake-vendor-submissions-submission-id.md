# Get a single intake vendor form submission

- **Method:** `GET`
- **Path:** `/intake-vendor/submissions/{submission_id}`
- **Tag:** `intake-vendor`
- **operationId:** `getSubmission`

## Description
Returns a single intake vendor form submission for the current organization.

## Path Parameters
- `submission_id` (**required**) — ID of the submission to fetch.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeVendorSubmission"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource
### 404
Submission was not found for this organization

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/submissions/<submission_id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

