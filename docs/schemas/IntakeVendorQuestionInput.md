# IntakeVendorQuestionInput

```json
{
  "type": "object",
  "description": "Payload describing a question to create or update on the form.",
  "required": [
    "type",
    "label"
  ],
  "properties": {
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
    "options": {
      "type": "array",
      "description": "Selectable options for choice-type questions.",
      "items": {
        "type": "object",
        "properties": {
          "label": {
            "type": "string"
          },
          "value": {
            "type": "string"
          }
        }
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
