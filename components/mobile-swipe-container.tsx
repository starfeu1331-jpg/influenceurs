'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type Props = {
  children: ReactNode[];
};

export default function MobileSwipeContainer({ children }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    // Détecter si mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    currentX.current = e.touches[0].clientX;
    
    const diff = currentX.current - startX.current;
    const container = containerRef.current;
    
    if (container) {
      const offset = -currentIndex * window.innerWidth + diff;
      container.style.transform = `translateX(${offset}px)`;
      container.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    const diff = currentX.current - startX.current;
    const threshold = window.innerWidth * 0.2;
    
    let newIndex = currentIndex;
    
    if (diff < -threshold && currentIndex < children.length - 1) {
      newIndex = currentIndex + 1;
    } else if (diff > threshold && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    
    setCurrentIndex(newIndex);
    
    const container = containerRef.current;
    if (container) {
      container.style.transition = 'transform 0.3s ease-out';
      container.style.transform = `translateX(-${newIndex * 100}%)`;
    }
  };

  // Pendant le chargement, afficher le premier enfant
  if (isMobile === null) {
    return <div className="space-y-4 md:space-y-8">{children}</div>;
  }

  // Desktop : affichage normal en scroll vertical
  if (!isMobile) {
    return <div className="space-y-4 md:space-y-8">{children}</div>;
  }

  // Mobile : swipe horizontal
  return (
    <div className="overflow-hidden relative h-screen">
      {/* Indicateurs de page */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center gap-2">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Container swipeable */}
      <div
        ref={containerRef}
        className="flex h-full touch-pan-y"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children.map((child, idx) => (
          <div
            key={idx}
            className="min-w-full h-full overflow-y-auto"
            style={{ width: '100vw' }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
