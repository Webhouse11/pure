import React, { useEffect, useState, useRef } from 'react';
import { AdPlacement, AdSettings } from '../types';

interface AdZoneProps {
  type: AdPlacement;
  className?: string;
  id?: string;
}

const AdZone: React.FC<AdZoneProps> = ({ type, className = "", id }) => {
  const [adConfig, setAdConfig] = useState<{active: boolean, code: string}>({ active: true, code: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncAds = () => {
      const savedAds = localStorage.getItem('purelife_ads');
      if (savedAds) {
        const parsed: AdSettings = JSON.parse(savedAds);
        if (parsed[type]) {
          setAdConfig(parsed[type]);
        }
      }
    };

    syncAds();
    window.addEventListener('ads-updated', syncAds);
    return () => window.removeEventListener('ads-updated', syncAds);
  }, [type]);

  // Handle script execution and dynamic triggers
  useEffect(() => {
    if (adConfig.active && adConfig.code && containerRef.current) {
      // Special logic for direct-link high-yield triggers
      if (type === 'direct-link') {
        const url = adConfig.code.match(/https?:\/\/[^\s"']+/)?.[0] || adConfig.code;
        const clickHandler = () => {
          window.open(url, '_blank');
          document.removeEventListener('click', clickHandler);
        };
        document.addEventListener('click', clickHandler, { once: true });
        return () => document.removeEventListener('click', clickHandler);
      }

      const container = containerRef.current;
      container.innerHTML = '';

      const range = document.createRange();
      const fragment = range.createContextualFragment(adConfig.code);
      
      const scripts = Array.from(fragment.querySelectorAll('script'));
      const nonScripts = Array.from(fragment.childNodes).filter(node => node.nodeName !== 'SCRIPT');
      
      nonScripts.forEach(node => container.appendChild(node.cloneNode(true)));

      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        container.appendChild(newScript);
      });
    }
  }, [adConfig, type]);

  if (!adConfig.active) return null;

  // Pop-under and direct-link are purely functional
  if (type === 'pop-under' || type === 'direct-link') {
    return <div ref={containerRef} style={{ display: 'none' }} aria-hidden="true" />;
  }

  const deviceClass = type.startsWith('mobile') ? 'md:hidden' : 
    (['leaderboard', 'skyscraper', 'tenancy-rectangle', 'sticky'].includes(type) ? 'hidden md:flex' : '');

  if (adConfig.code && adConfig.code.trim().length > 0) {
    return (
      <div 
        ref={containerRef}
        className={`${className} ${deviceClass} flex justify-center items-center overflow-hidden`}
        id={id}
      />
    );
  }

  // Placeholder logic for empty slots (visual only in Dev)
  const getDimensions = () => {
    switch (type) {
      case 'leaderboard': return 'h-24 w-full max-w-4xl';
      case 'mobile-leaderboard': return 'h-20 w-full';
      case 'sidebar': return 'h-[250px] w-full';
      case 'tenancy-rectangle': return 'h-80 w-full border-red-500 border-2';
      case 'anchor':
      case 'mobile-anchor': return 'h-16 w-full fixed bottom-0 left-0 z-50 shadow-2xl bg-white border-t border-gray-200';
      case 'skyscraper': return 'h-[600px] w-full';
      case 'in-text': return 'h-48 w-full my-6 bg-gray-50';
      case 'sticky': return 'sticky top-24 h-64 w-full bg-gray-50';
      default: return 'h-20 w-full';
    }
  };

  const getLabel = () => type.replace(/-/g, ' ').toUpperCase();

  return (
    <div className={`ad-placeholder ${getDimensions()} ${className} ${deviceClass}`}>
      <span className="text-[8px] font-black opacity-30 tracking-[0.2em]">{getLabel()}</span>
    </div>
  );
};

export default AdZone;