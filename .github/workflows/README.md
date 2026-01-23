# GitHub Actions Workflows

## Update Sitemap Workflow

This workflow automatically generates and updates the sitemap when triggered via webhook.

### Setup

1. **Create a GitHub Secret for Webhook Authorization:**
   - Go to your repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `WEBHOOK_TOKEN`
   - Value: Generate a secure random token (e.g., using `openssl rand -hex 32`)

2. **Configure Webhook:**
   - Go to your repository Settings → Webhooks
   - Click "Add webhook"
   - Payload URL: `https://api.github.com/repos/{owner}/{repo}/dispatches`
   - Content type: `application/json`
   - Secret: (optional, for additional security)
   - Events: Select "Repository dispatch"
   - Active: ✓

### Triggering the Workflow

#### Option 1: Using GitHub API (Repository Dispatch)

Send a POST request to trigger the workflow:

```bash
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/{owner}/{repo}/dispatches \
  -d '{
    "event_type": "update-sitemap",
    "client_payload": {
      "token": "YOUR_WEBHOOK_TOKEN"
    }
  }'
```

Replace:
- `{owner}`: Your GitHub username or organization
- `{repo}`: Your repository name
- `YOUR_GITHUB_TOKEN`: A GitHub Personal Access Token with `repo` scope
- `YOUR_WEBHOOK_TOKEN`: The token you set in `WEBHOOK_TOKEN` secret

#### Option 2: Manual Trigger (Workflow Dispatch)

1. Go to your repository on GitHub
2. Click on "Actions" tab
3. Select "Update Sitemap" workflow
4. Click "Run workflow"
5. Optionally provide a token for authorization
6. Click "Run workflow"

### Environment Variables

If your sitemap script requires environment variables (like API URLs or keys), add them as GitHub Secrets and reference them in the workflow file:

```yaml
env:
  API_URL: ${{ secrets.API_URL }}
  API_KEY: ${{ secrets.API_KEY }}
```

### Security Notes

- The workflow validates the webhook token before running
- Only commits sitemap files (`public/sitemap*.xml`)
- Uses `[skip ci]` in commit message to prevent infinite loops
- Uses GitHub Actions bot for commits

### Troubleshooting

- **Workflow not triggering:** Check that the webhook token matches the secret
- **No changes committed:** The workflow only commits if sitemap files actually changed
- **Permission errors:** Ensure `GITHUB_TOKEN` has write permissions (usually enabled by default)
