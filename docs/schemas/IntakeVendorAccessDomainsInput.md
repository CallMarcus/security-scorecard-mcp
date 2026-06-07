# IntakeVendorAccessDomainsInput

```json
{
  "type": "object",
  "description": "Payload for updating the list of email domains with access to the current intake vendor form.",
  "properties": {
    "emails": {
      "type": "array",
      "description": "Email domains permitted to access the form.",
      "items": {
        "type": "string"
      }
    }
  }
}
```
