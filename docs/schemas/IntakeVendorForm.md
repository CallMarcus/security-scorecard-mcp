# IntakeVendorForm

```json
{
  "type": "object",
  "description": "Current organization intake vendor form including its questions, options, mappings, and access emails.",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier of the form."
    },
    "name": {
      "type": "string",
      "description": "Display name of the form."
    },
    "questions": {
      "type": "array",
      "description": "Ordered list of questions configured on the form.",
      "items": {
        "$ref": "#/definitions/IntakeVendorQuestion"
      }
    },
    "access_emails": {
      "type": "array",
      "description": "Email addresses with access to this form's submissions.",
      "items": {
        "type": "string",
        "format": "email"
      }
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "When the form was last updated."
    }
  }
}
```
