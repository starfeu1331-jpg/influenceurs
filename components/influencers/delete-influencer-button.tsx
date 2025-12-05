'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { deleteInfluencer } from '@/lib/actions/influencers';

export function DeleteInfluencerButton({ 
  influencerId,
  influencerName 
}: { 
  influencerId: string;
  influencerName: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await deleteInfluencer(influencerId);
      router.push('/influencers');
      router.refresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-sm"
      >
        🗑️ Supprimer
      </button>

      {mounted && isOpen && createPortal(
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">⚠️ Confirmer la suppression</h2>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer <strong>{influencerName}</strong> ?
              </p>
              <p className="text-sm text-red-600 mb-6">
                Cette action est irréversible. Toutes les données associées (stats, collaborations, scores) seront également supprimées.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Suppression...' : '🗑️ Supprimer définitivement'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
