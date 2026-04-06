export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Canopy AI</h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Let&apos;s get your dashboard set up. This takes about 46 minutes and you only do it once.
          After that, everything runs automatically.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Start Setup →
        </a>
        <p className="text-xs text-gray-300 mt-4">
          6 steps · Guesty · PriceLabs · Airbnb · VRBO · Booking.com · Turno · Lindy · Gmail
        </p>
      </div>
    </div>
  );
}
