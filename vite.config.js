import fs from "node:fs/promises";
import path from "node:path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const presetsFilePath = path.resolve(process.cwd(), "data", "presets.json");
const presetsBackupDir = path.resolve(process.cwd(), "data", "preset-backups");

const sendJson = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const backupPresetsFile = async () => {
  try {
    const currentPresets = await fs.readFile(presetsFilePath, "utf8");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");

    await fs.mkdir(presetsBackupDir, { recursive: true });
    await fs.writeFile(path.join(presetsBackupDir, `presets-${stamp}.json`), currentPresets, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

const handlePresetRequest = async (req, res, logger) => {
  try {
    if (req.method === "GET") {
      try {
        const presets = await fs.readFile(presetsFilePath, "utf8");
        sendJson(res, 200, JSON.parse(presets));
      } catch (error) {
        if (error.code === "ENOENT") {
          sendJson(res, 200, []);
          return;
        }

        throw error;
      }

      return;
    }

    if (req.method === "POST") {
      const body = await readRequestBody(req);
      const presets = JSON.parse(body || "[]");

      if (!Array.isArray(presets)) {
        sendJson(res, 400, { error: "Presets payload must be an array." });
        return;
      }

      await fs.mkdir(path.dirname(presetsFilePath), { recursive: true });
      await backupPresetsFile();
      await fs.writeFile(presetsFilePath, `${JSON.stringify(presets, null, 2)}\n`, "utf8");
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    logger.error(error);
    sendJson(res, 500, { error: "Unable to persist presets." });
  }
};

function presetPersistencePlugin() {
  return {
    name: "preset-persistence",
    configureServer(server) {
      server.middlewares.use("/api/presets", async (req, res) => {
        await handlePresetRequest(req, res, server.config.logger);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/presets", async (req, res) => {
        await handlePresetRequest(req, res, server.config.logger);
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
  plugins: [react(), tailwindcss(), presetPersistencePlugin()],
});
