# Generate a Full Scorecard report

- **Method:** `POST`
- **Path:** `/reports/full-scorecard-json`
- **Category:** `reports-analytics`
- **Operation ID:** `post_reports-full-scorecard-json`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/reports/full-scorecard-json' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
