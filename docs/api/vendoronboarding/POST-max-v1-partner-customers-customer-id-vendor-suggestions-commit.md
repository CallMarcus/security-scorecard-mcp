# Applies a reviewed vendor-suggestions selection: a

- **Method:** `POST`
- **Path:** `/max/v1/partner/customers/{customer_id}/vendor-suggestions/commit`
- **Tag:** `VendorOnboarding`
- **operationId:** `post_max-v1-partner-customers-customer-id-vendor-suggestions-commit`

## Description
Applies a reviewed vendor-suggestions selection: adds vendors through the same path as add-vendor-domains and offboards through the same path as vendor removal, so the roster ends up in the state the manual flows produce. Rejects the whole request before any write on a bad tier or impact (400) or a tier with too few slots (409).

## Path Parameters
- `customer_id` (**required**) — customer (portfolio owner) id

## Request Body
```json
{
  "type": "object",
  "properties": {
    "vendors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string",
            "description": "Scorecard id of the vendor"
          },
          "domain": {
            "type": "string",
            "description": "Vendor domain"
          },
          "business_impact": {
            "type": "string",
            "description": "critical, high, medium or low. Omit it, or send unknown, to leave the impact unset"
          },
          "tier": {
            "type": "string",
            "description": "platinum, gold or silver. Required when adding"
          },
          "custom_tags": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "Extra tags to label the vendor"
          },
          "operation": {
            "type": "string",
            "description": "add (default) or offboard"
          }
        },
        "additionalProperties": false,
        "required": [
          "vendor_scorecard_id",
          "domain"
        ]
      },
      "description": "Vendors to add or offboard; each may appear once"
    }
  },
  "additionalProperties": false,
  "required": [
    "vendors"
  ],
  "description": "Reviewed vendor-suggestion rows to apply to a customer roster"
}
```

## Responses
### 200
Per-vendor outcome of a suggestion commit
```json
{
  "type": "object",
  "properties": {
    "customer_id": {
      "type": "string"
    },
    "import_id": {
      "type": "string"
    },
    "results": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "vendor_scorecard_id": {
            "type": "string"
          },
          "domain": {
            "type": "string"
          },
          "status": {
            "type": "string",
            "description": "added, alreadyInPortfolio, offboarded or ignored"
          },
          "errors": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "additionalProperties": false,
        "required": [
          "vendor_scorecard_id",
          "domain",
          "status",
          "errors"
        ]
      }
    },
    "counts": {
      "type": "object",
      "properties": {
        "added": {
          "type": "number"
        },
        "already_in_portfolio": {
          "type": "number"
        },
        "offboarded": {
          "type": "number"
        },
        "ignored": {
          "type": "number"
        }
      },
      "additionalProperties": false,
      "required": [
        "added",
        "already_in_portfolio",
        "offboarded",
        "ignored"
      ]
    }
  },
  "additionalProperties": false,
  "required": [
    "customer_id",
    "results",
    "counts"
  ],
  "description": "Per-vendor outcome of a suggestion commit"
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/customers/<customer_id>/vendor-suggestions/commit' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

