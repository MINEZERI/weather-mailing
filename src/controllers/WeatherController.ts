import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { WeatherService } from "../services/WeatherService.js";

export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  async getCurrentWeather(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { city } = req.query as { city: string };

    try {
      const weather = await this.weatherService.getCurrent(city);
      return res.status(200).json(weather);
    } catch (err: unknown) {
      if (!(err instanceof Error)) throw new Error("Unknown error occured");

      if (err.message.includes("not found")) {
        return res.status(404).json({ error: "City not found" });
      }
      return res.status(400).json({ error: err.message });
    }
  }
}
