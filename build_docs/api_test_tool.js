const API_BASE_URL = "https://api.securityscorecard.io";

// Simple argument parser
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { method: 'GET' };
  if (args.length === 0) return opts;
  opts.endpoint = args[0];
  for (let i = 1; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--domain' && i + 1 < args.length) {
      opts.domain = args[++i];
    } else if (flag === '--token' && i + 1 < args.length) {
      opts.token = args[++i];
    } else if (flag === '--method' && i + 1 < args.length) {
      opts.method = args[++i].toUpperCase();
    } else if (flag === '--body' && i + 1 < args.length) {
      opts.body = args[++i];
    }
  }
  return opts;
}

async function main() {
  const opts = parseArgs();
  if (!opts.endpoint) {
    console.error('Usage: node api_test_tool.js <endpoint> [--method GET|POST] [--domain company.com] [--token your-token] [--body "{...}"]');
    process.exit(1);
  }

  const domain = opts.domain || process.env.COMPANY_DOMAIN || 'company.com';
  const token = opts.token || process.env.SECURITY_SCORECARD_API_TOKEN || 'YOUR_TOKEN_HERE';
  const endpoint = opts.endpoint.replace('{domain}', domain);

  const url = `${API_BASE_URL}${endpoint}`;
  const requestOptions = {
    method: opts.method,
    headers: {
      'Authorization': `Token ${token}`,
      'Accept': 'application/json'
    }
  };
  if (opts.method !== 'GET' && opts.body) {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = opts.body;
  }

  console.log(`Request: ${opts.method} ${url}`);
  try {
    const res = await fetch(url, requestOptions);
    console.log(`Status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log('Response preview:', text.slice(0, 500));
  } catch (err) {
    console.error('Request failed:', err.message);
  }
}

main();
