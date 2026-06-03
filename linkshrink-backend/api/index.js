require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("../src/config/prisma");
const authRoutes = require("../src/routes/auth.routes");
const linkRoutes = require("../src/routes/link.routes");
const { redirectToOriginalUrl } = require("../src/controllers/redirect.controller");
const { notFoundHandler } = require("../src/middlewares/notFound");
const { errorHandler } = require("../src/middlewares/error");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

app.get("/:slug", redirectToOriginalUrl);

app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`LinkShrink backend running on http://localhost:${port}`);
  });
}

module.exports = app;
