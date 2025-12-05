import { createInfluencer } from '@/lib/actions/influencers';

export default function NewInfluencerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Nouvel influenceur</h1>

      <div className="card-glass p-6 max-w-2xl">
        <form action={createInfluencer}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Plateformes 📱</h3>
              <p className="text-sm text-gray-600 mb-4">Ajoutez au moins une plateforme</p>
              
              {/* Instagram */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 mb-3">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="hasInstagram" name="hasInstagram" className="mr-2" />
                  <label htmlFor="hasInstagram" className="font-medium">📸 Instagram</label>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-6">
                  <input
                    type="text"
                    name="instagramUsername"
                    placeholder="@username"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    name="instagramFollowers"
                    placeholder="Abonnés"
                    min="0"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="url"
                    name="instagramUrl"
                    placeholder="URL profil"
                    className="col-span-2 border rounded px-3 py-2 text-sm"
                  />
                  <label className="col-span-2 flex items-center text-sm">
                    <input type="checkbox" name="instagramIsMain" className="mr-2" />
                    Plateforme principale
                  </label>
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-gradient-to-r from-gray-900/5 to-teal-50 rounded-lg p-4 mb-3">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="hasTikTok" name="hasTikTok" className="mr-2" />
                  <label htmlFor="hasTikTok" className="font-medium">🎵 TikTok</label>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-6">
                  <input
                    type="text"
                    name="tiktokUsername"
                    placeholder="@username"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    name="tiktokFollowers"
                    placeholder="Abonnés"
                    min="0"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="url"
                    name="tiktokUrl"
                    placeholder="URL profil"
                    className="col-span-2 border rounded px-3 py-2 text-sm"
                  />
                  <label className="col-span-2 flex items-center text-sm">
                    <input type="checkbox" name="tiktokIsMain" className="mr-2" />
                    Plateforme principale
                  </label>
                </div>
              </div>

              {/* YouTube */}
              <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-lg p-4 mb-3">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="hasYouTube" name="hasYouTube" className="mr-2" />
                  <label htmlFor="hasYouTube" className="font-medium">▶️ YouTube</label>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-6">
                  <input
                    type="text"
                    name="youtubeUsername"
                    placeholder="Nom chaîne"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    name="youtubeFollowers"
                    placeholder="Abonnés"
                    min="0"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="url"
                    name="youtubeUrl"
                    placeholder="URL chaîne"
                    className="col-span-2 border rounded px-3 py-2 text-sm"
                  />
                  <label className="col-span-2 flex items-center text-sm">
                    <input type="checkbox" name="youtubeIsMain" className="mr-2" />
                    Plateforme principale
                  </label>
                </div>
              </div>

              {/* Autre */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <input type="checkbox" id="hasOther" name="hasOther" className="mr-2" />
                  <label htmlFor="hasOther" className="font-medium">🌐 Autre plateforme</label>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-6">
                  <input
                    type="text"
                    name="otherUsername"
                    placeholder="Username"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    name="otherFollowers"
                    placeholder="Abonnés"
                    min="0"
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <input
                    type="url"
                    name="otherUrl"
                    placeholder="URL profil"
                    className="col-span-2 border rounded px-3 py-2 text-sm"
                  />
                  <label className="col-span-2 flex items-center text-sm">
                    <input type="checkbox" name="otherIsMain" className="mr-2" />
                    Plateforme principale
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="ex: France, Paris"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Créer l'influenceur
            </button>
            <a
              href="/influencers"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Annuler
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
