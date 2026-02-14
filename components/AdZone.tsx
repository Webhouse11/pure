
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
    const savedAds = localStorage.getItem('purelife_ads');
    if (savedAds) {
      const parsed: AdSettings = JSON.parse(savedAds);
      if (parsed[type]) {
        setAdConfig(parsed[type]);
      }
    }

    const handleAdUpdate = () => {
      const updated = localStorage.getItem('purelife_ads');
      if (updated) {
        const parsed: AdSettings = JSON.parse(updated);
        if (parsed[type]) setAdConfig(parsed[type]);
      }
    };

    window.addEventListener('ads-updated', handleAdUpdate);
    return () => window.removeEventListener('ads-updated', handleAdUpdate);
  }, [type]);

  // Handle script execution for injected ad code
  useEffect(() => {
    if (adConfig.active && adConfig.code && containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = ''; // Clear previous

      const range = document.createRange();
      const fragment = range.createContextualFragment(adConfig.code);
      
      // We need to manually handle script tags because contextual fragments 
      // sometimes don't execute scripts depending on the browser/env
      const scripts = Array.from(fragment.querySelectorAll('script'));
      
      // Append non-script elements first
      const nonScripts = Array.from(fragment.childNodes).filter(node => node.nodeName !== 'SCRIPT');
      nonScripts.forEach(node => container.appendChild(node.cloneNode(true)));

      // Execute scripts in order
      scripts.forEach(oldScript => {
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        if (oldScript.innerHTML) {
          newScript.innerHTML = oldScript.innerHTML;
        }
        container.appendChild(newScript);
      });
    }
  }, [adConfig]);

  if (!adConfig.active) return null;

  const deviceClass = type.startsWith('mobile') ? 'md:hidden' : (['leaderboard', 'skyscraper', 'tenancy-rectangle'].includes(type) ? 'hidden md:flex' : '');

  // Render injected code container
  if (adConfig.code && adConfig.code.trim().length > 0) {
    return (
      <div 
        ref={containerRef}
        className={`${className} ${deviceClass} flex justify-center items-center overflow-hidden min-h-[60px]`}
        id={id}
      />
    );
  }

  // Fallback Professional Placeholders
  const getDimensions = () => {
    switch (type) {
      case 'leaderboard': return 'h-24 w-full max-w-4xl mx-auto';
      case 'mobile-leaderboard': return 'h-20 w-full';
      case 'sidebar': return 'h-64 w-full';
      case 'tenancy-rectangle': 
      case 'mobile-tenancy': return 'h-80 w-full border-red-500 border-2';
      case 'anchor':
      case 'mobile-anchor': return 'h-16 w-full fixed bottom-0 left-0 z-50 shadow-2xl';
      case 'skyscraper': return 'h-[600px] w-full max-w-[300px]';
      case 'in-text':
      case 'mobile-in-text': return 'h-48 w-full my-6';
      case 'inter-article':
      case 'mobile-inter-article': return 'h-40 w-full my-10 bg-gray-100';
      case 'in-stream-video':
      case 'mobile-in-stream': return 'aspect-video w-full bg-black flex items-center justify-center';
      case 'interstitial': return 'fixed inset-0 bg-black/80 z-[100] flex items-center justify-center';
      case 'sticky': return 'sticky top-24 h-64 w-full';
      case 'sponsorship-badge': return 'h-8 w-24 border border-gray-200';
      default: return 'h-20 w-full';
    }
  };

  const getLabel = () => type.replace(/-/g, ' ').toUpperCase();

  if (type === 'interstitial') {
    return (
      <div className={`${getDimensions()} ${className}`} id={id}>
         <div className="bg-white p-8 relative max-w-lg w-full text-center shadow-2xl rounded-lg border-4 border-black">
            <button className="absolute -top-4 -right-4 bg-red-600 text-white w-10 h-10 rounded-full font-black text-xl flex items-center justify-center shadow-lg" onClick={() => {
              const el = document.getElementById(id || '');
              if (el) el.style.display = 'none';
            }}>×</button>
            <div className="ad-placeholder h-64 w-full mb-4 bg-gray-50 flex flex-col items-center justify-center">
              <span className="text-4xl opacity-10 font-black">AD</span>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mt-2">Interstitial Placement</p>
            </div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sponsored Content</p>
         </div>
      </div>
    );
  }

  return (
    <div className={`ad-placeholder ${getDimensions()} ${className} ${deviceClass}`}>
      <span className="text-[9px] font-black opacity-30 tracking-widest leading-none text-center px-2">{getLabel()}</span>
    </div>
  );
};

export default AdZone;
