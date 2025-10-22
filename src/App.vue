<script setup lang="ts">
import { onMounted } from 'vue';
import { useWeatherStore } from './stores/weather';
import WeatherDisplay from './components/WeatherDisplay.vue';
import LocationSearch from './components/LocationSearch.vue';
import FavoriteLocations from './components/FavoriteLocations.vue';

const weatherStore = useWeatherStore();

onMounted(() => {
  weatherStore.loadRandomWeather();
});
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold text-gray-800 mb-8">Not Your Weather</h1>
    <div class="w-full flex gap-4 justify-center">
      <div v-if="weatherStore.hasFavorites" class="w-1/3 max-w-md bg-white rounded-lg shadow-md p-2 space-y-6">
        <FavoriteLocations />
      </div>
      <div class="w-1/2 max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
        <LocationSearch />
        <WeatherDisplay />
      </div>
    </div>
    <footer class="mt-8 text-gray-600 text-sm">
      Weather and Geocoding data provided by <a href="https://open-meteo.com/" target="_blank" class="text-blue-500 hover:underline">Open-Meteo.com</a>
    </footer>
  </div>
</template>