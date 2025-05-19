import cron from "node-cron";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository.js";
import { EmailService } from "./EmailService.js";
import { WeatherService } from "./WeatherService.js";
import { generateToken } from "../utils/token.js";

export class WeatherMailerService {
  constructor(
    private subscriptionRepo: SubscriptionRepository,
    private emailService: EmailService,
    private weatherService: WeatherService,
  ) {}

  private async sendForecastToSubscribers(frequency: "hourly" | "daily") {
    const subscriptions =
      await this.subscriptionRepo.getConfirmedSubscriptions(frequency);
    if (!subscriptions) return;

    console.log(subscriptions);

    for (const sub of subscriptions) {
      try {
        const { email, city } = sub;
        const token = generateToken({ email });
        const weather = await this.weatherService.getForecast(sub.city);
        if (weather)
          await this.emailService.sendWeatherUpdate(
            email,
            city,
            weather,
            token,
          );
        console.log(`Sent ${frequency} update to ${email}`);
      } catch (err) {
        throw new Error(`Failed to send update to ${sub.email}: ${err}`);
      }
    }
  }

  startCronJobs() {
    // Hourly at 00 minutes
    cron.schedule("0 * * * * *", () => {
      console.log("Starting hourly weather updates");
      this.sendForecastToSubscribers("hourly");
    });

    // Daily at 8:00 PM
    cron.schedule("0 20 * * *", () => {
      console.log("Starting daily weather updates");
      this.sendForecastToSubscribers("daily");
    });

    console.log("Weather mailer cron jobs initialized");
  }
}
