# Generate a Company Compliance Framework Report in CSV

- **Method:** `POST`
- **Path:** `/reports/compliance/csv/export`
- **Tag:** `reports`
- **operationId:** `post_reports-compliance-csv-export`

## Description
This endpoint generates a compliance framework report for a company in CSV format.

## Request Body
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "The name of the report (e.g., DORA)."
    },
    "domain": {
      "type": "string",
      "description": "The domain of the company for which the report is being generated."
    },
    "metricId": {
      "type": "string",
      "description": "The metric ID representing the framework (e.g., DORA.framework)."
    }
  },
  "required": [
    "name",
    "domain",
    "metricId"
  ]
}
```

## Responses
### 200
CSV file containing the compliance framework report
### 403
The company must be added to a portfolio before generating a report.
### 404
The specified company does not have a scorecard. Add the company to a portfolio to initiate scoring.

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/compliance/csv/export' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

