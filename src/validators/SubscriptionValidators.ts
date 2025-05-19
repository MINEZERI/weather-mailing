import { body, param } from "express-validator";

export const subscribeValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Invalid city format"),

  body("frequency").isIn(["hourly", "daily"]).withMessage("Invalid frequency"),
];

export const tokenParamValidators = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Token is required")
    .isJWT()
    .withMessage("Invalid token"),
];
