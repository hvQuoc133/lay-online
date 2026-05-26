import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from 'cors';
import dotenv from 'dotenv';
import http from "http";
import { Server } from "socket.io";
import apiRoutes from "./backend/routes/api";
import { setupSockets } from "./backend/sockets/socketManager";
import authRoutes from './backend/routes/auth';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Setup websockets
  setupSockets(io);


  // Config Middleware
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`>>> Yêu cầu gửi tới: ${req.method} ${req.url}`);
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
  });

  app.get('/api/health', (req, res) => res.json({ status: "ok" }));

  // API endpoints
  app.use('/api', authRoutes);
  app.use("/api", apiRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use((req, res, next) => {
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((e) => {
  console.error(e);
});
