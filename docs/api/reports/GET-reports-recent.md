# Get reports you have generated recently

- **Method:** `GET`
- **Path:** `/reports/recent`
- **Tag:** `reports`
- **operationId:** `get_reports-recent`

## Responses
### 200
reports generated in the last 7 days
```json
{
  "$ref": "#/definitions/ReportsList"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//reports/recent' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

