# Delete the remediation plan

- **Method:** `DELETE`
- **Path:** `/max/v1/partner/remediation-plans/{id}`
- **Tag:** `V1`
- **operationId:** `deleteV1PartnerRemediationPlansById`

## Path Parameters
- `id` (**required**) — id of the remediation plan to be deleted

## Responses
### 204
Deleted successfully

## Example cURL Request
```bash
curl -X DELETE \
  'https://api.securityscorecard.io//max/v1/partner/remediation-plans/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

