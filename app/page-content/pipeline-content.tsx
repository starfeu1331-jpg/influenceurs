'use client';

export default function PipelineContent() {
  return (
    <div className="space-y-6">
      <div className="card-glass p-8">
        <h1 className="text-4xl font-bold text-apple-gray-900 mb-4">Pipeline</h1>
        <p className="text-apple-gray-600">Gestion des projets en cours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-apple-gray-900 mb-4">Premier Contact</h3>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="card-glass p-4">
                <div className="font-medium text-apple-gray-900">Projet {i}</div>
                <div className="text-sm text-apple-gray-600 mt-1">Budget: 5000€</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-apple-gray-900 mb-4">Négociation</h3>
          <div className="space-y-3">
            {[3, 4].map(i => (
              <div key={i} className="card-glass p-4">
                <div className="font-medium text-apple-gray-900">Projet {i}</div>
                <div className="text-sm text-apple-gray-600 mt-1">Budget: 8000€</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-apple-gray-900 mb-4">En Cours</h3>
          <div className="space-y-3">
            {[5, 6].map(i => (
              <div key={i} className="card-glass p-4">
                <div className="font-medium text-apple-gray-900">Projet {i}</div>
                <div className="text-sm text-apple-gray-600 mt-1">Budget: 12000€</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Espace pour scroll */}
      <div className="h-screen"></div>
    </div>
  );
}
