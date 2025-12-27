# Delete the remediation plan

- **Method:** `DELETE`
- **Path:** `/max/reports/remediation-plans/{id}`
- **Tag:** `V1`
- **operationId:** `deleteV1ReportsRemediationPlansById`

## Path Parameters
- `id` (**required**) — id of the remediation plan to be deleted

## Responses
### 204
Deleted successfully

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/reports/remediation-plans/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

