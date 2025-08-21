# Generate a Company Detailed report

- **Method:** `POST`
- **Path:** `/reports/detailed`
- **Tag:** `reports`
- **operationId:** `post_reports-detailed`

## Description
Note: requesting a report for a company where score is still calculating will be accepted, but might fail to generate if a score is not determined soon enough. It's recommended to check a score is available before requesting a report

## Request Body
```json
{
  "$ref": "#/definitions/CompanyReportCreation"
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
### 403
company must be added to a portfolio first.
### 404
company doesn't have a scorecard yet, you can add it to any portfolio to get the company scored.

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/detailed' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

