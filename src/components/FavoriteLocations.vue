<script setup lang="ts">
import { useWeatherStore } from '../stores/weather';
import { storeToRefs } from 'pinia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Location } from '@/types';

const weatherStore = useWeatherStore();
const { favoriteLocations } = storeToRefs(weatherStore);

const viewFavoriteWeather = (location: Location) => {
  weatherStore.loadWeatherForLocation(location);
};

const removeFavorite = (locationName: string) => {
  weatherStore.removeFavoriteLocation(locationName);
};
</script>

<template>
  <Card class="favorite-locations">
    <CardHeader>
      <CardTitle>Favorite Locations</CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="favoriteLocations.length === 0" class="text-center text-gray-500">
        No favorite locations added yet.
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="location in favoriteLocations"
          :key="location.name"
          class="flex items-center justify-between p-2 border rounded-md"
        >
          <span class="font-medium">{{ location.name }}</span>
          <div class="space-x-2">
            <Button variant="outline" size="sm" @click="viewFavoriteWeather(location)">
              View Weather
            </Button>
            <Button variant="destructive" size="sm" @click="removeFavorite(location.name)">
              Remove
            </Button>
          </div>
        </li>
      </ul>
    </CardContent>
  </Card>
</template>