<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import { useWeatherStore } from '../stores/weather';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Location } from '../types';
import { searchLocations } from '../services/openMeteoService';
import RandomLocationButton from './RandomLocationButton.vue';

const weatherStore = useWeatherStore();
const searchTerm = ref('');
const searchResults = ref<Location[]>([]);
const searchTimeout: Ref<number | undefined> = ref(undefined);

const performSearch = async () => {
	if (searchTerm.value.trim() === '') {
		searchResults.value = [];
		return;
	}
	try {
		searchResults.value = await searchLocations(searchTerm.value);
	} catch (error) {
		console.error("Error performing location search:", error);
		searchResults.value = [];
	}
};

watch(searchTerm, () => {
	if (searchTimeout.value) {
		clearTimeout(searchTimeout.value);
	}
	searchTimeout.value = setTimeout(() => {
		performSearch();
	}, 300); // Debounce search by 300ms
});

const selectLocation = (location: Location) => {
	weatherStore.loadWeatherForLocation(location);
	searchTerm.value = location.name; // Display selected location in input
	searchResults.value = []; // Clear search results
};

const addLocationToFavorites = (location: Location) => {
	weatherStore.addFavoriteLocation(location);
};
</script>
<template>
	<div class="location-search space-y-2">
		<div class="flex gap-2">
			<Input v-model="searchTerm" placeholder="Search for a location..." @keyup.enter="performSearch" />
			<Button @click="performSearch" :disabled="weatherStore.isLoading">Search</Button>
			<RandomLocationButton />
		</div>
		<div v-if="searchResults.length > 0" class="border rounded-md max-h-48 overflow-y-auto">
			<ul class="divide-y divide-gray-200">
				<li v-for="location in searchResults" :key="location.name"
					class="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer">
					<span @click="selectLocation(location)">{{ location.name }}</span>
					<Button variant="ghost" size="sm" @click="addLocationToFavorites(location)"> Add to Favorites </Button>
				</li>
			</ul>
		</div>
	</div>
</template>
