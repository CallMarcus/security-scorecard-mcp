# Get incident likelihood over time for the authenticated customer

- **Method:** `GET`
- **Path:** `/max/v1/customer/incident-likelihood-over-time/{end_date}`
- **Tag:** `V1`
- **operationId:** `getV1CustomerIncidentLikelihoodOverTimeByEnddate`

## Description
Retrieves incident likelihood data for the last 4 quarters ending at the specified date

## Path Parameters
- `end_date` (**required**) — End date in YYYY-MM-DD format to calculate the last 4 quarters from

## Responses
### 200
Incident likelihood over time data for the last 4 quarters
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "quarter": {
            "type": "string",
            "description": "Quarter in ISO format (YYYY-QN)"
          },
          "low_count": {
            "type": "integer",
            "description": "Number of low incident likelihoods"
          },
          "medium_count": {
            "type": "integer",
            "description": "Number of medium incident likelihoods"
          },
          "high_count": {
            "type": "integer",
            "description": "Number of high incident likelihoods"
          },
          "critical_count": {
            "type": "integer",
            "description": "Number of critical incident likelihoods"
          },
          "median": {
            "type": "integer",
            "description": "Median incident likelihood score"
          }
        },
        "required": [
          "quarter",
          "low_count",
          "medium_count",
          "high_count",
          "critical_count",
          "median"
        ],
        "additionalProperties": false
      },
      "description": "Array of incident likelihood data for the last 4 quarters"
    }
  },
  "required": [
    "entries"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/customer/incident-likelihood-over-time/<end_date>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

