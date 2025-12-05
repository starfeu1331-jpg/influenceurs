'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

type SortBy = 'score' | 'followers' | 'name';

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const sortBy = (searchParams.get('sort') as SortBy) || 'score';
  const platformFilter = searchParams.get('platform') || '';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/influencers?${params.toString()}`);
  };

  const handlePlatformChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('platform', value);
    } else {
      params.delete('platform');
    }
    router.push(`/influencers?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Sort Select */}
      <div className="flex-1 min-w-[200px]">
        <label className="label flex items-center space-x-2 mb-2">
          <ArrowsUpDownIcon className="w-4 h-4 text-apple-gray-600" />
          <span>Trier par</span>
        </label>
        <select
          className="input"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="score">Score (décroissant)</option>
          <option value="followers">Nombre d'abonnés</option>
          <option value="name">Nom (A-Z)</option>
        </select>
      </div>

      {/* Platform Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="label flex items-center space-x-2 mb-2">
          <FunnelIcon className="w-4 h-4 text-apple-gray-600" />
          <span>Plateforme</span>
        </label>
        <select
          className="input"
          value={platformFilter}
          onChange={(e) => handlePlatformChange(e.target.value)}
        >
          <option value="">Toutes les plateformes</option>
          <option value="INSTAGRAM">📸 Instagram</option>
          <option value="TIKTOK">🎵 TikTok</option>
          <option value="YOUTUBE">▶️ YouTube</option>
          <option value="OTHER">🌐 Autre</option>
        </select>
      </div>

      {/* Reset Button (if filters are active) */}
      {(sortBy !== 'score' || platformFilter) && (
        <button
          onClick={() => router.push('/influencers')}
          className="btn-ghost"
        >
          Réinitialiser
        </button>
      )}
    </div>
  );
}

