# Get details of a request

- **Method:** `GET`
- **Path:** `/max/v1/management-request/{id}`
- **Tag:** `V1`
- **operationId:** `getV1ManagementRequestById`

## Path Parameters
- `id` (**required**) — Unique ID of the request

## Responses
### 200
Details of the requested item
```json
{
  "type": "object",
  "properties": {
    "request_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique ID of the request"
    },
    "partner_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique ID of the partner"
    },
    "partner_company_name": {
      "type": "string",
      "description": "Company name of the partner"
    },
    "partner_company_domain": {
      "type": "string",
      "description": "Company domain of the partner"
    },
    "partner_logo_url": {
      "type": "string",
      "description": "Logo URL of the partner"
    },
    "customer_id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique ID of the customer"
    },
    "customer_email": {
      "type": "string",
      "description": "Email of the customer contact"
    },
    "customer_first_name": {
      "type": "string",
      "description": "First name of the customer contact"
    },
    "customer_last_name": {
      "type": "string",
      "description": "Last name of the customer contact"
    },
    "customer_logo_url": {
      "type": "string",
      "description": "Logo URL of the customer"
    },
    "customer_company_name": {
      "type": "string",
      "description": "Company name of the customer"
    },
    "customer_company_domain": {
      "type": "string",
      "description": "Company domain of the customer"
    },
    "status": {
      "type": "string",
      "description": "Current status of the request"
    },
    "requester_email": {
      "type": "string",
      "format": "email",
      "description": "Email of the person who created the request"
    },
    "requester_first_name": {
      "type": "string",
      "description": "Email of the person who created the request"
    },
    "requester_last_name": {
      "type": "string",
      "description": "Email of the person who created the request"
    }
  },
  "required": [
    "request_id",
    "partner_id",
    "partner_company_name",
    "partner_company_domain",
    "customer_id",
    "customer_company_name",
    "customer_company_domain",
    "status",
    "requester_email",
    "requester_first_name",
    "requester_last_name"
  ],
  "additionalProperties": false
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//max/v1/management-request/<id>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

