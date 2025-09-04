import { WEATHER_CODE } from '../lib/api'

function formatLocation(loc) {
  const bits = [loc?.name, loc?.admin1, loc?.country].filter(Boolean)
  return bits.join(', ')
}

export default function WeatherCard({ location, current }) {
  if (!current) return null

  const desc = WEATHER_CODE?.[current.weathercode] ?? `Code ${current.weathercode}`
  const when = current.time ? new Date(current.time).toLocaleString() : ''

  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-2 text-sm text-slate-500">{formatLocation(location)}</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-5xl font-semibold leading-none">{current.temperature}°C</div>
          <div className="mt-1 text-slate-600">{desc}</div>
        </div>
        <div className="text-right text-sm text-slate-600">
          <div>Wind: {current.windspeed} km/h</div>
          <div>Dir: {current.winddirection}°</div>
          <div className="mt-1 text-slate-500">{when}</div>
        </div>
      </div>
    </div>
  )
}
