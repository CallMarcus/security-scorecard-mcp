# Ingest vendor data to be included in the domain's 

- **Method:** `POST`
- **Path:** `/vendor-portfolio-automation/ingest`
- **Tag:** `VendorPortfolioAutomation`
- **operationId:** `post_vendor-portfolio-automation-ingest`

## Description
Ingest vendor data to be included in the domain's Suggested Vendors portfolio

## Request Body
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "add_to_portfolio": {
            "type": "boolean",
            "description": "if this vendor should be automatically added to a default portfolio where its scorecard will be monitored and it will consume a slot."
          },
          "source_id": {
            "type": "string",
            "description": "the original source unique id of the vendor record"
          },
          "vendor_name": {
            "type": "string",
            "description": "name of the vendor"
          },
          "vendor_metadata": {
            "type": "object",
            "properties": {},
            "additionalProperties": true,
            "description": "any other information about the vendor that the source can provide"
          },
          "vendor_domain": {
            "type": "string",
            "description": "domain to resolve vendor to.  If domain is present, matching on vendorName will not be performed"
          }
        },
        "additionalProperties": false,
        "required": [
          "source_id",
          "vendor_name",
          "vendor_metadata"
        ]
      },
      "description": "vendor records to persist"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries"
  ],
  "description": "ingest vendors from an external source to be included in Vendor Portfolio Automation"
}
```

## Responses
### 204
No response body
### 403
No response body

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//vendor-portfolio-automation/ingest' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

