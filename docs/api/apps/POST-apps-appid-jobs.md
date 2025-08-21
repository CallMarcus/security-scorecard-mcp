# creates an app job

- **Method:** `POST`
- **Path:** `/apps/{appId}/jobs`
- **Tag:** `Apps`
- **operationId:** `postAppsByAppidJobs`

## Path Parameters
- `appId` (**required**) — application id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "max_concurrency": {
      "description": "how many jobs can be running same time",
      "type": "number",
      "example": 1,
      "default": 1,
      "minimum": 1,
      "maximum": 5
    },
    "hours_since_last_completion": {
      "description": "how many hours since last job completion must ocurr to get a new job",
      "type": "number",
      "example": 1,
      "default": 23,
      "minimum": 1,
      "maximum": 23
    }
  },
  "required": [
    "max_concurrency",
    "hours_since_last_completion"
  ],
  "additionalProperties": false
}
```

## Responses
### 201
job created
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
      "description": "user who create the job"
    },
    "started_at": {
      "type": "string",
      "description": "job start date"
    },
    "status": {
      "type": "string",
      "description": "job status"
    }
  },
  "required": [
    "id",
    "created_by",
    "started_at",
    "status"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//apps/<appId>/jobs' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

