import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server läuft");
});

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log("Server läuft auf Port", port);
});
