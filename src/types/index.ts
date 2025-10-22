export interface Location {
	name: string;
	latitude: number;
	longitude: number;
}

export interface WeatherData {
	location: Location;
	temperature: number;
	unit: string;
	weatherCode: number;
	time: string;
}
