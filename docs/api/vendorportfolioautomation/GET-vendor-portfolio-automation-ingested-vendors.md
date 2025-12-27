# retrieve all ingested vendors regardless of if the

- **Method:** `GET`
- **Path:** `/vendor-portfolio-automation/ingested-vendors`
- **Tag:** `VendorPortfolioAutomation`
- **operationId:** `get_vendor-portfolio-automation-ingested-vendors`

## Description
retrieve all ingested vendors regardless of if they correspond to known SecurityScorecard domains

## Query Parameters
- `page` (optional, integer) — page number, defaults to 0 for the first page
- `page_size` (optional, integer) — number of vendors per page (max: 500, default: 50)
- `sort` (optional, string) — sort vendors, supported criteria: (-)vendor_name, (-)source, (-)source_id, (-)domain, (-)suggestion_confidence, (-)created_at (default: vendor_name)
- `search` (optional, string) — filter based on a partial match vendor name, SSC domain or SCC company name
- `sources` (optional, array) — filter by vendor sources - vendors matching ANY of the provided sources will be returned
- `source_ids` (optional, array) — filter based on the source_id of the vendor record
- `vendor_name` (optional, array) — filter based on the source vendor_name of the vendor record. Supports exact match only, if you need partial match use 'search' instead
- `is_dismissed` (optional, boolean) — filter based on if the vendor has been dismissed by a user
- `is_overridden` (optional, boolean) — filter based on if the vendor's scorecard_id has been set by a user

## Responses
### 200
A page in a list of VendorPortfolioAutomationIngestedRecords
```json
{
  "type": "object",
  "properties": {
    "entries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "source": {
            "type": "string",
            "description": "the original source of the vendor record"
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
          },
          "add_to_portfolio": {
            "type": "boolean",
            "description": "Indicates whether vendor was automatically ingested into the default portfolio"
          },
          "suggestion_confidence": {
            "type": "integer",
            "default": -1,
            "description": "suggestion confidence score"
          },
          "domain": {
            "type": "string",
            "x-example": "example.com"
          },
          "scorecard_name": {
            "type": "string",
            "description": "Name of resolved scorecard"
          },
          "scorecard_id": {
            "type": "string",
            "format": "uuid",
            "pattern": "^[\\da-z-]{16,}$",
            "description": "scorecard id to override automatic resolution"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "timestamp this vendor was deleted"
          },
          "deleted_by": {
            "type": "string",
            "description": "timestamp this vendor was deleted"
          },
          "scorecard_overridden_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "timestamp this scorecardId was overridden"
          },
          "scorecard_overridden_by": {
            "type": "string",
            "description": "user's email who overrode the scorecardId for this vendor"
          },
          "updated_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "timestamp when the record was updated"
          },
          "updated_by": {
            "type": "string",
            "description": "user's email who updated the record"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "pattern": "^\\d{4}-\\d{2}-\\d{2}[ T]\\d{2}:\\d{2}:\\d{2}\\.{0,1}\\d*Z$",
            "description": "timestamp when the record was created"
          },
          "created_by": {
            "type": "string",
            "description": "user's email who created the record"
          }
        },
        "additionalProperties": false,
        "required": [
          "source",
          "source_id",
          "vendor_name",
          "vendor_metadata",
          "scorecard_name",
          "deleted_at",
          "deleted_by",
          "scorecard_overridden_at",
          "scorecard_overridden_by",
          "updated_at",
          "updated_by",
          "created_at",
          "created_by"
        ],
        "description": "processed vendor details from ingest"
      }
    },
    "page": {
      "type": "integer"
    },
    "size": {
      "type": "integer"
    }
  },
  "additionalProperties": false,
  "required": [
    "entries",
    "page",
    "size"
  ],
  "description": "A page in a list of VendorPortfolioAutomationIngestedRecords"
}
```
### 403
No response body

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//vendor-portfolio-automation/ingested-vendors' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

