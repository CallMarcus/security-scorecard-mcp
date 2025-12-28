# Vendors

```json
{
  "allOf": [
    {
      "$ref": "#/definitions/CollectionResponse"
    }
  ],
  "description": "Vendors used by a company",
  "properties": {
    "entries": {
      "items": {
        "$ref": "#/definitions/Vendor"
      },
      "type": "array"
    }
  },
  "type": "object"
}
```
