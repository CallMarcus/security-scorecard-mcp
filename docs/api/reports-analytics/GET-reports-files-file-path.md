# Download a generated report

- **Method:** `GET`
- **Path:** `/reports/files/{file_path}`
- **Category:** `reports-analytics`
- **Operation ID:** `get_reports-files-file-path`

## Description

Note: this endpoint should not be used directly. The URL, to be used, is provided in the GET /reports/recent response.

## Path Parameters

- `file_path` (**Required**) - a path to the file

## Query Parameters

- `lng` (string, Optional) - language in which you want to download the generated report (beware available languages might depend on the report type, this can be confirmed viewing an example generated report in our platform)

## Responses

### 200
Return the generated report in the requested language

## Example Request

```bash
curl -X GET \
  'https://platform.securityscorecard.io/reports/files/<file_path>' \
  -H 'Authorization: Bearer <your-api-token>'
```
