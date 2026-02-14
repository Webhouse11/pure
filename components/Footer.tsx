
import React from 'react';
import { Link } from 'react-router-dom';
import { SITE_NAME, CATEGORIES } from '../constants';
import AdZone from './AdZone';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-12 py-12 px-4 md:px-8">
      {/* WELL-PLACED FOOTER AD */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-center">
        <AdZone type="inter-article" className="w-full max-w-4xl" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">{SITE_NAME}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Trusted insights, workouts, nutrition, and wellness tips to help you live a healthier, stronger, and more active life.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase border-b-2 border-red-600 inline-block mb-4">Categories</h3>
          <ul className="text-sm space-y-2 text-gray-600 font-medium">
            {CATEGORIES.map(cat => (
              <li key={cat}><Link to={`/category/${cat.toLowerCase().replace(' ', '-')}`} className="hover:text-red-600">{cat}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase border-b-2 border-red-600 inline-block mb-4">Quick Links</h3>
          <ul className="text-sm space-y-2 text-gray-600 font-medium">
            <li><Link to="/about" className="hover:text-red-600">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-red-600">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-red-600">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-red-600">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase border-b-2 border-red-600 inline-block mb-4">Newsletter</h3>
          <p className="text-xs text-gray-500 mb-4">Get the latest health tips delivered to your inbox.</p>
          <div className="flex">
            <input type="email" placeholder="Email Address" className="bg-white border border-gray-300 px-3 py-2 text-sm w-full focus:outline-none focus:border-red-600" />
            <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 transition">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 text-center text-xs text-gray-500 font-medium">
        &copy; {new Date().getFullYear()} {SITE_NAME}. All Rights Reserved. Designed for performance and health.
      </div>
    </footer>
  );
};

export default Footer;
