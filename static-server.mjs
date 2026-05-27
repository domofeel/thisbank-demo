import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";

const root = "C:\\Projects\\MyFirstApp";
const dist = path.join(root, "dist");
const presetsPath = path.join(root, "data", "presets.json");
const presetsBackupDir = path.join(root, "data", "preset-backups");
const port = 5173;

const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const send = (res, status, body, type = "text/plain") => {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const backupPresets = async () => {
  try {
    const currentPresets = await fs.readFile(presetsPath, "utf8");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");

    await fs.mkdir(presetsBackupDir, { recursive: true });
    await fs.writeFile(path.join(presetsBackupDir, `presets-${stamp}.json`), currentPresets, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);

    if (url.pathname === "/api/presets") {
      if (req.method === "GET") {
        send(res, 200, await fs.readFile(presetsPath, "utf8"), "application/json");
        return;
      }

      if (req.method === "POST") {
        const body = await readBody(req);
        JSON.parse(body || "[]");
        await backupPresets();
        await fs.writeFile(presetsPath, `${body}\n`, "utf8");
        send(res, 200, "{\"ok\":true}", "application/json");
        return;
      }
    }

    const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.normalize(path.join(dist, requestPath));
    if (!filePath.startsWith(dist)) {
      send(res, 403, "Forbidden");
      return;
    }

    const ext = path.extname(filePath);
    send(res, 200, await fs.readFile(filePath), types[ext] ?? "application/octet-stream");
  } catch {
    try {
      send(res, 200, await fs.readFile(path.join(dist, "index.html")), "text/html");
    } catch {
      send(res, 500, "Server error");
    }
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server: http://127.0.0.1:${port}/`);
});
