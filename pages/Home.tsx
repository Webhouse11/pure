import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { INITIAL_POSTS, SITE_NAME } from '../constants';
import AdZone from '../components/AdZone';
import { BlogPost } from '../types';

const Home: React.FC = () => {
  const { cat } = useParams<{ cat?: string }>();
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);

  useEffect(() => {
    const saved = localStorage.getItem('purelife_posts');
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  // Filter posts based on category if the 'cat' param exists
  const filteredPosts = cat 
    ? posts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === cat)
    : posts;

  const featured = filteredPosts[0] || INITIAL_POSTS[0];
  const secondary = filteredPosts.slice(1, 3);
  const remaining = filteredPosts.slice(3);

  const EFFECTIVE_GATE_URL = 'https://www.effectivegatecpm.com/edkt1inp?key=4aa7192095de41a6bbd9d9212638587f';

  const categoryTitle = cat 
    ? cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Top Intelligence';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      {/* Dynamic Header for Categories */}
      {cat && (
        <div className="mb-10 border-b-4 border-black pb-4">
          <h2 className="text-sm font-black uppercase tracking-[0.5em] text-red-600 mb-2">Category Archive</h2>
          <h1 className="text-5xl font-black uppercase tracking-tighter">{categoryTitle}</h1>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="mb-14">
            <Link to={`/post/${featured.slug}`} className="group">
              <div className="relative overflow-hidden mb-8 shadow-2xl border-b-8 border-red-600">
                <img src={featured.image} alt={featured.imageAlt} className="w-full h-[500px] object-cover transition duration-1000 group-hover:scale-105" />
                <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-5 py-2 uppercase tracking-[0.3em]">
                  {featured.category}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.0] group-hover:text-red-600 transition tracking-tighter uppercase">
                {featured.title}
              </h1>
              <p className="text-gray-500 text-xl mb-8 leading-relaxed line-clamp-2 italic font-serif">
                {featured.excerpt}
              </p>
              <div className="text-[10px] uppercase font-black text-gray-400 tracking-[0.4em] border-t-2 border-gray-100 pt-8 flex justify-between items-center">
                <span>By {featured.author} &bull; {new Date(featured.datePublished).toLocaleDateString()}</span>
                <span className="text-red-600">Premium Analysis</span>
              </div>
            </Link>
          </div>

          {/* WELL-PLACED CONTENT AD SLOTS */}
          <div className="mb-14 p-4 bg-gray-50 border-y border-gray-100 flex justify-center">
            <AdZone type="in-text" />
          </div>

          <AdZone type="tenancy-rectangle" className="mb-14" />
          <AdZone type="mobile-tenancy" className="mb-10" />

          {secondary.length > 0 && (
            <>
              <div className="border-b-8 border-black mb-12">
                <h2 className="bg-black text-white px-10 py-3 text-sm font-black uppercase tracking-widest inline-block">Flash Reports</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
                {secondary.map(post => (
                  <Link key={post.id} to={`/post/${post.slug}`} className="group block">
                    <div className="overflow-hidden mb-6 shadow-xl border-t-4 border-black">
                       <img src={post.image} alt={post.imageAlt} className="w-full h-60 object-cover transition duration-700 group-hover:scale-110" />
                    </div>
                    <h3 className="text-2xl font-black mb-4 group-hover:text-red-600 transition leading-tight uppercase tracking-tighter">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed italic">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          <AdZone type="inter-article" />
          <AdZone type="mobile-inter-article" />

          <div className="space-y-16 mt-16">
             {remaining.length > 0 ? remaining.map(post => (
               <div key={post.id} className="flex flex-col md:flex-row gap-10 border-b-2 border-gray-50 pb-16 group">
                  <div className="w-full md:w-72 h-48 overflow-hidden shadow-lg border-2 border-black shrink-0">
                    <img src={post.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt={post.imageAlt} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-red-600 font-black text-[10px] uppercase tracking-[0.3em] mb-3 block">{post.category}</span>
                    <Link to={`/post/${post.slug}`} className="text-3xl font-black mb-4 block group-hover:text-red-600 transition tracking-tighter uppercase leading-none">{post.title}</Link>
                    <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-medium">{post.excerpt}</p>
                  </div>
               </div>
             )) : (
               <div className="py-20 text-center">
                 <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No additional stories in this section.</p>
               </div>
             )}
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-12">
            <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase border-b-4 border-red-600 inline-block mb-10 tracking-tighter">Vital Metrics</h3>
              <div className="space-y-10">
                {posts.slice(0, 5).map((post, i) => (
                  <Link key={post.id} to={`/post/${post.slug}`} className="flex gap-5 group items-start">
                    <span className="text-6xl font-black text-gray-100 group-hover:text-red-600 leading-none transition italic">{i + 1}</span>
                    <div className="pt-1">
                      <h4 className="text-sm font-black leading-tight uppercase tracking-tighter hover:text-red-600 transition">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* SIDEBAR AD GRID */}
            <AdZone type="sidebar" />
            
            <div className="bg-black text-white p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-20"></div>
              <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter leading-none relative z-10">The Active Protocol</h3>
              <p className="text-sm text-gray-400 mb-10 font-bold relative z-10 italic">Elite conditioning strategies for the top 1%.</p>
              <a 
                href={EFFECTIVE_GATE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-red-600 text-white py-5 text-center text-[10px] font-black uppercase hover:bg-white hover:text-black transition tracking-[0.3em] relative z-10"
              >
                Get Access
              </a>
            </div>

            <AdZone type="sticky" />
            <AdZone type="skyscraper" />
          </div>
        </aside>
      </div>

      {/* GLOBAL PITCH ADS */}
      <AdZone type="anchor" />
      <AdZone type="mobile-anchor" />
      
      {/* Invisible High-Yield Listeners */}
      <AdZone type="direct-link" />
      <AdZone type="pop-under" />
    </div>
  );
};

export default Home;