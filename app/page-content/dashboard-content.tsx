'use client';

export default function DashboardContent() {
  return (
    <div className="space-y-8">
      <div className="card-glass p-8">
        <h1 className="text-4xl font-bold text-apple-gray-900 mb-4">Dashboard</h1>
        <p className="text-apple-gray-600">Gérez vos campagnes influenceurs avec intelligence</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-glass p-6">
          <div className="text-sm text-apple-gray-600 mb-2">Total influenceurs</div>
          <div className="text-3xl font-bold text-apple-gray-900">42</div>
        </div>
        <div className="card-glass p-6">
          <div className="text-sm text-apple-gray-600 mb-2">Score moyen</div>
          <div className="text-3xl font-bold text-apple-gray-900">75.3</div>
        </div>
        <div className="card-glass p-6">
          <div className="text-sm text-apple-gray-600 mb-2">Projets actifs</div>
          <div className="text-3xl font-bold text-apple-gray-900">12</div>
        </div>
        <div className="card-glass p-6">
          <div className="text-sm text-apple-gray-600 mb-2">Budget total</div>
          <div className="text-3xl font-bold text-apple-gray-900">156k€</div>
        </div>
      </div>

      <div className="card-glass p-8">
        <h2 className="text-2xl font-bold text-apple-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white/50 rounded-apple-lg border border-apple-gray-100">
            <div className="font-semibold text-apple-gray-900 mb-1">Pipeline</div>
            <div className="text-sm text-apple-gray-600">Gérer les projets</div>
          </div>
          <div className="p-5 bg-white/50 rounded-apple-lg border border-apple-gray-100">
            <div className="font-semibold text-apple-gray-900 mb-1">Calendrier</div>
            <div className="text-sm text-apple-gray-600">Planning collabs</div>
          </div>
          <div className="p-5 bg-white/50 rounded-apple-lg border border-apple-gray-100">
            <div className="font-semibold text-apple-gray-900 mb-1">Comparateur</div>
            <div className="text-sm text-apple-gray-600">Analyser influenceurs</div>
          </div>
          <div className="p-5 bg-white/50 rounded-apple-lg border border-apple-gray-100">
            <div className="font-semibold text-apple-gray-900 mb-1">Influenceurs</div>
            <div className="text-sm text-apple-gray-600">Liste complète</div>
          </div>
        </div>
      </div>

      {/* Espace pour scroll */}
      <div className="h-screen"></div>
    </div>
  );
}
