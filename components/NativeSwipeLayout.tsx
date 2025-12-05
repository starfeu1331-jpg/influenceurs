'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const pages = [
  { path: '/', name: 'Dashboard', component: null },
  { path: '/influencers', name: 'Influenceurs', component: null },
  { path: '/projects/pipeline', name: 'Pipeline', component: null },
  { path: '/calendar', name: 'Calendrier', component: null },
];

interface NativeSwipeLayoutProps {
  children: React.ReactNode;
  pageIndex: number;
}

export default function NativeSwipeLayout({ children, pageIndex }: NativeSwipeLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculer l'index actuel basé sur le pathname
  const currentIndex = pages.findIndex(page => page.path === pathname) ?? pageIndex;

  // Position de départ basée sur l'index
  const startX = -currentIndex * (typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const targetX = -currentIndex * window.innerWidth;
      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [currentIndex, x]);

  const handleDragEnd = (_: any, info: { offset: { x: number }, velocity: { x: number } }) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    let newIndex = currentIndex;

    // Swipe droite (page précédente)
    if ((offset > threshold || velocity > 500) && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }
    // Swipe gauche (page suivante)
    else if ((offset < -threshold || velocity < -500) && currentIndex < pages.length - 1) {
      newIndex = currentIndex + 1;
    }

    if (newIndex !== currentIndex) {
      router.push(pages[newIndex].path);
    } else {
      // Retour à la position actuelle
      animate(x, -currentIndex * window.innerWidth, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  };

  return (
    <div className="overflow-hidden relative h-full" ref={containerRef}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`flex h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {pages.map((page, index) => (
          <div
            key={page.path}
            className="min-w-full h-full"
            style={{ width: '100vw' }}
          >
            {index === pageIndex && children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
