export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      {message}
    </div>
  )
}
