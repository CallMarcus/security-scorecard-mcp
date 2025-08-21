# Create an Atlas Assessments job request

- **Method:** `POST`
- **Path:** `/reports/assessments`
- **Tag:** `assessments`
- **operationId:** `post_reports-assessments`

## Description
creates an Atlas Assessments job request

## Request Body
```json
{
  "$ref": "#/definitions/AssessmentJobCreation"
}
```

## Responses
### 201
Assessment job created successfully
```json
{
  "$ref": "#/definitions/ReportCreated"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//reports/assessments' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

