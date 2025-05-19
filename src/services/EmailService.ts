import nodemailer from "nodemailer";
import config from "../config/index.js";

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  async sendConfirmation(email: string, token: string): Promise<void> {
    const confirmUrl = `${process.env.API_URL}/confirm/${token}`;
    const unsubUrl = `${process.env.API_URL}/unsubscribe/${token}`;

    const info = await this.transporter.sendMail({
      from: `"Weather App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Confirm your subscription",
      html: `
        <p>Thank you for subscribing to weather updates!</p>
        <p>Click the link below to confirm your subscription:</p>
        <a href="${confirmUrl}">Confirm subscription</a>
        <p>If you ever want to unsubscribe, click this link:</p>
        <a href="${unsubUrl}">Unsubscribe</a>
      `,
    });

    console.log("Email sent:", info.messageId);
  }

  async sendWeatherUpdate(
    email: string,
    city: string,
    weather: { temperature: number; humidity: number; description: string },
    token: string,
  ): Promise<void> {
    const unsubLink = `${config.apiUrl}/unsubscribe/${token}`;

    await this.transporter.sendMail({
      from: `"Weather App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Weather Update for ${city}`,
      html: `
        <h2>Current Weather in ${city}</h2>
        <p>Temperature: ${weather.temperature}°C</p>
        <p>Humidity: ${weather.humidity}%</p>
        <p>Conditions: ${weather.description}</p>
        <p><a href="${unsubLink}">Unsubscribe</a></p>
      `,
    });
  }
}
