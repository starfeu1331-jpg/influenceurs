'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, PanInfo } from 'framer-motion';

const pages = [
  { path: '/', name: 'Dashboard' },
  { path: '/influencers', name: 'Influenceurs' },
  { path: '/projects/pipeline', name: 'Pipeline' },
  { path: '/calendar', name: 'Calendrier' },
];

export default function SwipeableLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);

  const currentIndex = pages.findIndex(page => page.path === pathname);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
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
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
}
