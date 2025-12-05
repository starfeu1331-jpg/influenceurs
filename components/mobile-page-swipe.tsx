'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const ROUTES = ['/', '/influencers', '/projects/pipeline', '/calendar'];

export default function MobilePageSwipe({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile === false) return; // Ne rien faire sur desktop
    
    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      currentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      
      const diff = currentX.current - startX.current;
      const threshold = window.innerWidth * 0.25; // 25% de l'écran
      
      const currentIndex = ROUTES.indexOf(pathname) !== -1 ? ROUTES.indexOf(pathname) : 0;
      let newIndex = currentIndex;
      
      // Swipe vers la droite = page précédente
      if (diff > threshold && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } 
      // Swipe vers la gauche = page suivante
      else if (diff < -threshold && currentIndex < ROUTES.length - 1) {
        newIndex = currentIndex + 1;
      }
      
      if (newIndex !== currentIndex) {
        router.push(ROUTES[newIndex]);
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, pathname, router]);

  return <>{children}</>;
}
