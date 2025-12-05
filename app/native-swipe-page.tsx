'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useMotionValue, PanInfo, useSpring } from 'framer-motion';

const PAGES = [
  { path: '/', name: 'Dashboard' },
  { path: '/influencers', name: 'Influenceurs' },
  { path: '/projects/pipeline', name: 'Pipeline' },
  { path: '/calendar', name: 'Calendrier' }
] as const;

interface NativeSwipeLayoutProps {
  children: React.ReactNode;
}

export default function NativeSwipeLayout({ children }: NativeSwipeLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 40 });
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  // Index actuel basé sur pathname
  const currentIndex = PAGES.findIndex(page => page.path === pathname);
  const validIndex = currentIndex === -1 ? 0 : currentIndex;

  // Prefetch agressif de TOUTES les pages au montage
  useEffect(() => {
    PAGES.forEach(page => {
      router.prefetch(page.path);
    });
  }, [router]);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleDragStart = useCallback(() => {
    if (isTransitioning.current) return;
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    if (isTransitioning.current) return;
    
    setIsDragging(false);
    const threshold = 60; // Seuil réduit pour meilleure réactivité
    const velocity = Math.abs(info.velocity.x);
    const offset = info.offset.x;

    // Swipe vers la droite (page précédente)
    if ((offset > threshold || (offset > 25 && velocity > 400)) && validIndex > 0) {
      isTransitioning.current = true;
      router.push(PAGES[validIndex - 1].path);
      setTimeout(() => { isTransitioning.current = false; }, 300);
    }
    // Swipe vers la gauche (page suivante)
    else if ((offset < -threshold || (offset < -25 && velocity > 400)) && validIndex < PAGES.length - 1) {
      isTransitioning.current = true;
      router.push(PAGES[validIndex + 1].path);
      setTimeout(() => { isTransitioning.current = false; }, 300);
    }

    // Reset position avec animation
    x.set(0);
  }, [validIndex, router, x]);

  return (
    <>
      <motion.div
        ref={containerRef}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ 
          x: springX,
          touchAction: 'pan-y', // Autorise scroll vertical natif
        }}
        whileTap={{ cursor: 'grabbing' }}
        className={`will-change-transform transition-opacity duration-150 ${
          isDragging ? 'opacity-95' : 'opacity-100'
        }`}
      >
        {children}
      </motion.div>

      {/* Page indicators - style iOS */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-2 z-50 pointer-events-none px-safe">
        {PAGES.map((page, index) => (
          <motion.div
            key={page.path}
            initial={false}
            animate={{
              width: index === validIndex ? 28 : 8,
              opacity: index === validIndex ? 1 : 0.4,
              scale: index === validIndex ? 1.1 : 1,
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 500, 
              damping: 35,
              mass: 0.5
            }}
            className={`h-2 rounded-full backdrop-blur-sm ${
              index === validIndex
                ? 'bg-apple-blue-500 shadow-lg shadow-apple-blue-500/40'
                : 'bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Haptic-like visual feedback */}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black pointer-events-none z-40"
        />
      )}
    </>
  );
}
