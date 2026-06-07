# Get the SCIM service provider Configuration

- **Method:** `GET`
- **Path:** `/scim/v2/ServiceProviderConfig`
- **Tag:** `Scim`
- **operationId:** `get_scim-v2-serviceproviderconfig`

## Description
Get the SCIM service provider Configuration

## Responses
### 200
Service Provider Configuration
```json
{
  "type": "object",
  "properties": {
    "schemas": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "documentationUri": {
      "type": "string"
    },
    "patch": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "bulk": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        },
        "maxOperations": {
          "type": "integer"
        },
        "maxPayloadSize": {
          "type": "integer"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "filter": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        },
        "maxResults": {
          "type": "integer"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "changePassword": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "sort": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "etag": {
      "type": "object",
      "properties": {
        "supported": {
          "type": "boolean"
        }
      },
      "additionalProperties": false,
      "required": [
        "supported"
      ]
    },
    "authenticationSchemes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "specUri": {
            "type": "string"
          },
          "documentationUri": {
            "type": "string"
          },
          "type": {
            "type": "string"
          },
          "primary": {
            "type": "boolean"
          }
        },
        "additionalProperties": false,
        "required": [
          "name",
          "type"
        ]
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "resourceType": {
          "type": "string"
        },
        "location": {
          "type": "string"
        }
      },
      "additionalProperties": true,
      "required": [
        "resourceType",
        "location"
      ]
    }
  },
  "additionalProperties": true,
  "required": [
    "schemas",
    "patch",
    "bulk",
    "filter",
    "changePassword",
    "sort",
    "etag",
    "authenticationSchemes"
  ],
  "description": "SCIM Service Provider Configuration"
}
```

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//scim/v2/ServiceProviderConfig' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

