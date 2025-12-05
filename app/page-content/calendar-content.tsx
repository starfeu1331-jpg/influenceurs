'use client';

export default function CalendarContent() {
  return (
    <div className="space-y-6">
      <div className="card-glass p-8">
        <h1 className="text-4xl font-bold text-apple-gray-900 mb-4">Calendrier</h1>
        <p className="text-apple-gray-600">Planning des collaborations</p>
      </div>

      <div className="card-glass p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
            <div key={i} className="text-center font-semibold text-apple-gray-600">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({length: 35}).map((_, i) => (
            <div key={i} className="aspect-square bg-white/50 rounded-lg flex items-center justify-center text-apple-gray-700">
              {i + 1 <= 31 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-apple-gray-900">Collaborations à venir</h3>
        {[1, 2, 3].map(i => (
          <div key={i} className="card-glass p-4">
            <div className="font-medium text-apple-gray-900">Collab {i}</div>
            <div className="text-sm text-apple-gray-600 mt-1">Date: 15 Déc 2025</div>
          </div>
        ))}
      </div>

      {/* Espace pour scroll */}
      <div className="h-screen"></div>
    </div>
  );
}
