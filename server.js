import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.MCP_API_KEY; // optional: Bearer-Token-Schutz

function authMiddleware(req, res, next) {
  if (!API_KEY) return next();
  const auth = req.headers["authorization"] ?? "";
  if (auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function buildServer() {
  const server = new McpServer({
    name: "aaron-mcp-server",
    version: "1.0.0",
  });

  server.tool(
    "ping",
    "Verbindungstest – gibt pong zurück",
    {},
    async () => ({ content: [{ type: "text", text: "pong" }] })
  );

  server.tool(
    "server_info",
    "Gibt Serverinformationen zurück",
    {},
    async () => ({
      content: [{
        type: "text",
        text: JSON.stringify({
          name: "aaron-mcp-server",
          version: "1.0.0",
          uptime_seconds: Math.round(process.uptime()),
          timestamp: new Date().toISOString(),
        }, null, 2),
      }],
    })
  );

  server.tool(
    "echo",
    "Gibt die übergebene Nachricht zurück",
    { message: z.string().describe("Die zurückzugebende Nachricht") },
    async ({ message }) => ({ content: [{ type: "text", text: message }] })
  );

  return server;
}

// MCP Streamable HTTP Endpoint
app.post("/mcp", authMiddleware, async (req, res) => {
  try {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on("close", () => { transport.close(); server.close(); });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("MCP Fehler:", err);
    if (!res.headersSent) res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Health-Check
app.get("/", (_req, res) =>
  res.json({ status: "ok", mcp_endpoint: "/mcp", auth_required: !!API_KEY })
);
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`MCP Server läuft auf Port ${PORT}`));
