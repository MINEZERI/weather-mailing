import { Router } from "express";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository.js";
import { SubscriptionService } from "../services/SubscriptionService.js";
import { SubscriptionController } from "../controllers/SubscriptionController.js";
import { EmailService } from "../services/EmailService.js";
import { PrismaClient } from "../generated/prisma/client.js";
import {
  subscribeValidators,
  tokenParamValidators,
} from "../validators/SubscriptionValidators.js";

export function subscriptionRoutes() {
  const router = Router();
  const controller = new SubscriptionController(
    new SubscriptionService(
      new SubscriptionRepository(new PrismaClient()),
      new EmailService(),
    ),
  );

  router.post("/subscribe", subscribeValidators, (req, res) => {
    controller.subscribe(req, res);
  });
  router.get("/confirm/:token", tokenParamValidators, (req, res) => {
    controller.confirm(req, res);
  });
  router.get("/unsubscribe/:token", tokenParamValidators, (req, res) => {
    controller.unsubscribe(req, res);
  });

  return router;
}
