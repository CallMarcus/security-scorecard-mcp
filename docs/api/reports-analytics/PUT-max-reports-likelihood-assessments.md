# Publish or unpublish the report

- **Method:** `PUT`
- **Path:** `/max/reports/likelihood-assessments`
- **Category:** `reports-analytics`
- **Operation ID:** `putReportsLikelihoodAssessments`

## Request Body

```json
{
  "type": "object",
  "properties": {
    "is_published": {
      "type": "boolean",
      "description": "if true publishes the report, if false changes the reports to draft"
    },
    "ids": {
      "type": "array",
      "description": "List of ids to Publish",
      "items": {
        "type": "string",
        "description": "ids of the published report"
      }
    }
  },
  "required": [
    "is_published"
  ],
  "additionalProperties": false
}
```

## Responses

### 200
Data was updated successfully
```json
{
  "type": "object",
  "properties": {
    "failed": {
      "type": "array",
      "description": "List of ids to that were updated successfully",
      "items": {
        "type": "string",
        "description": "ids of reports that published or un published"
      }
    },
    "message": {
      "type": "string",
      "description": "Status update message"
    }
  },
  "additionalProperties": false
}
```

## Example Request

```bash
curl -X PUT \
  'https://platform.securityscorecard.io/max/reports/likelihood-assessments' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
