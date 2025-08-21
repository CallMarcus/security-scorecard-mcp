# Send new feedback on findings from a specific issu

- **Method:** `POST`
- **Path:** `/companies/{domain}/issues/{type}/feedback/`
- **Category:** `company-issues`
- **Operation ID:** `post_companies-domain-issues-type-feedback`

## Description

Send new feedback on findings from a specific issue type

## Path Parameters

- `domain` (**Required**) - company domain
- `type` (**Required**) - issue type

## Request Body

```json
{
  "type": "object",
  "properties": {
    "issue_ids": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "issues ids to be refuted"
    },
    "feedback_type": {
      "type": "string",
      "description": "type of refutation, it could be one of the following:\n- 'technical_remediation': I have fixed this\n- 'compensating_control': I have a compensating control\n- 'misattribution': This is not my IP or domain\n- 'false_positive': I cannot reproduce this issue and I think it's incorrect\n\nNote: additional feedback types might be introduced in the future."
    },
    "comment": {
      "type": "string",
      "description": "an additional comment provided by the creator of this feedback"
    }
  },
  "additionalProperties": false,
  "required": [
    "issue_ids",
    "feedback_type"
  ]
}
```

## Responses

### 201
No response body

## Example Request

```bash
curl -X POST \
  'https://platform.securityscorecard.io/companies/<domain>/issues/<type>/feedback/' \
  -H 'Authorization: Bearer <your-api-token>' \
  -H 'Content-Type: application/json' \
  -d '<JSON-body>'
```
