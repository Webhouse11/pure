import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import NotificationSystem from './components/NotificationSystem';
import AdZone from './components/AdZone';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NotificationSystem />
        
        {/* Universal High-Yield Functional Ad Slots */}
        <AdZone type="pop-under" />
        <AdZone type="direct-link" />
        
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category/:cat" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;