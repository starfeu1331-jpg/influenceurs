'use client';

import { FaInstagram, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa';

export function PlatformIcon({ platform }: { platform: string }) {
  const iconClass = "w-4 h-4";
  
  switch (platform) {
    case 'INSTAGRAM':
      return <FaInstagram className={iconClass} />;
    case 'TIKTOK':
      return <FaTiktok className={iconClass} />;
    case 'YOUTUBE':
      return <FaYoutube className={iconClass} />;
    case 'OTHER':
      return <FaGlobe className={iconClass} />;
    default:
      return <FaGlobe className={iconClass} />;
  }
}
