'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, PanInfo, useTransform } from 'framer-motion';

// Import du contenu des pages (on va les créer juste après)
import DashboardContent from './page-content/dashboard-content';
import InfluencersContent from './page-content/influencers-content';
import PipelineContent from './page-content/pipeline-content';
import CalendarContent from './page-content/calendar-content';

export default function TrueNativeSwipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Transform qui calcule la position du container
  const containerX = useTransform(x, (latest) => {
    return -currentIndex * viewportWidth + latest;
  });

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback((event: any, info: PanInfo) => {
    setIsDragging(false);
    const threshold = viewportWidth * 0.2; // 20% de l'écran
    const velocity = info.velocity.x;

    // Swipe vers la droite (page précédente)
    if ((info.offset.x > threshold || velocity > 500) && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    // Swipe vers la gauche (page suivante)
    else if ((info.offset.x < -threshold || velocity < -500) && currentIndex < 3) {
      setCurrentIndex(prev => prev + 1);
    }

    // Reset drag offset
    x.set(0);
  }, [currentIndex, viewportWidth, x]);

  return (
    <div className="fixed inset-0 top-14 md:top-16 overflow-hidden bg-apple-gray-50">
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ 
          x: containerX,
          touchAction: 'pan-y',
        }}
        animate={{
          x: -currentIndex * viewportWidth
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
        className="flex h-full will-change-transform"
      >
        {/* Page 1: Dashboard */}
        <div 
          className="flex-shrink-0 h-full overflow-y-auto overflow-x-hidden"
          style={{ width: `${viewportWidth}px` }}
        >
          <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4">
            <DashboardContent />
          </div>
        </div>

        {/* Page 2: Influenceurs */}
        <div 
          className="flex-shrink-0 h-full overflow-y-auto overflow-x-hidden"
          style={{ width: `${viewportWidth}px` }}
        >
          <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4">
            <InfluencersContent />
          </div>
        </div>

        {/* Page 3: Pipeline */}
        <div 
          className="flex-shrink-0 h-full overflow-y-auto overflow-x-hidden"
          style={{ width: `${viewportWidth}px` }}
        >
          <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4">
            <PipelineContent />
          </div>
        </div>

        {/* Page 4: Calendar */}
        <div 
          className="flex-shrink-0 h-full overflow-y-auto overflow-x-hidden"
          style={{ width: `${viewportWidth}px` }}
        >
          <div className="max-w-7xl mx-auto px-3 md:px-6 lg:px-8 py-4">
            <CalendarContent />
          </div>
        </div>
      </motion.div>

      {/* Page indicators */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center space-x-2 z-50 pointer-events-none">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            animate={{
              width: index === currentIndex ? 28 : 8,
              opacity: index === currentIndex ? 1 : 0.4,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className={`h-2 rounded-full ${
              index === currentIndex
                ? 'bg-apple-blue-500 shadow-lg'
                : 'bg-white/60 backdrop-blur-sm'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
