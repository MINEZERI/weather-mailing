import dotenv from "dotenv";

dotenv.config();

export default {
  db: {
    url: process.env.DATABASE_URL || "",
  },
  port: process.env.API_PORT || 3000,
  weatherApi: {
    key: process.env.WEATHER_API_KEY || "",
    url: process.env.WEATHER_API_URL || "",
  },
  email: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
  jwtSecret: process.env.JWT_SECRET || "secret",
  apiUrl: process.env.API_URL || "",
};
