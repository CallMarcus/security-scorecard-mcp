# returns SAML Service Provider metadata

- **Method:** `GET`
- **Path:** `/v1/saml/metadata/service-provider`
- **Tag:** `Saml`
- **operationId:** `get_v1-saml-metadata-service-provider`

## Description
returns SAML Service Provider metadata

## Responses
### 200
SAML Service Provider metadata

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//v1/saml/metadata/service-provider' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

