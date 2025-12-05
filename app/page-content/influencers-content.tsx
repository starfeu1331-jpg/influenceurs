'use client';

export default function InfluencersContent() {
  return (
    <div className="space-y-6">
      <div className="card-glass p-8">
        <h1 className="text-4xl font-bold text-apple-gray-900 mb-4">Influenceurs</h1>
        <p className="text-apple-gray-600">Liste de tous vos créateurs de contenu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card-glass p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-apple-blue-500 to-apple-purple-500 rounded-full"></div>
              <div>
                <div className="font-semibold text-apple-gray-900">Influenceur {i}</div>
                <div className="text-sm text-apple-gray-600">Instagram • 50K</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Espace pour scroll */}
      <div className="h-screen"></div>
    </div>
  );
}
