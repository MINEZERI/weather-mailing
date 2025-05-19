import { Router, Request, Response } from "express";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository.js";
import { SubscriptionService } from "../services/SubscriptionService.js";
import { SubscriptionController } from "../controllers/SubscriptionController.js";
import { EmailService } from "../services/EmailService.js";
import { PrismaClient } from "@prisma/client/edge"; // Спеціальний ESM-клієнт
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

  router.post(
    "/subscribe",
    subscribeValidators,
    (req: Request, res: Response) => {
      controller.subscribe(req, res);
    },
  );
  router.get(
    "/confirm/:token",
    tokenParamValidators,
    (req: Request, res: Response) => {
      controller.confirm(req, res);
    },
  );
  router.get(
    "/unsubscribe/:token",
    tokenParamValidators,
    (req: Request, res: Response) => {
      controller.unsubscribe(req, res);
    },
  );

  return router;
}
