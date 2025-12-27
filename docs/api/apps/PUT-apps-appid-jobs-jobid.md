# Update a Job

- **Method:** `PUT`
- **Path:** `/apps/{appId}/jobs/{jobId}`
- **Tag:** `Apps`
- **operationId:** `putAppsByAppidJobsByJobid`

## Path Parameters
- `appId` (**required**) — application id
- `jobId` (**required**) — job id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "description": "job status"
    },
    "log": {
      "type": "string",
      "description": "execution info ",
      "default": ""
    },
    "error": {
      "type": "string",
      "description": "error info ",
      "default": ""
    }
  },
  "required": [
    "status",
    "log",
    "error"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
Update Job status
```json
{
  "type": "object",
  "properties": {
    "id": {
      "description": "unique identifier for the object",
      "type": "string",
      "format": "uuid"
    },
    "created_by": {
      "type": "string",
      "description": "created by"
    },
    "started_at": {
      "type": "string",
      "description": "created date"
    },
    "completed_at": {
      "type": "string",
      "description": "completed job timestamp"
    },
    "status": {
      "type": "string",
      "description": "job status"
    },
    "log": {
      "type": "string",
      "description": "execution info"
    },
    "error": {
      "type": "string",
      "description": "execution info"
    }
  },
  "required": [
    "id",
    "created_by",
    "started_at",
    "completed_at",
    "status",
    "log",
    "error"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X PUT \
  'https://api.securityscorecard.io//apps/<appId>/jobs/<jobId>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

