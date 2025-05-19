import { query } from "express-validator";

export const weatherQueryValidators = [
  query("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .matches(/^[a-zA-Z\s\-]+$/)
    .withMessage("Invalid city"),
];
