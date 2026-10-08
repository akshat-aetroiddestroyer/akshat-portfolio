import React, { useState, useEffect } from 'react';

export const LoadingScreen = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoaderOut, setIsLoaderOut] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < 100) {
        current += Math.floor(Math.random() * 8) + 2;
        if (current > 100) current = 100;
        setPercent(current);
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      const t1 = setTimeout(() => {
        setIsComplete(true);
        const t2 = setTimeout(() => {
          setIsClicked(true);
          setIsLoaderOut(true);
          setIsFadingOut(true);
          // Dispatch hero entrance start event right as the loading screen dissolves
          document.body.classList.remove('loading-active');
          window.dispatchEvent(new CustomEvent('hero-intro-start'));
          const t3 = setTimeout(() => {
            if (onComplete) onComplete();
          }, 800);
          return () => clearTimeout(t3);
        }, 900);
        return () => clearTimeout(t2);
      }, 400);

      return () => clearTimeout(t1);
    }
  }, [percent, onComplete]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleClick = () => {
    if (!isComplete) {
      setPercent(100);
    }
  };

  return (
    <>
      <div className={`loading-header ${isFadingOut ? 'loader-out' : ''}`}>
        <a href="/#" className="loader-title" data-cursor="disable">
          AkshatBalothiya
        </a>
        <div className={`loaderGame ${isLoaderOut ? 'loader-out' : ''}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, i) => (
                <div key={i} className="loaderGame-line" />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      <div className={`loading-screen ${isFadingOut ? 'loading-screen-out' : ''}`}>
        {/* Layer 1: Oversized Role Typography continuously traveling horizontally behind the pill */}
        <div className="loading-moving-text-layer">
          {/* Row 1 moving Right */}
          <div className="loading-moving-row loading-moving-row-right">
            {[...Array(3)].map((_, idx) => (
              <React.Fragment key={`r1-${idx}`}>
                <span className="loading-text-item">
                  AI ML ENGINEER <span className="loading-text-dot" />
                </span>
                <span className="loading-text-item">
                  FULL-STACK DEVELOPER <span className="loading-text-dot" />
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Row 2 moving Left */}
          <div className="loading-moving-row loading-moving-row-left">
            {[...Array(3)].map((_, idx) => (
              <React.Fragment key={`r2-${idx}`}>
                <span className="loading-text-item">
                  PYTHON DEVELOPER <span className="loading-text-dot" />
                </span>
                <span className="loading-text-item">
                  MACHINE LEARNING <span className="loading-text-dot" />
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Layer 2: Foreground Centered Interactive Loading Pill */}
        <div
          className={`loading-wrap ${isClicked ? 'loading-clicked' : ''}`}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        >
          <div className="loading-hover" />
          <div className={`loading-button ${isComplete ? 'loading-complete' : ''}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>WELCOME</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
