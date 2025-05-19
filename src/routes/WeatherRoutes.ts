import { Router } from "express";
import { WeatherController } from "../controllers/WeatherController.js";
import { WeatherService } from "../services/WeatherService.js";
import { weatherQueryValidators } from "../validators/WeatherValidators.js";

export function weatherRoutes() {
  const router = Router();
  const controller = new WeatherController(new WeatherService());

  router.get("/", weatherQueryValidators, (req, res) => {
    controller.getCurrentWeather(req, res);
  });

  return router;
}
