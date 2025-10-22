import { fetchWeatherApi } from 'openmeteo';
import type { Location, WeatherData } from '../types';

export async function fetchWeather(location: Location): Promise<WeatherData> {
	const params = {
		latitude: [location.latitude],
		longitude: [location.longitude],
		current: ['temperature_2m', 'weather_code'],
		temperature_unit: 'fahrenheit',
		// timezone: 'America/New_York', // Default timezone for now
	};
	const url = 'https://api.open-meteo.com/v1/forecast';

	try {
		const responses = await fetchWeatherApi(url, params);

		const response = responses[0];
		
		if (!response) {
			throw new Error('No weather data received for the specified location.');
		}
		
		const current = response.current()!;
		console.log(current, current.time());

		if (!current) {
			throw new Error('No current weather data available.');
		}

		const temperature = current.variables(0)!.value();
		const weatherCode = current.variables(1)!.value();
		const time = new Date(
			(Number(current.time()) + response.utcOffsetSeconds()) * 1000
		);

		return {
			location: location,
			temperature: temperature,
			unit: '°F',
			weatherCode: weatherCode,
			time: time.toISOString(),
		};
	} catch (error) {
		console.error('Error fetching weather data:', error);
		throw error;
	}
}

interface GeocodingResult {
	id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // State or Province
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query) {
    return [];
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.results) {
      return data.results.map((result: GeocodingResult) => ({
        name: result.name + (result.admin1 ? `, ${result.admin1}` : '') + `, ${result.country}`,
        latitude: result.latitude,
        longitude: result.longitude,
      })) as Location[];
    }
    return [];
  } catch (error) {
    console.error("Error searching locations:", error);
    throw error;
  }
}

// Function to get a random location
export function getRandomLocation(): Location {
	const randomLocations: Location[] = [
		{ name: 'Tokyo', latitude: 35.6895, longitude: 139.6917 },
		{ name: 'London', latitude: 51.5074, longitude: -0.1278 },
		{ name: 'New York', latitude: 40.7128, longitude: -74.006 },
		{ name: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
		{ name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
		{ name: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729 },
		{ name: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
		{ name: 'Dubai', latitude: 25.276987, longitude: 55.296249 },
		{ name: 'Moscow', latitude: 55.7558, longitude: 37.6173 },
		{ name: 'Beijing', latitude: 39.9042, longitude: 116.4074 },
	];
	const randomIndex = Math.floor(Math.random() * randomLocations.length);
	return randomLocations[randomIndex] as Location;
}
