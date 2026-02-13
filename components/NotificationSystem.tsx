
import React, { useState, useEffect } from 'react';
import { Bell, X, Check, zap } from 'lucide-react';

const NotificationSystem: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [showNewPostAlert, setShowNewPostAlert] = useState(false);
  const [notifStatus, setNotifStatus] = useState<string | null>(localStorage.getItem('purelife_notif_status'));

  useEffect(() => {
    // Show enrollment prompt for new users after a short delay
    if (!notifStatus) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifStatus]);

  useEffect(() => {
    // Logic to check for new posts since last visit
    const checkNewPosts = () => {
      const lastSeen = localStorage.getItem('purelife_last_seen_post_time') || '0';
      const lastPublished = localStorage.getItem('purelife_last_published_time') || '0';
      
      if (notifStatus === 'enabled' && Number(lastPublished) > Number(lastSeen)) {
        setShowNewPostAlert(true);
      }
    };

    checkNewPosts();
    window.addEventListener('posts-updated', checkNewPosts);
    return () => window.removeEventListener('posts-updated', checkNewPosts);
  }, [notifStatus]);

  const handleEnable = () => {
    localStorage.setItem('purelife_notif_status', 'enabled');
    setNotifStatus('enabled');
    setShowPrompt(false);
    // Set current time as 'seen' so they don't get alerted for old posts immediately
    localStorage.setItem('purelife_last_seen_post_time', Date.now().toString());
  };

  const handleIgnore = () => {
    localStorage.setItem('purelife_notif_status', 'ignored');
    setNotifStatus('ignored');
    setShowPrompt(false);
  };

  const markAsRead = () => {
    localStorage.setItem('purelife_last_seen_post_time', Date.now().toString());
    setShowNewPostAlert(false);
  };

  return (
    <>
      {/* 1. Enrollment Prompt */}
      {showPrompt && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-500 max-w-sm w-full">
          <div className="bg-black text-white p-6 border-t-4 border-red-600 shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)] relative">
            <button onClick={handleIgnore} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
              <X size={20} />
            </button>
            <div className="flex items-start gap-4">
              <div className="bg-red-600 p-3 rounded-full animate-pulse">
                <Bell size={24} className="text-white" />
              </div>
              <div className="pr-6">
                <h3 className="text-lg font-black uppercase tracking-tighter mb-2 italic">Stay Optimized</h3>
                <p className="text-xs text-gray-400 font-bold leading-relaxed mb-6 uppercase tracking-widest">
                  Enable PureLife Alerts to get instant dossiers when new fitness intelligence is published.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={handleEnable}
                    className="flex-1 bg-red-600 text-white py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition shadow-lg"
                  >
                    Enable Alerts
                  </button>
                  <button 
                    onClick={handleIgnore}
                    className="flex-1 border border-gray-700 text-gray-400 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:border-white hover:text-white transition"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. New Post Alert (Toast) */}
      {showNewPostAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-500 w-full max-w-xl px-4">
          <div className="bg-white border-4 border-black p-4 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-black text-white p-2">
                <Bell size={18} className="animate-bounce" />
              </div>
              <div>
                <span className="block text-[10px] font-black text-red-600 uppercase tracking-widest leading-none mb-1">Breaking News</span>
                <p className="text-sm font-black uppercase tracking-tighter text-black">New Fitness Intel has been deployed!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  markAsRead();
                  window.location.hash = '/'; // Go to home to see new post
                }}
                className="bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition"
              >
                Read Now
              </button>
              <button onClick={markAsRead} className="p-2 text-gray-300 hover:text-black transition">
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationSystem;
