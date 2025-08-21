# Get a company's active issues

- **Method:** `GET`
- **Path:** `/companies/{scorecard_identifier}/active-issues`
- **Category:** `companies`
- **Operation ID:** `get_companies-scorecard-identifier-active-issues`

## Path Parameters

- `scorecard_identifier` (**Required**) - primary identifier of a company or scorecard

## Query Parameters

- `issue_types` (array, Optional) - List of issue types to filter by (e.g., tlscert_weak_signature, tlscert_self_signed)

## Responses

### 200
company's active issues
```json
{
  "$ref": "#/definitions/CompanyActiveIssues"
}
```

### 400
Bad Request: The scorecard_identifier or the authorization header is malformed.

### 401
Unauthorized

### 403
to access scorecard's active issues level data, company must be added to a portfolio first.

### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/companies/<scorecard_identifier>/active-issues' \
  -H 'Authorization: Bearer <your-api-token>'
```
