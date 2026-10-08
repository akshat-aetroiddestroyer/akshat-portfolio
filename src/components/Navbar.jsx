import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { config } from '../config/config';

export const HoverLink = ({ text, cursor }) => (
  <div className="hover-link" data-cursor={!cursor ? 'disable' : undefined}>
    <div className="hover-in">
      {text}
      <div>{text}</div>
    </div>
  </div>
);

let lenisInstance = null;

export const getLenis = () => lenisInstance;

export const Navbar = () => {
  useEffect(() => {
    // Initialize Lenis smooth scrolling with the reference's exact parameters
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Nav anchor click smooth scroll
    const navAnchors = document.querySelectorAll('.header ul a');
    navAnchors.forEach((a) => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('data-href');
        if (targetId) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            lenis.scrollTo(targetEl, { offset: 0, duration: 1.5 });
          }
        }
      });
    });

    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AB
        </a>
        <a
          href={`mailto:${config.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {config.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLink text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLink text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLink text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};
