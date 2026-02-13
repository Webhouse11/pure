
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_POSTS, CATEGORIES } from '../constants';
import { BlogPost, AdPlacement, AdSettings } from '../types';
import { Plus, Edit, Trash, LayoutDashboard, Save, X, Megaphone, FileText, Smartphone, Monitor, Image as ImageIcon, ExternalLink, RefreshCw, Upload, EyeOff, Eye } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<'articles' | 'ads'>('articles');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Advanced Ad State
  const [adSettings, setAdSettings] = useState<AdSettings>(() => {
    const saved = localStorage.getItem('purelife_ads');
    if (saved) return JSON.parse(saved);
    const defaults: any = {};
    const placements: AdPlacement[] = [
      'leaderboard', 'anchor', 'sidebar', 'in-text', 'sticky', 'inter-article', 
      'skyscraper', 'mobile-leaderboard', 'mobile-tenancy', 'mobile-in-text', 
      'mobile-anchor', 'mobile-inter-article', 'mobile-in-stream', 
      'tenancy-rectangle', 'interstitial', 'in-stream-video', 'sponsorship-badge'
    ];
    placements.forEach(p => defaults[p] = { active: true, code: '' });
    return defaults;
  });

  const [editingAdKey, setEditingAdKey] = useState<AdPlacement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('purelife_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      setPosts(INITIAL_POSTS);
      localStorage.setItem('purelife_posts', JSON.stringify(INITIAL_POSTS));
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('purelife_posts', JSON.stringify(newPosts));
    
    // Trigger notification timestamp for readers
    localStorage.setItem('purelife_last_published_time', Date.now().toString());
    
    // Global broadcast
    window.dispatchEvent(new Event('posts-updated'));
  };

  const saveAds = (newAds: AdSettings) => {
    setAdSettings(newAds);
    localStorage.setItem('purelife_ads', JSON.stringify(newAds));
    window.dispatchEvent(new Event('ads-updated'));
  };

  const toggleAdSlot = (key: AdPlacement) => {
    const newAds = { ...adSettings };
    newAds[key] = { ...newAds[key], active: !newAds[key].active };
    saveAds(newAds);
  };

  const updateAdTag = (key: AdPlacement, code: string) => {
    const newAds = { ...adSettings };
    newAds[key] = { ...newAds[key], code };
    saveAds(newAds);
    setEditingAdKey(null);
  };

  const handleDeleteArticle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Permanently delete this article from the database?')) {
      const filtered = posts.filter(p => p.id !== id);
      savePosts(filtered);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    
    const index = posts.findIndex(p => p.id === editingPost.id);
    const updated = [...posts];
    
    if (index > -1) {
      updated[index] = { ...editingPost, dateModified: new Date().toISOString() };
    } else {
      updated.unshift({ ...editingPost, datePublished: new Date().toISOString(), dateModified: new Date().toISOString() });
    }
    
    savePosts(updated);
    setEditingPost(null);
    alert('Changes Deployed & Subscribers Notified!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPost) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPost({ ...editingPost, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const createNewArticle = () => {
    const newId = `post-${Math.random().toString(36).substr(2, 9)}`;
    setEditingPost({
      id: newId,
      slug: `new-fitness-guide-${newId}`,
      title: 'New Fitness Intelligence Report',
      excerpt: 'A brief summary that appears on the homepage news grid...',
      content: '<h2>Main Heading</h2><p>Write your fitness content here.</p>',
      category: 'Home Workouts',
      author: 'PureLife Editorial',
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
      imageAlt: 'Fitness photography',
      seoTitle: 'SEO Optimized Title',
      metaDescription: 'Meta Description for Google.',
      keywords: ['fitness', 'wellness'],
      showBranding: true
    });
  };

  const adPlacements: { key: AdPlacement; label: string; device: 'desktop' | 'mobile' | 'both' }[] = [
    { key: 'leaderboard', label: 'Leaderboard (Top)', device: 'desktop' },
    { key: 'mobile-leaderboard', label: 'Mobile Leaderboard', device: 'mobile' },
    { key: 'anchor', label: 'Anchor (Bottom Pinned)', device: 'desktop' },
    { key: 'mobile-anchor', label: 'Mobile Anchor Pinned', device: 'mobile' },
    { key: 'tenancy-rectangle', label: 'Tenancy Rectangle', device: 'desktop' },
    { key: 'mobile-tenancy', label: 'Mobile Tenancy Rect', device: 'mobile' },
    { key: 'sidebar', label: 'Medium Rectangle (Side)', device: 'both' },
    { key: 'skyscraper', label: 'Skyscraper (Tall Side)', device: 'desktop' },
    { key: 'in-text', label: 'In-Text Banner', device: 'desktop' },
    { key: 'mobile-in-text', label: 'Mobile In-Text', device: 'mobile' },
    { key: 'inter-article', label: 'Inter-Article Strip', device: 'desktop' },
    { key: 'mobile-inter-article', label: 'Mobile Inter-Article', device: 'mobile' },
    { key: 'in-stream-video', label: 'In-Stream Video Player', device: 'desktop' },
    { key: 'mobile-in-stream', label: 'Mobile In-Stream Video', device: 'mobile' },
    { key: 'interstitial', label: 'Interstitial Overlay', device: 'both' },
    { key: 'sticky', label: 'Sticky Scroll Banner', device: 'desktop' },
    { key: 'sponsorship-badge', label: 'Sponsorship Badge', device: 'both' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen font-sans">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-6">
          <div className="bg-red-600 p-4 text-white shadow-xl">
            <LayoutDashboard size={44} />
          </div>
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-black leading-none mb-2">PureLife CMS</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Professional Multi-Channel Controller</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-sm w-full lg:w-auto">
          <button 
            onClick={() => {setActiveTab('articles'); setEditingPost(null);}}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-4 font-black text-xs uppercase transition-all ${activeTab === 'articles' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
          >
            <FileText size={18} /> Article Studio
          </button>
          <button 
            onClick={() => {setActiveTab('ads'); setEditingPost(null);}}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-3 px-10 py-4 font-black text-xs uppercase transition-all ${activeTab === 'ads' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
          >
            <Megaphone size={18} /> Ad Revenue
          </button>
        </div>
      </div>

      {activeTab === 'articles' && !editingPost && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-8 border-red-600 pl-4">Article Archives</h2>
            <button 
              onClick={createNewArticle}
              className="bg-red-600 text-white px-10 py-5 font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 hover:bg-black transition shadow-2xl"
            >
              <Plus size={20} /> Deploy New Story
            </button>
          </div>
          
          <div className="bg-white border-4 border-black overflow-hidden shadow-2xl">
            <div className="bg-black p-5 grid grid-cols-12 text-[11px] font-black uppercase tracking-widest text-white border-b-2 border-red-600">
              <div className="col-span-1">Media</div>
              <div className="col-span-6">Headline & Status</div>
              <div className="col-span-2 text-center">Published</div>
              <div className="col-span-3 text-right pr-4">Commands</div>
            </div>
            <div className="divide-y-4 divide-gray-50">
              {posts.map(post => (
                <div 
                  key={post.id} 
                  className="p-6 grid grid-cols-12 items-center hover:bg-red-50 cursor-pointer transition-colors group"
                  onClick={() => setEditingPost({ ...post })}
                >
                  <div className="col-span-1">
                    {post.image ? (
                      <img src={post.image} className="w-16 h-16 object-cover border-2 border-black" alt="" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center text-[8px] font-black text-gray-400">NO MEDIA</div>
                    )}
                  </div>
                  <div className="col-span-6 px-6">
                    <div className="font-black text-xl mb-1 group-hover:text-red-600 transition-colors leading-none uppercase tracking-tighter truncate">{post.title}</div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span className="text-red-600 bg-red-50 px-2 py-0.5">{post.category}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-[10px] font-black text-gray-400 uppercase">
                    {new Date(post.datePublished).toLocaleDateString()}
                  </div>
                  <div className="col-span-3 flex justify-end gap-4 pr-2">
                    <button className="bg-black text-white p-4 hover:bg-red-600 transition-colors"><Edit size={20} /></button>
                    <button onClick={(e) => handleDeleteArticle(e, post.id)} className="bg-gray-100 text-red-600 p-4 hover:bg-red-600 hover:text-white transition-colors border-2 border-black"><Trash size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <form onSubmit={handleSaveEdit} className="bg-white border-4 border-black shadow-2xl animate-in zoom-in-95 duration-300 pb-10">
          <div className="bg-black p-8 flex justify-between items-center text-white border-b-4 border-red-600">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em]">Story Editor Suite</h2>
            <button type="button" onClick={() => setEditingPost(null)} className="hover:text-red-600 transition-transform hover:rotate-90"><X size={40} /></button>
          </div>
          
          <div className="p-10 lg:p-16 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Headline</label>
                <input 
                  type="text" 
                  value={editingPost.title}
                  onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                  className="w-full border-4 border-gray-100 p-6 focus:border-red-600 focus:outline-none font-black text-3xl uppercase tracking-tighter" 
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Section</label>
                <select 
                  value={editingPost.category}
                  onChange={e => setEditingPost({...editingPost, category: e.target.value as any})}
                  className="w-full border-4 border-gray-100 p-6 focus:border-red-600 focus:outline-none font-black text-xl uppercase"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
              <div className="xl:col-span-8 space-y-4">
                <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Content (HTML)</label>
                <textarea 
                  value={editingPost.content}
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                  rows={20}
                  className="w-full border-4 border-gray-100 p-10 focus:border-red-600 focus:outline-none font-serif text-lg leading-relaxed shadow-inner bg-gray-50/50"
                />
              </div>

              <div className="xl:col-span-4 space-y-12">
                <div className="bg-gray-50 p-10 border-4 border-black relative">
                  <div className="absolute -top-4 -left-4 bg-red-600 text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest">Image Management</div>
                  
                  <div className="aspect-video bg-gray-200 border-4 border-black overflow-hidden mb-8 relative group shadow-xl flex items-center justify-center">
                    {editingPost.image ? (
                      <>
                        <img src={editingPost.image} className="w-full h-full object-cover" alt="Preview" />
                        {editingPost.showBranding && (
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[8px] p-2 font-black uppercase tracking-widest">
                            PureLife Digital
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 font-black uppercase text-xs">No Media Loaded</span>
                    )}
                  </div>

                  <div className="space-y-6">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                    />
                    
                    <div className="flex flex-col gap-4">
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-black text-white py-4 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 transition"
                      >
                        <Upload size={14} /> Upload New Image
                      </button>

                      <button 
                        type="button"
                        onClick={() => setEditingPost({...editingPost, image: ''})}
                        className="w-full border-2 border-black py-3 font-black uppercase text-[10px] tracking-widest text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        Remove Image Completely
                      </button>
                    </div>

                    <div className="border-t-2 border-gray-200 pt-6">
                      <button 
                        type="button"
                        onClick={() => setEditingPost({...editingPost, showBranding: !editingPost.showBranding})}
                        className={`w-full py-4 px-4 font-black uppercase text-[10px] tracking-widest border-2 border-black flex items-center justify-center gap-2 transition ${editingPost.showBranding ? 'bg-black text-white' : 'bg-white text-black'}`}
                      >
                        {editingPost.showBranding ? <Eye size={14} /> : <EyeOff size={14} />}
                        {editingPost.showBranding ? 'Remove Company Branding' : 'Add Company Branding'}
                      </button>
                    </div>

                    <div>
                      <span className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Manual URL Edit</span>
                      <input 
                        type="text" 
                        value={editingPost.image} 
                        onChange={e => setEditingPost({...editingPost, image: e.target.value})} 
                        className="w-full bg-white border-4 border-gray-100 p-4 text-xs font-bold focus:border-black outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-black p-10 text-white shadow-2xl">
                  <label className="block text-[11px] font-black uppercase tracking-[0.4em] text-red-600 mb-8">SEO Intelligence</label>
                  <div className="space-y-6">
                    <input type="text" placeholder="SEO Title" value={editingPost.seoTitle} onChange={e => setEditingPost({...editingPost, seoTitle: e.target.value})} className="w-full bg-gray-900 border-b-2 border-gray-800 p-3 text-xs font-bold text-white focus:outline-none focus:border-red-600" />
                    <textarea placeholder="Meta Description" value={editingPost.metaDescription} onChange={e => setEditingPost({...editingPost, metaDescription: e.target.value})} rows={3} className="w-full bg-gray-900 border-b-2 border-gray-800 p-3 text-xs font-bold text-white focus:outline-none focus:border-red-600 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 p-12 flex justify-end gap-8 border-t-8 border-black">
            <button type="button" onClick={() => setEditingPost(null)} className="px-12 py-6 font-black uppercase text-[12px] tracking-[0.4em] text-gray-400 hover:text-black transition">Discard Changes</button>
            <button type="submit" className="bg-red-600 text-white px-24 py-6 font-black uppercase text-sm tracking-[0.4em] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-all">
              <Save size={20} className="inline mr-4" /> Save Article
            </button>
          </div>
        </form>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-16 animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
             <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 italic">Ad Inventory Controller</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {adPlacements.map((ad) => (
                  <div key={ad.key} className="bg-white border-4 border-black p-8 flex flex-col hover:shadow-2xl transition-all relative">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className={`text-sm font-black uppercase tracking-tighter ${ad.device === 'mobile' ? 'text-red-600' : 'text-black'}`}>{ad.label}</span>
                        <p className="text-[10px] text-gray-300 font-mono mt-1">{ad.key}</p>
                      </div>
                      <button 
                        onClick={() => toggleAdSlot(ad.key)}
                        className={`w-14 h-7 rounded-sm relative border-2 border-black ${adSettings[ad.key].active ? 'bg-green-500' : 'bg-gray-200'}`}
                      >
                        <div className={`w-5 h-5 bg-white absolute top-0.5 border border-black ${adSettings[ad.key].active ? 'right-0.5' : 'left-0.5'}`}></div>
                      </button>
                    </div>

                    {editingAdKey === ad.key ? (
                      <div className="space-y-4">
                        <textarea 
                          autoFocus
                          defaultValue={adSettings[ad.key].code}
                          id={`code-${ad.key}`}
                          className="w-full bg-black text-green-500 p-5 font-mono text-[11px] h-48 focus:outline-none border-2 border-red-600"
                        />
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`code-${ad.key}`) as HTMLTextAreaElement).value;
                            updateAdTag(ad.key, val);
                          }}
                          className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition"
                        >Commit Tag</button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setEditingAdKey(ad.key)}
                        className="w-full bg-white border-4 border-black py-4 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition shadow-xl"
                      >Edit Ad Code</button>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
