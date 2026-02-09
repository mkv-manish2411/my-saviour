import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import authRoutes from "./routes/auth.routes";
import donorRoutes from "./routes/donor.routes";
import adminRoutes from "./routes/admin.routes";
import orgRoutes from "./routes/org.routes";
import { startEligibilityReminderJob } from "./jobs/eligibilityReminder.job";

startEligibilityReminderJob();

const app = express();

/**
 * CORS (lock this down in production)
 */
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:5173",
    credentials: true,
  })
);

/**
 * Security & performance
 */
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" })); // prevents payload abuse

/**
 * API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/org", orgRoutes);

/**
 * Health check (VERY IMPORTANT in prod)
 */
app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "ok", timestamp: Date.now() });
});

/**
 * Global error handler (last middleware)
 */
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
