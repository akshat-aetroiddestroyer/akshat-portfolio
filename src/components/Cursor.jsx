import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const Cursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    let isIconHovered = false;
    const el = cursorRef.current;
    if (!el) return;

    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const curPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (e) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let rafId;
    const renderLoop = () => {
      if (!isIconHovered) {
        const ease = 6;
        curPos.x += (mousePos.x - curPos.x) / ease;
        curPos.y += (mousePos.y - curPos.y) / ease;
        gsap.to(el, { x: curPos.x, y: curPos.y, duration: 0.1, ease: 'none' });
      }
      rafId = requestAnimationFrame(renderLoop);
    };
    rafId = requestAnimationFrame(renderLoop);

    const bindCursorHoverElements = () => {
      document.querySelectorAll('[data-cursor]').forEach((target) => {
        const handleOver = (e) => {
          const type = target.getAttribute('data-cursor');
          if (type === 'icons') {
            const rect = e.currentTarget.getBoundingClientRect();
            el.classList.add('cursor-icons');
            gsap.to(el, { x: rect.left, y: rect.top, duration: 0.1 });
            el.style.setProperty('--cursorH', `${rect.height}px`);
            isIconHovered = true;
          } else if (type === 'disable') {
            el.classList.add('cursor-disable');
          }
        };

        const handleOut = () => {
          el.classList.remove('cursor-disable', 'cursor-icons');
          isIconHovered = false;
        };

        target.addEventListener('mouseenter', handleOver);
        target.addEventListener('mouseleave', handleOut);
      });
    };

    bindCursorHoverElements();
    const interval = setInterval(bindCursorHoverElements, 1000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      clearInterval(interval);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} />;
};
