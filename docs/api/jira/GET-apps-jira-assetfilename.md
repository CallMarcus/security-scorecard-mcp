# Static asset (PNG or ICO only)

- **Method:** `GET`
- **Path:** `/apps/jira/{assetFilename}`
- **Tag:** `jira`
- **operationId:** `get_apps-jira-assetfilename`

## Description
Serves app assets under /apps/jira/. Only .png and .ico files are allowed.

## Path Parameters
- `assetFilename` (**required**) — Asset filename including extension (e.g. logo.png, favicon.ico). Only .png and .ico are allowed.

## Responses
### 200
Binary asset
### 404
Asset not found or extension not allowed

## Example cURL Request
```bash
curl -X GET \
  'https://api.securityscorecard.io//apps/jira/<assetFilename>' \
  -H 'Authorization: Token <YOUR_API_TOKEN>'
```

