import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { config } from '../config/config';
import { Character3D } from '../components/Character3D';
import { InteractiveChess } from '../components/InteractiveChess';
import { getLenis } from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

// SVG Icons
const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" />
  </svg>
);

const CopyrightIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

// Strictly verified technologies from Akshat Balothiya's Resume
const techStackPyramid = [
  // Tier 1: Core Programming Languages
  [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://python.org' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', url: 'https://oracle.com/java' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', url: 'https://en.cppreference.com/w/c' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', url: 'https://developer.mozilla.org' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', url: 'https://typescriptlang.org' }
  ],
  // Tier 2: Frameworks & Web/Mobile Technologies
  [
    { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', url: 'https://reactnative.dev' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', url: 'https://react.dev' },
    { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg', url: 'https://fastapi.tiangolo.com' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', url: 'https://developer.mozilla.org' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', url: 'https://developer.mozilla.org' }
  ],
  // Tier 3: AI, Machine Learning & Deep Learning
  [
    { name: 'Machine Learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', url: 'https://github.com' },
    { name: 'Deep Learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', url: 'https://tensorflow.org' },
    { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', url: 'https://pytorch.org' },
    { name: 'Scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg', url: 'https://scikit-learn.org' },
    { name: 'AI Reasoning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg', url: 'https://groq.com' }
  ],
  // Tier 4: Core Fundamentals, Databases & Data Libraries
  [
    { name: 'DSA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg', url: 'https://github.com' },
    { name: 'OOP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-plain.svg', url: 'https://github.com' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', url: 'https://mysql.com' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', url: 'https://numpy.org' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', url: 'https://pandas.pydata.org' }
  ],
  // Tier 5: Version Control & Developer Environments
  [
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', url: 'https://git-scm.com' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', url: 'https://github.com' },
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', url: 'https://code.visualstudio.com' },
    { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', url: 'https://linux.org' }
  ]
];

const aboutLines = [
  "Results-driven B.Tech Engineering student specializing in AI, Machine Learning, and Python.",
  "Proven ability to design and ship intelligent systems and practical real-world applications.",
  "Hackathon & ideathon winner with a track record of rapid prototyping under pressure.",
  "Deep passion for machine learning, deep learning, LLMs, and data-driven problem solving.",
  "Eager to bring strong analytical thinking and a builder's mindset to high-growth tech teams.",
  "Engineering bold solutions where artificial intelligence is the canvas."
];

export const Home = () => {
  const [activeCard, setActiveCard] = useState(0);
  const whatCardRefs = useRef([]);

  useEffect(() => {
    // ================= 00. SEQUENTIAL HERO ENTRANCE CHOREOGRAPHY =================
    const isDesktop = window.innerWidth > 768;

    if (isDesktop) {
      // Set initial hidden, offset, blurred states
      gsap.set('.landing-intro-greeting', {
        opacity: 0,
        y: 35,
        filter: 'blur(5px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set('.landing-name-first', {
        opacity: 0,
        y: 55,
        filter: 'blur(6px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set('.landing-name-last', {
        opacity: 0,
        y: 55,
        filter: 'blur(6px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set('.landing-role-prefix', {
        opacity: 0,
        y: 25,
        filter: 'blur(4px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set('.landing-info-h2', {
        opacity: 0,
        y: 40,
        filter: 'blur(6px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set('.landing-h2-info', {
        opacity: 0,
        y: 45,
        filter: 'blur(6px)',
        clipPath: 'inset(0% 0% 100% 0%)'
      });
      gsap.set(['.header', '.icons-section', '.resume-button'], {
        opacity: 0
      });

      const playHeroEntrance = () => {
        const entranceTl = gsap.timeline();

        // STAGE 5: Left greeting begins ("Hello! I'm") at 0.70s
        entranceTl.to('.landing-intro-greeting', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.65,
          ease: 'power2.out'
        }, 0.70);

        // "AKSHAT" appears at 0.90s
        entranceTl.to('.landing-name-first', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.75,
          ease: 'power3.out'
        }, 0.90);

        // "BALOTHIYA" appears at 1.05s
        entranceTl.to('.landing-name-last', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.75,
          ease: 'power3.out'
        }, 1.05);

        // STAGE 6: Right role text begins ("An") at 1.20s
        entranceTl.to('.landing-role-prefix', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.55,
          ease: 'power2.out'
        }, 1.20);

        // "AI ENGINEER" appears at 1.35s
        entranceTl.to('.landing-info-h2', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.80,
          ease: 'power3.out'
        }, 1.35);

        // "PYTHON DEVELOPER" appears at 1.50s
        entranceTl.to('.landing-h2-info', {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.80,
          ease: 'power3.out'
        }, 1.50);

        // Surrounding UI (Header, SocialRail, Resume button) fades in smoothly at 1.60s
        entranceTl.to(['.header', '.icons-section', '.resume-button'], {
          opacity: 1,
          duration: 0.80,
          ease: 'power2.out'
        }, 1.60);
      };

      window.addEventListener('hero-intro-start', playHeroEntrance, { once: true });

      // Fallback timer: if hero-intro-start wasn't fired within 4s, reveal gracefully
      setTimeout(() => {
        gsap.to(['.landing-intro-greeting', '.landing-name-first', '.landing-name-last', '.landing-role-prefix', '.landing-info-h2', '.landing-h2-info', '.header', '.icons-section', '.resume-button'], {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.4
        });
      }, 4000);
    } else {
      gsap.set(['.landing-intro-greeting', '.landing-name-first', '.landing-name-last', '.landing-role-prefix', '.landing-info-h2', '.landing-h2-info', '.header', '.icons-section', '.resume-button'], {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        clipPath: 'inset(0% 0% 0% 0%)'
      });
    }

    // ================= MASTER SCROLL TIMELINE ARCHITECTURE =================

    // 1. HERO PINNED CINEMATIC TIMELINE (Scene 02)
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.landing-section',
        start: 'top top',
        end: '+=700',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        id: 'hero-pinned-master'
      }
    });

    heroTl
      .to('.landing-intro', { x: -80, y: -40, opacity: 0, duration: 0.4, ease: 'power1.out' }, 0)
      .to('.landing-info', { x: 80, opacity: 0, duration: 0.4, ease: 'power1.in' }, 0);

    // 2. ABOUT ME PINNED CINEMATIC TIMELINE (Scene 03)
    if (window.innerWidth > 1024) {
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top top',
          end: '+=1600',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          id: 'about-master-timeline'
        }
      });

      // 1. HUD elements and border reveal (0.00 -> 0.10)
      aboutTl
        .fromTo('.about-hud-corner-tl', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.08, ease: 'power2.out' }, 0)
        .fromTo('.about-hud-corner-tr', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.08, ease: 'power2.out' }, 0.02)
        .fromTo('.about-hud-corner-bl', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.08, ease: 'power2.out' }, 0.04)
        .fromTo('.about-hud-corner-br', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.08, ease: 'power2.out' }, 0.06)
        .fromTo('.about-hud-border-top', { scaleX: 0 }, { scaleX: 1, duration: 0.10, ease: 'power1.out' }, 0.02)
        .fromTo('.about-hud-border-bottom', { scaleX: 0 }, { scaleX: 1, duration: 0.10, ease: 'power1.out' }, 0.04)
        .fromTo('.about-tag-header', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.06);

      // 2. Heading reveals first with kinetic stagger (0.08 -> 0.16)
      aboutTl.fromTo(
        '.about-heading-char',
        { yPercent: 120, opacity: 0, filter: 'blur(6px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.08, stagger: 0.015, ease: 'power2.out' },
        0.08
      );

      // 3. Staggered line-by-line reveal (0.16 -> 0.70)
      // line 1 appears -> line 2 appears -> line 3 appears -> line 4 appears...
      const lineElements = document.querySelectorAll('.about-line-text');
      const lineStep = 0.54 / (lineElements.length || 6);
      lineElements.forEach((lineEl, idx) => {
        const startPoint = 0.16 + idx * lineStep;
        aboutTl.fromTo(
          lineEl,
          { yPercent: 110, opacity: 0, filter: 'blur(5px)' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: lineStep * 1.3, ease: 'power2.out' },
          startPoint
        );
      });

      // 4. Footer info reveals (0.68 -> 0.76)
      aboutTl.fromTo('.about-box-footer', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.68);

      // 5. Plateau: 0.76 -> 0.84 (all lines readable and sharp)

      // 6. Smooth exit transition towards What I Do (0.84 -> 1.00)
      aboutTl.to('.about-hud-wrapper', { y: -50, opacity: 0, filter: 'blur(4px)', duration: 0.16, ease: 'power2.in' }, 0.84);
    } else {
      const aboutMobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
      aboutMobileTl
        .fromTo('.about-hud-wrapper', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0)
        .fromTo('.about-line-text', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, ease: 'power2.out' }, 0.1);
    }

    // 3. WHAT I DO / 3D DESK SCENE CHOREOGRAPHY (Scene 04)
    // Kinetic After Effects heading reveal (WHAT -> I -> DO) and individual card entrances
    const whatTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.whatIDO',
        start: 'top 75%',
        end: 'top 15%',
        scrub: 1.2,
        invalidateOnRefresh: true,
        id: 'what-master-timeline'
      }
    });

    // Sequential After Effects heading reveal
    whatTl
      .fromTo('.what-word-what', 
        { yPercent: 120, opacity: 0, scale: 0.92, filter: 'blur(8px)' }, 
        { yPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out' }, 
        0
      )
      .fromTo('.what-word-i', 
        { yPercent: 120, opacity: 0, scale: 0.92, filter: 'blur(8px)' }, 
        { yPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out' }, 
        0.08
      )
      .fromTo('.what-word-do', 
        { yPercent: 120, opacity: 0, scale: 0.92, filter: 'blur(8px)' }, 
        { yPercent: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.16, ease: 'power2.out' }, 
        0.16
      );

    // Card 1 enters individually (0.20 -> 0.60)
    whatTl
      .fromTo('.what-card-0', 
        { opacity: 0, x: 60, scale: 0.94 }, 
        { opacity: 1, x: 0, scale: 1, duration: 0.22, ease: 'power2.out' }, 
        0.20
      )
      .fromTo('.what-card-0 .what-corner', 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, stagger: 0.02, duration: 0.14, ease: 'power2.out' }, 
        0.24
      )
      .fromTo('.what-card-0 .what-card-header', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 
        0.28
      )
      .fromTo('.what-card-0 p', 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 
        0.34
      )
      .fromTo('.what-card-0 h5, .what-card-0 .what-content-flex, .what-card-0 .what-arrow', 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 
        0.40
      );

    // Card 2 enters individually (0.50 -> 0.90)
    whatTl
      .fromTo('.what-card-1', 
        { opacity: 0, x: 60, scale: 0.94 }, 
        { opacity: 1, x: 0, scale: 1, duration: 0.22, ease: 'power2.out' }, 
        0.50
      )
      .fromTo('.what-card-1 .what-corner', 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, stagger: 0.02, duration: 0.14, ease: 'power2.out' }, 
        0.54
      )
      .fromTo('.what-card-1 .what-card-header', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 
        0.58
      )
      .fromTo('.what-card-1 p', 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.16, ease: 'power2.out' }, 
        0.64
      )
      .fromTo('.what-card-1 h5, .what-card-1 .what-content-flex, .what-card-1 .what-arrow', 
        { opacity: 0, scale: 0.9 }, 
        { opacity: 1, scale: 1, duration: 0.14, ease: 'power2.out' }, 
        0.70
      );

    // 3. EXPERIENCE PROGRESSION SCRUB (Scene 04)
    // Timeline light line scrubs down directly in sync with scroll position
    const careerBoxes = document.querySelectorAll('.career-info-box');
    const careerTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.career-section',
        start: 'top 65%',
        end: 'bottom 45%',
        scrub: 1.2,
        invalidateOnRefresh: true
      }
    });

    // Animate glowing timeline line from 0% to 100%
    careerTl.fromTo(
      '.career-timeline',
      { maxHeight: '0%', opacity: 0 },
      { maxHeight: '100%', opacity: 1, ease: 'none', duration: 1 },
      0
    );

    // Progressively reveal experience boxes as timeline line advances
    careerBoxes.forEach((box, i) => {
      const stepStart = (i / careerBoxes.length) * 0.8;
      careerTl.fromTo(
        box,
        { opacity: 0.15, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: 'power2.out' },
        stepStart
      );
    });

    // 4. MY WORK HORIZONTAL PINNED SHOWCASE (Scene 05)
    // 4. MY WORK HORIZONTAL PINNED SHOWCASE (Scene 05)
    // On desktop, pins and scrubs projects horizontally across the screen
    if (window.innerWidth > 768) {
      const workBoxes = document.querySelectorAll('.work-box');
      if (workBoxes.length > 0) {
        const workContainer = document.querySelector('.work-container');
        const boxWidth = workBoxes[0].getBoundingClientRect().width;
        const totalDistance =
          boxWidth * workBoxes.length -
          (workContainer ? workContainer.getBoundingClientRect().width : window.innerWidth) +
          300;

        const workTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.work-section',
            start: 'top top',
            end: `+=${Math.max(totalDistance, 1800)}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            id: 'work-master',
            invalidateOnRefresh: true
          }
        });

        const animDuration = 10;
        workTl.to('.work-flex', {
          x: -totalDistance,
          ease: 'none',
          duration: animDuration
        }, 0);

        // Choreographed entrance: scale down -> full scale, blur -> sharp, parallax & active glow
        workBoxes.forEach((box, i) => {
          const imgIn = box.querySelector('.work-image-in');
          const img = box.querySelector('.work-image-in img');
          if (!imgIn || !img) return;

          const stepTime = (i / Math.max(1, workBoxes.length - 1)) * animDuration;
          const enterStart = Math.max(0, stepTime - 1.8);
          const enterEnd = Math.min(animDuration, stepTime + 0.8);

          if (i === 0) {
            // First project starts in focus, subtle parallax movement
            workTl.fromTo(
              img,
              { x: 0 },
              { x: -25, ease: 'none', duration: enterEnd + 1 },
              0
            );
          } else {
            // Successive project images: starts scaled down, blur -> sharp, opacity 0.35 -> 1, subtle glow
            workTl.fromTo(
              imgIn,
              {
                scale: 0.94,
                opacity: 0.35,
                filter: 'blur(3px)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)'
              },
              {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
                boxShadow: '0 14px 40px rgba(168, 85, 247, 0.28)',
                ease: 'power2.out',
                duration: Math.max(1.2, enterEnd - enterStart)
              },
              enterStart
            );

            // Subtle parallax translation inside image frame
            workTl.fromTo(
              img,
              { x: 25 },
              { x: -25, ease: 'none', duration: Math.max(1.8, enterEnd - enterStart + 0.5) },
              enterStart
            );
          }
        });
      }
    } else {
      // Mobile vertical scroll reveal
      const workBoxes = document.querySelectorAll('.work-box');
      workBoxes.forEach((box) => {
        const imgIn = box.querySelector('.work-image-in');
        const img = box.querySelector('.work-image-in img');
        if (imgIn) {
          gsap.fromTo(
            imgIn,
            { opacity: 0.35, scale: 0.94, filter: 'blur(3px)' },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: box,
                start: 'top 85%',
                end: 'top 40%',
                scrub: 1
              }
            }
          );
        }
        if (img) {
          gsap.fromTo(
            img,
            { y: 20 },
            {
              y: -20,
              ease: 'none',
              scrollTrigger: {
                trigger: box,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
              }
            }
          );
        }
      });
    }

    // 5. PROJECT DETAIL TRANSITION (Scene 06)
    // Cinematic transition where CryptoTrace visual expands to dominant showcase
    const projectDetailTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.project-detail-section',
        start: 'top 80%',
        end: 'top 25%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    projectDetailTl
      .fromTo('.project-detail-card', { scale: 0.92, opacity: 0.4 }, { scale: 1, opacity: 1, ease: 'power2.out' }, 0)
      .fromTo('.project-feature-col', { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' }, 0.2);

    // 6. TECH STACK ENTRANCE (Scene 07)
    const techTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.techstack-new',
        start: 'top 75%',
        end: 'top 20%',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    techTl
      .fromTo('.techstack-content h2', { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'power2.out' }, 0)
      .fromTo('.techstack-item', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, stagger: 0.02, ease: 'power2.out' }, 0.1);

    // 7. CONTACT ENTRANCE (Scene 08)
    const contactTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 85%',
        end: 'bottom bottom',
        toggleActions: 'play none none none'
      }
    });

    contactTl
      .fromTo('.contact-section h3', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.contact-box', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, '-=0.4');

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const handleScrollToTop = () => {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container-main">
      {/* 3D Scene in background */}
      <Character3D />

      {/* ================= 02. HERO / 3D AVATAR ================= */}
      <section className="landing-section" id="hero">
        <div className="landing-container">
          <div className="landing-intro">
            <h2 className="landing-intro-greeting">Hello! I'm</h2>
            <h1 className="landing-intro-name">
              <span className="landing-name-first">AKSHAT</span> <br />
              <span className="landing-name-last">BALOTHIYA</span>
            </h1>
          </div>

          <div className="landing-info">
            <h3 className="landing-role-prefix">An</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">AI ENGINEER</div>
            </h2>
            <h2>
              <div className="landing-h2-info">PYTHON DEVELOPER</div>
            </h2>
          </div>

          <div className="mobile-photo">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
              alt="Akshat Balothiya"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* ================= 03. ABOUT ME / 3D SCENE ================= */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-hud-wrapper">
            <div className="about-hud-corner about-hud-corner-tl" />
            <div className="about-hud-corner about-hud-corner-tr" />
            <div className="about-hud-corner about-hud-corner-bl" />
            <div className="about-hud-corner about-hud-corner-br" />
            <div className="about-hud-border-h about-hud-border-top" />
            <div className="about-hud-border-h about-hud-border-bottom" />

            <div className="about-me">
              <div className="about-tag-header">
                <span className="about-tag-badge">
                  <span className="about-badge-dot" /> 01 // PROFILE
                </span>
                <span className="about-tag-status">AI & ML SYSTEM BUILDER</span>
              </div>

              <h3 className="about-heading">
                <span className="about-heading-mask">
                  <span className="about-heading-char">A</span>
                  <span className="about-heading-char">B</span>
                  <span className="about-heading-char">O</span>
                  <span className="about-heading-char">U</span>
                  <span className="about-heading-char">T</span>
                  <span className="about-heading-space">&nbsp;&nbsp;</span>
                  <span className="about-heading-char">M</span>
                  <span className="about-heading-char">E</span>
                </span>
              </h3>

              <div className="about-para">
                {aboutLines.map((line, idx) => (
                  <div className="about-line-wrap" key={idx}>
                    <span className="about-line-text">{line}</span>
                  </div>
                ))}
              </div>

              <div className="about-box-footer">
                <span>SYS.INIT // LIVING AVATAR</span>
                <span>INDIA // B.TECH CSE (AI/ML)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 04. WHAT I DO / 3D DESK SCENE ================= */}
      <section className="whatIDO" id="what-i-do">
        <div className="what-box what-box-title">
          <h2 className="what-title-kinetic">
            <span className="what-word-wrap">
              <span className="what-word what-word-what">WHAT</span>
            </span>
            <span className="what-word-wrap">
              <span className="what-word what-word-i">I</span>
            </span>
            <span className="what-word-wrap">
              <span className="what-word what-word-do">DO</span>
            </span>
          </h2>
        </div>

        <div className="what-box what-box-cards">
          <div className="what-box-in">
            {/* Card 1: AI / ML Engineer */}
            <div
              className={`what-content what-card-0 ${activeCard === 0 ? 'what-content-active' : 'what-sibling'}`}
              onMouseEnter={() => setActiveCard(0)}
              onClick={() => setActiveCard(0)}
              ref={(el) => (whatCardRefs.current[0] = el)}
            >
              <div className="what-corner what-corner-tl" />
              <div className="what-corner what-corner-tr" />
              <div className="what-corner what-corner-bl" />
              <div className="what-corner what-corner-br" />

              <div className="what-content-in">
                <div className="what-card-header">
                  <h3>{config.skills.develop.title}</h3>
                  <h4>{config.skills.develop.description}</h4>
                </div>
                <p>{config.skills.develop.details}</p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  {config.skills.develop.tools.map((tool, i) => (
                    <div className="what-tags" key={i}>
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="what-arrow" />
              </div>
            </div>

            {/* Card 2: Software & Web Developer */}
            <div
              className={`what-content what-card-1 ${activeCard === 1 ? 'what-content-active' : 'what-sibling'}`}
              onMouseEnter={() => setActiveCard(1)}
              onClick={() => setActiveCard(1)}
              ref={(el) => (whatCardRefs.current[1] = el)}
            >
              <div className="what-corner what-corner-tl" />
              <div className="what-corner what-corner-tr" />
              <div className="what-corner what-corner-bl" />
              <div className="what-corner what-corner-br" />

              <div className="what-content-in">
                <div className="what-card-header">
                  <h3>{config.skills.design.title}</h3>
                  <h4>{config.skills.design.description}</h4>
                </div>
                <p>{config.skills.design.details}</p>
                <h5>Skillset & tools</h5>
                <div className="what-content-flex">
                  {config.skills.design.tools.map((tool, i) => (
                    <div className="what-tags" key={i}>
                      {tool}
                    </div>
                  ))}
                </div>
                <div className="what-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 04. EXPERIENCE ================= */}
      <section className="career-section section-container" id="experience">
        <div className="career-container">
          <h2>
            My career <span>&</span>
            <br /> experience
          </h2>

          <div className="career-info">
            <div className="career-timeline">
              <div className="career-dot" />
            </div>

            {config.experiences.map((exp, idx) => (
              <div className="career-info-box" key={idx}>
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{exp.position}</h4>
                    {exp.company ? <h5>{exp.company}</h5> : null}
                  </div>
                  <h3>{exp.period}</h3>
                </div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 05. MY WORK ================= */}
      <section className="work-section" id="work">
        <div className="work-container section-container">
          <h2>
            My <span>Work</span>
          </h2>

          <div className="work-flex">
            {config.projects.slice(0, 4).map((proj, idx) => (
              <div className="work-box" key={proj.id}>
                <div className="work-info">
                  <div className="work-title">
                    <h3>0{idx + 1}</h3>
                    <div>
                      <h4>{proj.title}</h4>
                      <p>{proj.category}</p>
                    </div>
                  </div>
                  <h4>Tools and features</h4>
                  <p>{proj.technologies}</p>
                </div>

                <div className="work-image">
                  <a
                    className="work-image-in"
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    <div className="work-link">
                      <ExternalLinkIcon />
                    </div>
                    <img src={proj.image} alt={proj.title} loading="lazy" />
                  </a>
                </div>

                <div className="work-footer">
                  <p className="work-description-text">{proj.description}</p>
                  <a
                    className="work-action-btn"
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="disable"
                  >
                    <span>View Project</span>
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>
            ))}

            {/* CTA Card leading to all works */}
            <div className="work-box work-box-cta">
              <div className="see-all-works">
                <h3>Want to see more?</h3>
                <p>Explore all of my projects, hackathon solutions and creations</p>
                <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                  See All Works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 06. PROJECT DETAIL / PROJECT TRANSITION ================= */}
      <section className="project-detail-section" id="project-detail">
        <div className="project-detail-container">
          <div className="project-detail-header">
            <div className="project-detail-badge">
              <span className="project-detail-badge-dot" />
              Flagship Innovation // Architecture
            </div>
            <h2>CryptoTrace — AI & Graph Platform</h2>
            <p>
              Smart India Hackathon 2026 Winner. A full-scale forensic intelligence system transforming complex blockchain
              transaction networks into actionable, plain-language legal reports in minutes.
            </p>
          </div>

          <div className="project-detail-card">
            <div className="project-detail-hero-media">
              <img
                src="/images/projects/cryptotrace.jpg"
                alt="CryptoTrace Architecture"
              />
              <div className="project-detail-media-overlay">
                <div className="project-detail-tags-row">
                  <span className="project-tag-pill">Python</span>
                  <span className="project-tag-pill">Groq LLaMA-3.3-70B</span>
                  <span className="project-tag-pill">Whisper STT</span>
                  <span className="project-tag-pill">Graph ML</span>
                  <span className="project-tag-pill">Anomaly Detection</span>
                  <span className="project-tag-pill">FastAPI</span>
                </div>
              </div>
            </div>

            <div className="project-detail-body">
              <div className="project-feature-col">
                <div className="project-feature-num">01 / DETECTION</div>
                <h4>Graph-Based Anomaly Scoring</h4>
                <p>
                  Implements multi-hop cluster heuristics and graph neural network patterns to trace peeling chains, mixer
                  interactions, and illicit fund wash-trading.
                </p>
              </div>

              <div className="project-feature-col">
                <div className="project-feature-num">02 / REASONING</div>
                <h4>Groq LLaMA-3.3-70B Explainability</h4>
                <p>
                  Converts intricate cryptographic flow matrices into plain-language forensic narratives with deterministic risk
                  scores for non-technical investigators.
                </p>
              </div>

              <div className="project-feature-col">
                <div className="project-feature-num">03 / MULTILINGUAL</div>
                <h4>Real-Time Voice Intake Pipeline</h4>
                <p>
                  Integrated Whisper voice transcription enables victims to file fraud reports in regional languages, parsed
                  directly into structured forensic entities.
                </p>
              </div>
            </div>

            <div className="project-detail-footer">
              <span style={{ fontSize: '13px', color: '#adacac' }}>
                Open-source repository verified on GitHub • Smart India Hackathon 2026
              </span>
              <a
                href="https://github.com/akshat-aetroiddestroyer/CryptoTrace-GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn"
                data-cursor="disable"
              >
                View Repository on GitHub <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 07. TECH STACK ================= */}
      <section className="techstack-new" id="tech">
        <div className="techstack-video-container">
          <video autoPlay loop muted playsInline className="techstack-video">
            <source src="/video/video.webm" type="video/webm" />
          </video>
          <div className="techstack-overlay" />
        </div>

        <div className="techstack-content">
          <h2>Tech Stack</h2>
          <div className="techstack-pyramid">
            {techStackPyramid.map((row, rowIdx) => (
              <div className="techstack-row" key={rowIdx}>
                {row.map((item, itemIdx) => (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="techstack-item"
                    title={item.name}
                    key={itemIdx}
                    data-cursor="disable"
                  >
                    <img src={item.icon} alt={item.name} loading="lazy" />
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 08. CONTACT ================= */}
      <section className="contact-section section-container" id="contact">
        <div className="contact-container">
          <h3>{config.developer.fullName}</h3>

          <div className="contact-flex">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href={`mailto:${config.contact.email}`} data-cursor="disable">
                  {config.contact.email}
                </a>
              </p>
              <h4>Location</h4>
              <p>
                <span>{config.social.location}</span>
              </p>
            </div>

            <div className="contact-box">
              <h4>Social</h4>
              <a
                href={config.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
                data-cursor="disable"
              >
                Github <ExternalLinkIcon />
              </a>
              <a
                href={config.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
                data-cursor="disable"
              >
                Linkedin <ExternalLinkIcon />
              </a>
              <a
                href={config.contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
                data-cursor="disable"
              >
                Twitter (X) <ExternalLinkIcon />
              </a>
              <a
                href={config.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social"
                data-cursor="disable"
              >
                Instagram <ExternalLinkIcon />
              </a>
            </div>

            <div className="contact-box">
              <h2>
                Designed and Developed <br />
                by <span>{config.developer.fullName}</span>
              </h2>
              <h5>
                <CopyrightIcon /> {new Date().getFullYear()}
              </h5>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 09. FINAL INTERACTIVE / PLAY WITH ME AREA ================= */}
      <section className="play-section" id="play">
        <div className="play-section-header">
          <h2>Play With Me</h2>
          <p>Challenge Akshat's AI Chess Engine right here in your browser</p>
        </div>

        <InteractiveChess isEmbedded={true} />

        <button className="back-to-top-btn" onClick={handleScrollToTop} data-cursor="disable">
          ↑ Back to Top
        </button>
      </section>
    </div>
  );
};

export default Home;
