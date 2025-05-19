import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client/edge";
import { weatherRoutes } from "./routes/WeatherRoutes.js";
import { subscriptionRoutes } from "./routes/SubscriptionRoutes.js";
import config from "./config/index.js";
import { WeatherMailerService } from "./services/WeatherMailerService.js";
import { WeatherService } from "./services/WeatherService.js";
import { EmailService } from "./services/EmailService.js";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository.js";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRoutes());
app.use("/api", subscriptionRoutes());

// Start cron jobs for weather updates
const subscriptionRepo = new SubscriptionRepository(prisma);
const weatherService = new WeatherService();
const emailService = new EmailService();
const mailerService = new WeatherMailerService(
  subscriptionRepo,
  emailService,
  weatherService,
);
mailerService.startCronJobs();
console.log("Weather mailer service started");

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
