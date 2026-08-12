# Batch-sync inbox-extracted contacts (partner)

- **Method:** `POST`
- **Path:** `/max/v1/partner/contacts/sync`
- **Tag:** `V1`
- **operationId:** `postV1PartnerContactsSync`

## Description
Upserts a batch of inbox-derived contacts. De-dups via the existing (email, vendor_id) create/link path; gap-fills empty name/title only; tags source=inbox. Feature-flag gated.

## Request Body
```json
{
  "type": "object",
  "properties": {
    "contacts": {
      "type": "array",
      "description": "Batch of inbox-extracted contacts to sync",
      "minItems": 1,
      "maxItems": 500,
      "items": {
        "type": "object",
        "properties": {
          "customer_id": {
            "type": "string",
            "format": "uuid"
          },
          "email": {
            "type": "string",
            "format": "email"
          },
          "contact_type": {
            "type": "string"
          },
          "vendor_id": {
            "type": "string",
            "format": "uuid"
          },
          "first_name": {
            "type": "string"
          },
          "last_name": {
            "type": "string"
          },
          "title": {
            "type": "string"
          },
          "discovered_from": {
            "type": "string",
            "enum": [
              "manual",
              "mailbox",
              "ssc_api",
              "zoominfo",
              "zoominfo_search"
            ]
          },
          "zoominfo_person_id": {
            "type": "string"
          },
          "contact_accuracy_score": {
            "type": "integer"
          },
          "employment_status": {
            "type": "string"
          },
          "last_researched_at": {
            "type": "string"
          },
          "enriched_at": {
            "type": "string"
          }
        },
        "required": [
          "customer_id",
          "email"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "contacts"
  ],
  "additionalProperties": false
}
```

## Responses
### 200
All items succeeded — per-item action counts
```json
{
  "type": "object",
  "properties": {
    "created": {
      "type": "integer",
      "description": "Contacts newly created"
    },
    "linked": {
      "type": "integer",
      "description": "Existing contacts linked to a customer"
    },
    "already_exists": {
      "type": "integer",
      "description": "Already present, unchanged"
    },
    "gap_filled": {
      "type": "integer",
      "description": "Existing contacts whose empty fields were backfilled"
    },
    "failed": {
      "type": "integer",
      "description": "Items that errored (logged, skipped)"
    },
    "errors": {
      "type": "array",
      "description": "Per-item failures (empty when all items succeeded). One entry per failed contact, aligned to the request batch by `requestIndex`.",
      "items": {
        "type": "object",
        "properties": {
          "request_index": {
            "type": "integer",
            "description": "Zero-based position of the failed item in the request `contacts[]` array (errors[] is sparse \u2014 failures only \u2014 so this maps a failure back to the item that caused it)"
          },
          "email": {
            "type": "string",
            "description": "Email of the failed contact (echoed from the request item)"
          },
          "reason": {
            "type": "string",
            "enum": [
              "forbidden",
              "bad_request",
              "internal_error"
            ],
            "description": "Failure class: `forbidden` (caller lacks access to the item\u2019s customer), `bad_request` (invalid item, e.g. unrecognized vendorId), or `internal_error` (unexpected server/DB failure)"
          }
        },
        "required": [
          "request_index",
          "email",
          "reason"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "created",
    "linked",
    "already_exists",
    "gap_filled",
    "failed",
    "errors"
  ],
  "additionalProperties": false
}
```
### 207
Partial success — at least one item failed; see `errors[]` for the per-item reason
```json
{
  "type": "object",
  "properties": {
    "created": {
      "type": "integer",
      "description": "Contacts newly created"
    },
    "linked": {
      "type": "integer",
      "description": "Existing contacts linked to a customer"
    },
    "already_exists": {
      "type": "integer",
      "description": "Already present, unchanged"
    },
    "gap_filled": {
      "type": "integer",
      "description": "Existing contacts whose empty fields were backfilled"
    },
    "failed": {
      "type": "integer",
      "description": "Items that errored (logged, skipped)"
    },
    "errors": {
      "type": "array",
      "description": "Per-item failures (empty when all items succeeded). One entry per failed contact, aligned to the request batch by `requestIndex`.",
      "items": {
        "type": "object",
        "properties": {
          "request_index": {
            "type": "integer",
            "description": "Zero-based position of the failed item in the request `contacts[]` array (errors[] is sparse \u2014 failures only \u2014 so this maps a failure back to the item that caused it)"
          },
          "email": {
            "type": "string",
            "description": "Email of the failed contact (echoed from the request item)"
          },
          "reason": {
            "type": "string",
            "enum": [
              "forbidden",
              "bad_request",
              "internal_error"
            ],
            "description": "Failure class: `forbidden` (caller lacks access to the item\u2019s customer), `bad_request` (invalid item, e.g. unrecognized vendorId), or `internal_error` (unexpected server/DB failure)"
          }
        },
        "required": [
          "request_index",
          "email",
          "reason"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "created",
    "linked",
    "already_exists",
    "gap_filled",
    "failed",
    "errors"
  ],
  "additionalProperties": false
}
```
### 401
Unauthorized
### 403
Forbidden
### 404
Feature not enabled
### 500
Total failure — every item failed and at least one was a server-side error (e.g. store unavailable); retry the whole batch
```json
{
  "type": "object",
  "properties": {
    "created": {
      "type": "integer",
      "description": "Contacts newly created"
    },
    "linked": {
      "type": "integer",
      "description": "Existing contacts linked to a customer"
    },
    "already_exists": {
      "type": "integer",
      "description": "Already present, unchanged"
    },
    "gap_filled": {
      "type": "integer",
      "description": "Existing contacts whose empty fields were backfilled"
    },
    "failed": {
      "type": "integer",
      "description": "Items that errored (logged, skipped)"
    },
    "errors": {
      "type": "array",
      "description": "Per-item failures (empty when all items succeeded). One entry per failed contact, aligned to the request batch by `requestIndex`.",
      "items": {
        "type": "object",
        "properties": {
          "request_index": {
            "type": "integer",
            "description": "Zero-based position of the failed item in the request `contacts[]` array (errors[] is sparse \u2014 failures only \u2014 so this maps a failure back to the item that caused it)"
          },
          "email": {
            "type": "string",
            "description": "Email of the failed contact (echoed from the request item)"
          },
          "reason": {
            "type": "string",
            "enum": [
              "forbidden",
              "bad_request",
              "internal_error"
            ],
            "description": "Failure class: `forbidden` (caller lacks access to the item\u2019s customer), `bad_request` (invalid item, e.g. unrecognized vendorId), or `internal_error` (unexpected server/DB failure)"
          }
        },
        "required": [
          "request_index",
          "email",
          "reason"
        ],
        "additionalProperties": false
      }
    }
  },
  "required": [
    "created",
    "linked",
    "already_exists",
    "gap_filled",
    "failed",
    "errors"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X POST \
  'https://api.securityscorecard.io//max/v1/partner/contacts/sync' \
  -H 'Authorization: Token <YOUR_API_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '<JSON body>'
```

