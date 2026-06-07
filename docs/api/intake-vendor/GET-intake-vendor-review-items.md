# Get vendor intake form submission list for review

- **Method:** `GET`
- **Path:** `/intake-vendor/review-items`
- **Tag:** `intake-vendor`
- **operationId:** `getIntakeVendorReviewItems`

## Description
Returns a list of vendor intake form submissions available for review.

## Responses
### 200
Successful operation
```json
{
  "$ref": "#/definitions/IntakeVendorReviewItems"
}
```
### 401
Unauthorized — missing or invalid API token
### 403
Forbidden — not allowed to access this resource

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//intake-vendor/review-items' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

