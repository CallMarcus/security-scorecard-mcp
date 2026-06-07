# IntakeVendorQuestion

```json
{
  "type": "object",
  "description": "A question configured on the intake vendor form.",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier of the question."
    },
    "type": {
      "type": "string",
      "description": "Question type (e.g. text, single_choice, multi_choice)."
    },
    "label": {
      "type": "string",
      "description": "Question text shown to respondents."
    },
    "required": {
      "type": "boolean",
      "description": "Whether an answer is required."
    },
    "display_order": {
      "type": "integer",
      "description": "Position of the question within the form (server-assigned)."
    },
    "options": {
      "type": "array",
      "description": "Selectable options for choice-type questions.",
      "items": {
        "$ref": "#/definitions/IntakeVendorQuestionOption"
      }
    },
    "mappings": {
      "type": "array",
      "description": "Mappings from this question to internal vendor fields.",
      "items": {
        "type": "object"
      }
    }
  }
}
```
