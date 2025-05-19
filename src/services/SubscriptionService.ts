import validator from "validator";
import { generateToken, verifyToken } from "../utils/token.js";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository.js";
import { EmailService } from "./EmailService.js";

export class SubscriptionService {
  constructor(
    private subscriptionRepo: SubscriptionRepository,
    private emailService: EmailService,
  ) {}

  private async getSubscriptionEmail(token: string) {
    let email: string;

    try {
      const payload = verifyToken(token);
      email = payload.email;
    } catch (err: unknown) {
      if (!(err instanceof Error)) throw new Error("Unknown error occured");

      throw new Error("Invalid token");
    }

    const existing = await this.subscriptionRepo.findByEmail(email);
    if (!existing) throw new Error("Subscription not found");

    return email;
  }

  async subscribe(email: string, city: string, frequency: "hourly" | "daily") {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email");
    }
    if (!validator.matches(city, /^[a-zA-Z\s\-]+$/)) {
      throw new Error("Invalid city");
    }

    const existing = await this.subscriptionRepo.findByEmail(email);
    if (existing) {
      throw new Error("Email already subscribed"); // 409
    }

    await this.subscriptionRepo.create({
      email,
      city,
      frequency,
    });

    const token = generateToken({ email, city, frequency });

    await this.emailService.sendConfirmation(email, token);

    return { message: "Confirmation email sent" };
  }

  async confirm(token: string) {
    const email = await this.getSubscriptionEmail(token);

    await this.subscriptionRepo.confirmByEmail(email);
  }
  async unsubscribe(token: string) {
    const email = await this.getSubscriptionEmail(token);

    await this.subscriptionRepo.deleteByEmail(email);
  }
}
