
import React, { useState } from 'react';
import { Menu, Search, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES, SITE_NAME } from '../constants';
import AdZone from './AdZone';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
      {/* Top Bar */}
      <div className="bg-black text-white text-[10px] py-1 px-4 flex justify-between items-center uppercase tracking-widest font-bold">
        <div>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</div>
        <div className="flex gap-4">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-red-500 transition"><User size={10} /> Editor Login</Link>
        </div>
      </div>

      {/* Main Logo & Ad Area */}
      <div className="py-4 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black border-b-4 border-red-600 mb-1 leading-none">
            {SITE_NAME}
          </Link>
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black">Elite Health Intelligence Syndicate</p>
        </div>

        {/* Well-Placed Header Ad */}
        <div className="hidden md:block">
          <AdZone type="leaderboard" className="min-w-[468px]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-b border-gray-200 py-3 px-4 hidden md:block">
        <ul className="flex justify-center items-center gap-8 uppercase text-xs font-bold tracking-tight">
          <li><Link to="/" className="hover:text-red-600 transition">Home</Link></li>
          {CATEGORIES.map(cat => (
            <li key={cat}>
              <Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="hover:text-red-600 transition">{cat}</Link>
            </li>
          ))}
          <li className="flex items-center"><Search size={14} className="cursor-pointer hover:text-red-600" /></li>
        </ul>
      </nav>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 border-t border-gray-100">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <AdZone type="mobile-leaderboard" />
        <Search size={20} />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full z-50 shadow-2xl">
          <ul className="flex flex-col p-4 gap-4 font-bold uppercase text-sm">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            {CATEGORIES.map(cat => (
              <li key={cat}>
                <Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} onClick={() => setIsMenuOpen(false)}>{cat}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
