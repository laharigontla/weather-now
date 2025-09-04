const GEOCODE_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function searchCity(name) {
  const url = `${GEOCODE_BASE}?name=${encodeURIComponent(name)}&count=5&language=en&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch geocoding results')
  const data = await res.json()
  return data?.results ?? []
}

export async function getWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current_weather: 'true',
    timezone: 'auto',
  })
  const res = await fetch(`${WEATHER_BASE}?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch weather')
  return res.json()
}

export const WEATHER_CODE = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}
