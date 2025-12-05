'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';

export function FloatingSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('search', searchTerm);
      router.push(`/influencers?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/influencers?${params.toString()}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-apple-blue-500 to-apple-purple-500 text-white rounded-full shadow-apple-xl hover:shadow-apple-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        aria-label="Rechercher"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 md:w-7 md:h-7" />
        ) : (
          <MagnifyingGlassIcon className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Modal de recherche */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Fenêtre de recherche */}
          <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 animate-slide-up">
            <div className="card-glass p-4 md:p-6 shadow-apple-2xl">
              <h3 className="text-title-3 font-semibold text-apple-gray-900 mb-4">
                🔍 Rechercher un influenceur
              </h3>
              
              <form onSubmit={handleSearch} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom, localisation, notes..."
                    className="w-full px-4 py-3 rounded-apple border border-apple-gray-300 focus:border-apple-blue-500 focus:ring-2 focus:ring-apple-blue-500/20 transition-all text-callout"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray-400 hover:text-apple-gray-600 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!searchTerm.trim()}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-callout py-2.5"
                  >
                    Rechercher
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-apple border border-apple-gray-300 text-apple-gray-700 hover:bg-apple-gray-100 transition-colors text-callout font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </form>

              {searchParams.get('search') && (
                <div className="mt-3 pt-3 border-t border-apple-gray-200">
                  <p className="text-footnote text-apple-gray-600">
                    Recherche actuelle: <span className="font-semibold text-apple-gray-900">{searchParams.get('search')}</span>
                  </p>
                  <button
                    onClick={handleClear}
                    className="mt-2 text-footnote text-apple-blue-600 hover:text-apple-blue-700 font-medium"
                  >
                    Effacer la recherche
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
