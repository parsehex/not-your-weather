<script setup lang="ts">
import { useWeatherStore } from '../stores/weather';
import { Button } from '@/components/ui/button';
import { Dice5 } from 'lucide-vue-next';

const weatherStore = useWeatherStore();

const fetchRandomWeather = () => {
	weatherStore.loadRandomWeather();
};
</script>
<template>
	<Button @click="fetchRandomWeather" :disabled="weatherStore.isLoading" title="Show Weather for a Random Location"> <Dice5 /> </Button>
</template>
