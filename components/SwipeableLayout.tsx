'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';

const pages = [
  { path: '/', name: 'Dashboard' },
  { path: '/influencers', name: 'Influenceurs' },
  { path: '/projects/pipeline', name: 'Pipeline' },
  { path: '/calendar', name: 'Calendrier' },
];

// Pages où le swipe est désactivé (formulaires, édition)
const disableSwipeRoutes = [
  '/influencers/new',
  '/influencers/compare',
  '/projects/new',
];

export default function SwipeableLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Détection mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // < 1024px = mobile/tablet
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentIndex = pages.findIndex(page => page.path === pathname);
  
  // Vérifier si on est sur une page de formulaire ou d'édition
  const isFormPage = disableSwipeRoutes.some(route => pathname.startsWith(route)) || 
                     pathname.includes('/influencers/') && pathname !== '/influencers' ||
                     pathname.includes('/projects/') && pathname !== '/projects/pipeline';

  // Désactiver le swipe si : desktop OU page de formulaire
  const swipeDisabled = !isMobile || isFormPage;

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Ne rien faire si le swipe est désactivé
    if (swipeDisabled) return;

    const swipeThreshold = 100;
    const swipeVelocity = 300;

    if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > swipeVelocity) {
      if (info.offset.x > 0) {
        // Swipe droite → page précédente
        if (currentIndex > 0) {
          setDirection(-1);
          router.prefetch(pages[currentIndex - 1].path);
          router.push(pages[currentIndex - 1].path);
        }
      } else {
        // Swipe gauche → page suivante
        if (currentIndex < pages.length - 1) {
          setDirection(1);
          router.prefetch(pages[currentIndex + 1].path);
          router.push(pages[currentIndex + 1].path);
        }
      }
    }
  };

  return (
    <motion.div
      drag={swipeDisabled ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className={swipeDisabled ? "" : "cursor-grab active:cursor-grabbing"}
    >
      {children}
    </motion.div>
  );
}
