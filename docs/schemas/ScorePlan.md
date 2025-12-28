# ScorePlan

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entries": {
      "type": "array",
      "description": "a list of issues to remediate",
      "items": {
        "$ref": "#/definitions/ScorePlanItem"
      }
    },
    "size": {
      "type": "integer",
      "description": "the ammount of issue types that require remediation",
      "x-example": 8
    },
    "projected_total_score": {
      "type": "number",
      "description": "the projected company score if all plan issues are resolved,",
      "x-example": 90
    }
  }
}
```
