# Get reports you have generated recently

- **Method:** `GET`
- **Path:** `/reports/recent`
- **Category:** `reports-analytics`
- **Operation ID:** `get_reports-recent`

## Responses

### 200
reports generated in the last 7 days
```json
{
  "$ref": "#/definitions/ReportsList"
}
```

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/reports/recent' \
  -H 'Authorization: Bearer <your-api-token>'
```
