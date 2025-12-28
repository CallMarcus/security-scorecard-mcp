# CollectionResponse

```json
{
  "properties": {
    "page": {
      "description": "The current page of results",
      "minimum": 1,
      "type": "integer"
    },
    "size": {
      "description": "The number of records to be returned per page",
      "example": 100,
      "type": "integer"
    },
    "total": {
      "description": "The total number of records matching the given query",
      "example": 999,
      "type": "integer"
    }
  }
}
```
