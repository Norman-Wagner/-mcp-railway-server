# MCP Railway Server

Remote MCP Server (Streamable HTTP Transport) – Railway-Deployment-ready.

## Endpoints

| Pfad | Methode | Beschreibung |
|------|---------|-------------|
| `/` | GET | Health-Info, zeigt ob Auth aktiv ist |
| `/health` | GET | Einfacher Health-Check |
| `/mcp` | POST | MCP Streamable HTTP Endpoint |

## Tools

- `ping` – Verbindungstest
- `server_info` – Uptime und Timestamp
- `echo` – Gibt eine Nachricht zurück

## Deployment auf Railway

1. Repo in Railway importieren
2. Optionale Env-Variable: `MCP_API_KEY=<dein-token>` (aktiviert Bearer-Auth)
3. Railway setzt `PORT` automatisch

## Claude Code Konfiguration

```json
{
  "mcpServers": {
    "aaron-mcp": {
      "type": "http",
      "url": "https://DEINE-RAILWAY-URL.up.railway.app/mcp",
      "headers": {
        "Authorization": "Bearer DEIN_API_KEY"
      }
    }
  }
}
```

> `headers` nur nötig wenn `MCP_API_KEY` gesetzt ist.
