import { PrismaClient, Subscription } from "../generated/prisma/client.js";

export class SubscriptionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<Subscription | null> {
    return this.prisma.subscription.findUnique({ where: { email } });
  }

  async create(data: {
    email: string;
    city: string;
    frequency: "hourly" | "daily";
  }): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async confirmByEmail(email: string): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { email },
      data: { confirmed: true },
    });
  }

  async deleteByEmail(email: string): Promise<Subscription> {
    return this.prisma.subscription.delete({ where: { email } });
  }

  async getConfirmedSubscriptions(frequency: "hourly" | "daily") {
    return this.prisma.subscription.findMany({
      where: {
        confirmed: true,
        frequency,
      },
    });
  }
}
