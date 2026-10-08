import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SocialRail } from './components/SocialRail';
import { Cursor } from './components/Cursor';
import { LoadingScreen } from './components/LoadingScreen';
import { Home } from './pages/Home';
import { MyWorks } from './pages/MyWorks';
import { Play } from './pages/Play';

export const App = () => {
  const [isLoading, setIsLoading] = useState(() => window.innerWidth > 768);

  React.useEffect(() => {
    if (isLoading) {
      document.body.classList.add('loading-active');
    } else {
      document.body.classList.remove('loading-active');
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onComplete={() => {
            document.body.classList.remove('loading-active');
            setIsLoading(false);
          }}
        />
      )}
      <Cursor />
      <Navbar />
      <SocialRail />

      <main className="main-body">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myworks" element={<MyWorks />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
