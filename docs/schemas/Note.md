# Note

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "note": {
      "type": "string",
      "example": "Example note description"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "updated_at": {
      "type": "string",
      "format": "date-time"
    },
    "created_by": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "first_name": {
          "type": "string",
          "example": "John"
        },
        "last_name": {
          "type": "string",
          "example": "Doe"
        },
        "username": {
          "type": "string",
          "example": "john_doe"
        }
      }
    },
    "updated_by": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string",
          "format": "uuid"
        },
        "first_name": {
          "type": "string",
          "example": "John"
        },
        "last_name": {
          "type": "string",
          "example": "Doe"
        },
        "username": {
          "type": "string",
          "example": "john_doe"
        }
      }
    }
  }
}
```
