# IntakeVendorQuestionOption

```json
{
  "type": "object",
  "description": "A selectable option for a choice-type question.",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique identifier of the option."
    },
    "label": {
      "type": "string",
      "description": "Option text shown to respondents."
    },
    "value": {
      "type": "string",
      "description": "Internal value associated with this option."
    }
  }
}
```
