import config from "../config/index.js";

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

export class WeatherService {
  private readonly weatherApiUrl = config.weatherApi.url;

  private async getWeather(url: string): Promise<any> {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5000) });

      if (!response.ok) {
        throw new Error(`Weather API responded with status ${response.status}`);
      }

      return response.json();
    } catch (err) {
      throw new Error("City not found");
    }
  }

  async getCurrent(city: string) {
    const url = `${this.weatherApiUrl}/current.json?key=${config.weatherApi.key}&q=${encodeURIComponent(city)}`;

    try {
      const data = await this.getWeather(url);

      const current = data.current;
      console.log(current);

      return {
        temperature: current.temp_c,
        humidity: current.humidity,
        description: current.condition.text,
      };
    } catch (err) {
      console.log(`Weather API error for city ${city}: ${err}`);
      throw new Error(err.message);
    }
  }

  async getForecast(city: string): Promise<WeatherData> {
    const url = `${this.weatherApiUrl}/forecast.json?key=${config.weatherApi.key}&q=${encodeURIComponent(city)}&days=1&aqi=no&alerts=no`;

    try {
      const data = await this.getWeather(url);

      const forecast = data.forecast.forecastday[0].day;

      console.log(forecast);

      return {
        temperature: forecast.avgtemp_c,
        humidity: forecast.avghumidity,
        description: forecast.condition.text,
      };
    } catch (err) {
      console.log(`Weather API error for city ${city}: ${err}`);
      throw new Error(err.message);
    }
  }
}
