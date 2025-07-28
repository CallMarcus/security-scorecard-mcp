# Create .gitignore using Out-File
"# Dependencies
node_modules/
npm-debug.log*
*.log

# Build outputs  
build/
dist/

# Environment and secrets
.env
.env.local
**/*token*
**/*secret*
**/*key*
test_connection.js
debug_api.js

# IDE and OS files
.vscode/
.DS_Store
Thumbs.db" | Out-File -FilePath ".gitignore" -Encoding UTF8