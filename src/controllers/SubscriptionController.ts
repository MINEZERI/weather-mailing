import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { SubscriptionService } from "../services/SubscriptionService.js";

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  async subscribe(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, city, frequency } = req.body;

    try {
      await this.subscriptionService.subscribe(email, city, frequency);
      return res.status(200).json({ message: "Confirmation email sent" });
    } catch (err: unknown) {
      if (!(err instanceof Error)) throw new Error("Unknown error occured");

      if (err.message === "Email already subscribed") {
        return res.status(409).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }

  async confirm(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;

    try {
      await this.subscriptionService.confirm(token);
      return res.status(200).json({ message: "Subscription confirmed" });
    } catch (err: unknown) {
      if (!(err instanceof Error)) throw new Error("Unknown error occured");

      if (err.message === "Token not found") {
        return res.status(404).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }

  async unsubscribe(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token } = req.params;

    try {
      await this.subscriptionService.unsubscribe(token);
      return res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (err: unknown) {
      if (!(err instanceof Error)) throw new Error("Unknown error occured");

      if (err.message === "Token not found") {
        return res.status(404).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
  }
}
