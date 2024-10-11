import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

import setupSocket from "./socket.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

setupSocket(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is runnning at http://localhost:${port}`);
});
