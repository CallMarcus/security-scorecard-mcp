# Generate a Company Events report

- **Method:** `POST`
- **Path:** `/reports/events-json`
- **Tag:** `reports`
- **operationId:** `post_reports-events-json`

## Description
Note: requesting a report for a company where score is still calculating will be accepted, but might fail to generate if a score is not determined soon enough. It's recommended to check a score is available before requesting a report

## Request Body
```json
{
  "$ref": "#/definitions/EventsReportCreation"
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
company not found, or user has no access to it.

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/events-json' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

