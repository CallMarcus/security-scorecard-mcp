# Generate a Scorecard Footprint report

- **Method:** `POST`
- **Path:** `/reports/scorecard-footprint`
- **Category:** `companies`
- **Operation ID:** `post_reports-scorecard-footprint`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/reports/scorecard-footprint' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
