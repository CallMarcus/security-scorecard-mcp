# Send a new feedback validation request on findings

- **Method:** `POST`
- **Path:** `/companies/{domain}/issues/{type}/feedback-validation-request`
- **Tag:** `feedback`
- **operationId:** `post_companies-domain-issues-type-feedback-validation-request`

## Description
Send a new feedback validation request on findings from a specific issue type and initializes Auto Remediation (skipping the creation of the zendesk support ticket).

## Path Parameters
- `domain` (**required**) — company domain
- `type` (**required**) — issue type

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
    "compensating_control": {
      "type": "string",
      "description": "the details of the compensating control stated by the user"
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

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//companies/<domain>/issues/<type>/feedback-validation-request' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

