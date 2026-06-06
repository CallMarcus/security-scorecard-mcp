# CompanyReportCreation

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "scorecard_identifier": {
      "type": "string",
      "description": "primary identifier of a company or scorecard",
      "x-example": "example.com"
    },
    "branding": {
      "type": "string",
      "enum": [
        "securityscorecard",
        "company_and_securityscorecard",
        "company"
      ],
      "x-example": "company",
      "description": "note: white-labeling has to be enabled for your account\n  * `securityscorecard` (default) = reports are only displaying SecurityScorecard's logo\n  * `company_and_securityscorecard` = your company's logo will be used in conjunction with Security Scorecard's.\n  * `company` = reports are only displaying your company's logo"
    }
  },
  "required": [
    "scorecard_identifier"
  ]
}
```
