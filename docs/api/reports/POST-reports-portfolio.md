# Generate a Portfolio report

- **Method:** `POST`
- **Path:** `/reports/portfolio`
- **Tag:** `reports`
- **operationId:** `post_reports-portfolio`

## Request Body
```json
{
  "$ref": "#/definitions/PortfolioReportCreation"
}
```

## Responses
### 200
a reference to the created report
```json
{
  "$ref": "#/definitions/ReportCreated"
}
```
### 404
portfolio not found, or user has no access to it.

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/portfolio' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

