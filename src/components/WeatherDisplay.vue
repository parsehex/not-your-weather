<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { HeartPlus, HeartMinus } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { useWeatherStore } from '../stores/weather';
import { ref, watch } from 'vue';

const weatherStore = useWeatherStore();
const { currentWeather, isLoading, error } = storeToRefs(weatherStore);

// Helper function to convert weather code to a descriptive string
const getWeatherDescription = (code: number): string => {
	// This is a simplified mapping. A more comprehensive one would be needed for a full app.
	if (code >= 0 && code <= 1) return 'Clear sky';
	if (code >= 2 && code <= 3) return 'Partly cloudy';
	if (code >= 45 && code <= 48) return 'Fog';
	if (code >= 51 && code <= 55) return 'Drizzle';
	if (code >= 61 && code <= 65) return 'Rain';
	if (code >= 71 && code <= 75) return 'Snow fall';
	if (code >= 80 && code <= 82) return 'Rain showers';
	if (code >= 85 && code <= 86) return 'Snow showers';
	if (code >= 95 && code <= 99) return 'Thunderstorm';
	return 'Unknown';
};

const isFavorite = ref(false);
// const isFavorite = computed(() => {
// 	if (!weatherStore.currentWeather) return false;
// 	return weatherStore.isFavoriteLocation(weatherStore.currentWeather.location);
// })
watch(() => [weatherStore.currentWeather, weatherStore.favoriteLocations], (newVal) => {
	if (!newVal || !weatherStore.currentWeather) return;
	const location = Array.isArray(newVal) ? weatherStore.currentWeather.location : newVal;
	isFavorite.value = weatherStore.isFavoriteLocation(location);
}, { deep: true, immediate: true })
</script>
<template>
	<div class="weather-display p-4 border rounded-lg shadow-sm">
		<div v-if="isLoading" class="text-center text-gray-600">Loading weather data...</div>
		<div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
		<div v-else-if="currentWeather">
			<h2 class="text-2xl font-semibold text-gray-700 mb-2 flex items-center gap-4">
				{{ currentWeather.location.name }}
				<Button size="icon-sm" variant="ghost" @click="weatherStore.addFavoriteLocation(currentWeather.location)" :title="`Add ${currentWeather.location.name} to your favorite locations.`">
					<HeartPlus v-if="!isFavorite" />
					<HeartMinus v-else />
				</Button>
			</h2>
			<p class="text-5xl font-bold text-gray-900 mb-2"> {{ Math.round(currentWeather.temperature) }}{{
				currentWeather.unit }} </p>
			<p class="text-lg text-gray-600 mb-1"> {{ getWeatherDescription(currentWeather.weatherCode) }} </p>
			<p class="text-sm text-gray-500"> As of {{ new Date(currentWeather.time).toLocaleTimeString() }} </p>
		</div>
		<div v-else class="text-center text-gray-500"> No weather data available. Search for a location or load random
			weather. </div>
	</div>
</template>
