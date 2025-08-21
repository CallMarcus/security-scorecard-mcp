# Generate a Scorecard Footprint report

- **Method:** `POST`
- **Path:** `/reports/scorecard-footprint`
- **Tag:** `reports`
- **operationId:** `post_reports-scorecard-footprint`

## Description
deprecated, use /reports/footprints-ips and /reports/footprint-domains instead

## Request Body
```json
{
  "$ref": "#/definitions/ScorecardFootprintCSVReportCreation"
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
  'https://api.securityscorecard.io//reports/scorecard-footprint' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

