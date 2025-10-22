import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import type { Location, WeatherData } from '../types';
import { fetchWeather, getRandomLocation } from '../services/openMeteoService';

const FAVORITE_LOCATIONS_KEY = 'favoriteLocations';

export const useWeatherStore = defineStore('weather', () => {
	const currentWeather = ref<WeatherData | null>(null);
	const favoriteLocations = useLocalStorage<Location[]>(
		FAVORITE_LOCATIONS_KEY,
		[]
	);
	const hasFavorites = computed(() => favoriteLocations.value.length > 0);
	const isLoading = ref<boolean>(false);
	const error = ref<string | null>(null);

	async function loadRandomWeather() {
		isLoading.value = true;
		error.value = null;
		try {
			const randomLocation = getRandomLocation();
			const data = await fetchWeather(randomLocation);
			currentWeather.value = data;
		} catch (e: any) {
			error.value = e.message || 'Failed to fetch random weather.';
		} finally {
			isLoading.value = false;
		}
	}

	async function loadWeatherForLocation(location: Location) {
		isLoading.value = true;
		error.value = null;
		try {
			const data = await fetchWeather(location);
			currentWeather.value = data;
		} catch (e: any) {
			error.value =
				e.message || `Failed to fetch weather for ${location.name}.`;
		} finally {
			isLoading.value = false;
		}
	}

	function addFavoriteLocation(location: Location) {
		if (!favoriteLocations.value.some((fav) => fav.name === location.name)) {
			favoriteLocations.value.push(location);
		}
	}

	function isFavoriteLocation(location: Location | string) {
		const locationName = typeof location === 'string' ? location : location.name;
		return !!favoriteLocations.value.find(
			(fav) => fav.name === locationName
		);
	}
	
	function removeFavoriteLocation(locationName: string) {
		favoriteLocations.value = favoriteLocations.value.filter(
			(fav) => fav.name !== locationName
		);
	}

	return {
		currentWeather,
		favoriteLocations,
		hasFavorites,
		isLoading,
		error,
		loadRandomWeather,
		loadWeatherForLocation,
		addFavoriteLocation,
		isFavoriteLocation,
		removeFavoriteLocation,
	};
});
