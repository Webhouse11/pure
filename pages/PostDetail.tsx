
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { INITIAL_POSTS, SITE_NAME } from '../constants';
import AdZone from '../components/AdZone';
import { BlogPost } from '../types';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);

  useEffect(() => {
    const saved = localStorage.getItem('purelife_posts');
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = post.seoTitle;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-20 text-center">
        <h1 className="text-6xl font-black mb-4 tracking-tighter">404</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest mb-10 text-xs">Story Not Found in Archives</p>
        <Link to="/" className="bg-black text-white px-12 py-4 font-black uppercase tracking-widest text-xs hover:bg-red-600 transition">Return to Home</Link>
      </div>
    );
  }

  const related = posts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <article className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
        <div className="lg:col-span-8">
          <header className="mb-14">
            <div className="flex justify-between items-center mb-10">
              <Link to={`/category/${post.category.toLowerCase().replace(' ', '-')}`} className="bg-red-600 text-white font-black uppercase text-[10px] px-6 py-2 tracking-[0.3em] shadow-lg">
                {post.category}
              </Link>
              <AdZone type="sponsorship-badge" />
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black leading-[0.95] mb-12 tracking-tighter uppercase border-b-8 border-black pb-12 font-serif">
              {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 pb-10">
              <span className="text-black bg-gray-50 px-4 py-2">BY {post.author}</span>
              <span>FILED: {new Date(post.datePublished).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="md:ml-auto text-red-600">Exclusive Report</span>
            </div>
          </header>

          <AdZone type="leaderboard" className="mb-14" />
          <AdZone type="mobile-leaderboard" className="mb-10" />

          {post.image && (
            <div className="relative group overflow-hidden mb-14 shadow-2xl border-4 border-black">
              <img src={post.image} alt={post.imageAlt} className="w-full h-auto object-cover transition duration-1000 group-hover:scale-105" />
              {post.showBranding !== false && (
                <div className="absolute bottom-0 left-0 bg-black text-white text-[9px] p-4 font-black uppercase tracking-[0.4em] italic">
                  PureLife Digital &bull; Exclusive Media
                </div>
              )}
            </div>
          )}

          <AdZone type="in-stream-video" className="mb-14" />
          <AdZone type="mobile-in-stream" className="mb-10" />

          <div 
            className="prose prose-xl max-w-none text-gray-900 leading-relaxed font-serif 
              prose-headings:font-sans prose-headings:font-black prose-headings:uppercase 
              prose-headings:tracking-tighter prose-a:text-red-600 prose-a:font-black
              prose-p:mb-8 prose-li:marker:text-red-600 prose-img:border-4 prose-img:border-black"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <AdZone type="in-text" className="my-14" />
          <AdZone type="mobile-in-text" className="my-10" />

          <div className="mt-20 p-12 bg-black text-white flex flex-col md:flex-row items-center gap-12 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]">
             <div className="w-40 h-40 bg-red-600 border-4 border-white flex items-center justify-center text-white text-8xl font-black shrink-0">
               {post.author[0]}
             </div>
             <div>
               <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">About {post.author}</h3>
               <p className="text-sm text-gray-400 leading-relaxed font-bold italic">
                 {post.author} is a lead investigative journalist at {SITE_NAME}, specializing in evidence-based performance architecture and human longevity.
               </p>
             </div>
          </div>

          <div className="mt-24 pt-12 border-t-8 border-gray-100">
            <h3 className="text-[10px] font-black uppercase mb-10 tracking-[0.5em] text-gray-200">Syndicate This Story</h3>
            <div className="flex flex-wrap gap-6">
              <button className="bg-[#1877F2] text-white px-10 py-4 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition">Facebook</button>
              <button className="bg-black text-white px-10 py-4 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition">X / Twitter</button>
              <button className="bg-[#25D366] text-white px-10 py-4 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition">WhatsApp</button>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-32">
               <div className="border-b-8 border-black mb-16">
                  <h3 className="bg-black text-white px-10 py-3 text-sm font-black uppercase tracking-widest inline-block">More Investigation</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {related.map(r => (
                    <Link key={r.id} to={`/post/${r.slug}`} className="group block">
                      {r.image && (
                        <div className="overflow-hidden mb-6 shadow-xl border-t-4 border-red-600">
                          <img src={r.image} className="w-full h-48 object-cover transition duration-500 group-hover:scale-110" alt={r.imageAlt} />
                        </div>
                      )}
                      <h4 className="font-black text-xl group-hover:text-red-600 transition leading-tight mb-4 uppercase tracking-tighter">{r.title}</h4>
                    </Link>
                  ))}
               </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-4">
           <div className="sticky top-28 space-y-16">
              <AdZone type="sidebar" />
              
              <div className="bg-white border-8 border-black p-10 shadow-[12px_12px_0px_0px_rgba(220,38,38,1)]">
                <h3 className="text-4xl font-black uppercase mb-8 tracking-tighter leading-none border-b-4 border-red-600 pb-4 font-serif">Vital Feed</h3>
                <p className="text-sm font-bold text-gray-400 mb-10 leading-relaxed italic">The most critical wellness alerts delivered daily.</p>
                <input type="email" placeholder="SECURE EMAIL" className="w-full border-4 border-gray-100 p-5 mb-6 focus:outline-none focus:border-red-600 font-black text-xs uppercase" />
                <button className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] hover:bg-red-600 transition text-xs shadow-xl">Join Syndicate</button>
              </div>

              <AdZone type="sticky" />
              <AdZone type="skyscraper" />
           </div>
        </aside>
      </div>
      
      <AdZone type="anchor" />
      <AdZone type="mobile-anchor" />

      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.image,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": SITE_NAME
            },
            "datePublished": post.datePublished,
            "dateModified": post.dateModified
          })
        }}
      />
    </article>
  );
};

export default PostDetail;
