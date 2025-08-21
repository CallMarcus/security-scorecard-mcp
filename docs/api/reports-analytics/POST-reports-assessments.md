# Create an Atlas Assessments job request

- **Method:** `POST`
- **Path:** `/reports/assessments`
- **Category:** `reports-analytics`
- **Operation ID:** `post_reports-assessments`

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

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/reports/assessments' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
