# Generate a Company Partnership report

- **Method:** `POST`
- **Path:** `/reports/partnership`
- **Category:** `reports-analytics`
- **Operation ID:** `post_reports-partnership`

## Description

Note: requesting a report for a company where score is still calculating will be accepted, but might fail to generate if a score is not determined soon enough. It's recommended to check a score is available before requesting a report

## Request Body

```json
{
  "$ref": "#/definitions/PartnershipReportCreation"
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
  'https://platform.securityscorecard.io/reports/partnership' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
