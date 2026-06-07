# IntakeVendorPublishStatus

```json
{
  "type": "object",
  "description": "Publish status for the current intake vendor form.",
  "properties": {
    "status": {
      "type": "string",
      "enum": [
        "active",
        "inactive"
      ],
      "description": "Whether the form is currently published (active) or not (inactive)."
    },
    "publishedUrl": {
      "type": "string",
      "description": "Published URL for the form when published, if applicable."
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "When the publish status or form was last updated."
    }
  }
}
```
