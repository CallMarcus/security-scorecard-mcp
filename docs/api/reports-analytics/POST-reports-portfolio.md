# Generate a Portfolio report

- **Method:** `POST`
- **Path:** `/reports/portfolio`
- **Category:** `reports-analytics`
- **Operation ID:** `post_reports-portfolio`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/reports/portfolio' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
