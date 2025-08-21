# Products

```json
{
  "type": "object",
  "description": "Products used by a vendor",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Product"
      }
    }
  },
  "allOf": [
    {
      "$ref": "#/definitions/CollectionResponse"
    }
  ]
}
```
