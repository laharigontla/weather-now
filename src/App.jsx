import { useEffect, useRef, useState } from 'react'
import { getWeather, searchCity } from './lib/api'
import WeatherCard from './components/WeatherCard'
import ErrorBanner from './components/ErrorBanner'

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [location, setLocation] = useState(null)
  const [current, setCurrent] = useState(null)

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  async function fetchByCity() {
    const name = query.trim()
    if (!name) {
      setError('Please enter a city name.')
      return
    }

    setLoading(true)
    setError('')
    setSuggestions([])
    setCurrent(null)

    try {
      const results = await searchCity(name)
      if (results.length === 0) {
        setError('No matching city found. Try another name or check spelling.')
        return
      }

      setSuggestions(results)
      const top = results[0]
      await fetchWeatherFor({
        name: top.name,
        admin1: top.admin1,
        country: top.country,
        latitude: top.latitude,
        longitude: top.longitude,
      })
    } catch (e) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchWeatherFor(loc) {
    setLoading(true)
    setError('')
    try {
      const data = await getWeather(loc.latitude, loc.longitude)
      setLocation(loc)
      setCurrent(data.current_weather)
    } catch (e) {
      setError('Could not load weather for that location.')
    } finally {
      setLoading(false)
    }
  }

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported in this browser.')
      return
    }
    setError('')
    setLoading(true)
    setSuggestions([])
    setCurrent(null)

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        await fetchWeatherFor({
          name: 'Your Location',
          admin1: '',
          country: '',
          latitude,
          longitude,
        })
      },
      () => {
        setLoading(false)
        setError('Permission denied. Please allow location access or search by city name.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 pb-16 pt-10">
      <header className="mb-8">
        <h1 className="text-center text-3xl font-bold">🌦 Weather Now</h1>
        <p className="mt-2 text-center text-slate-600">
          Search a city or use your location to see the current weather.
        </p>
      </header>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Hyderabad, London, Tokyo"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none ring-blue-200 focus:ring"
        />
        <button
          onClick={fetchByCity}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700 active:translate-y-px"
        >
          Search
        </button>
        <button
          onClick={useMyLocation}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 hover:bg-slate-50 active:translate-y-px"
        >
          Use My Location
        </button>
      </div>

      {loading && (
        <div className="mt-4 animate-pulse rounded-xl border border-slate-200 bg-white p-4 text-center text-slate-600">
          Loading…
        </div>
      )}

      <ErrorBanner message={error} />

      {suggestions.length > 1 && (
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-slate-600">Did you mean:</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={`${sug.latitude}-${sug.longitude}-${sug.name}`}
                onClick={() =>
                  fetchWeatherFor({
                    name: sug.name,
                    admin1: sug.admin1,
                    country: sug.country,
                    latitude: sug.latitude,
                    longitude: sug.longitude,
                  })
                }
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
              >
                {sug.name}
                {sug.admin1 ? `, ${sug.admin1}` : ''}
                {sug.country ? `, ${sug.country}` : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      <WeatherCard location={location} current={current} />

      <footer className="mt-10 text-center text-xs text-slate-500">
        Data: Open‑Meteo Geocoding & Forecast APIs (no API key needed)
      </footer>
    </div>
  )
}
