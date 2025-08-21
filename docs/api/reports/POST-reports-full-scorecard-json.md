# Generate a Full Scorecard report

- **Method:** `POST`
- **Path:** `/reports/full-scorecard-json`
- **Tag:** `reports`
- **operationId:** `post_reports-full-scorecard-json`

## Description
Note: requesting a report for a company where score is still calculating will be accepted, but might fail to generate if a score is not determined soon enough. It's recommended to check a score is available before requesting a report

## Request Body
```json
{
  "$ref": "#/definitions/FullScorecardReportCreation"
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
scorecard not found, or user has no access to it.

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/full-scorecard-json' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

