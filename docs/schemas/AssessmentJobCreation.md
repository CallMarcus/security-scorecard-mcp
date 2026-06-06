# AssessmentJobCreation

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "domain": {
      "type": "string",
      "description": "Domain name for the Assessments export",
      "x-example": "example.com"
    },
    "bucketName": {
      "type": "string",
      "description": "Name of the bucket"
    },
    "key": {
      "type": "string",
      "description": "Key for the assessments"
    },
    "filters": {
      "type": "array",
      "description": "Selected filters for export Assessments",
      "items": {
        "type": "object",
        "properties": {
          "operator": {
            "type": "string"
          },
          "field": {
            "type": "string"
          },
          "condition": {
            "type": "string"
          },
          "value": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "required": [
    "domain",
    "bucketName",
    "key"
  ]
}
```
