# IntakeVendorSubmission

```json
{
  "type": "object",
  "description": "A single intake vendor form submission for the current organization.",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier of the submission."
    },
    "form_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the form this submission was made against."
    },
    "review_state": {
      "type": "string",
      "description": "Current review state of the submission (e.g. pending, approved, rejected)."
    },
    "answers": {
      "type": "array",
      "description": "Answers provided for the form's questions.",
      "items": {
        "type": "object"
      }
    },
    "submittedAt": {
      "type": "string",
      "format": "date-time",
      "description": "When the submission was created."
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "When the submission was last updated."
    }
  }
}
```
