'use client';

import { useEffect, useState, ReactNode } from 'react';
import MobileSwipeContainer from './mobile-swipe-container';

type Props = {
  children: ReactNode[];
};

export default function ConditionalSwipeWrapper({ children }: Props) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pendant le chargement : affichage desktop par défaut
  if (isMobile === null) {
    return <div className="space-y-4 md:space-y-8">{children}</div>;
  }

  // Desktop : scroll vertical classique
  if (!isMobile) {
    return <div className="space-y-4 md:space-y-8">{children}</div>;
  }

  // Mobile : swipe horizontal
  return <MobileSwipeContainer>{children}</MobileSwipeContainer>;
}
