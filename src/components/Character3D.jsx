import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Track filters for animations
const TRACK_FILTER_TYPING = [
  'thighL', 'thighR', 'shinL', 'shinR', 'forearmL', 'forearmR', 'handL', 'handR',
  'f_pinky03R', 'f_pinky02L', 'f_pinky02R', 'f_pinky01L', 'f_pinky01R',
  'palm04L', 'palm04R', 'f_ring01L', 'thumb01L', 'thumb01R', 'thumb03L', 'thumb03R',
  'palm02L', 'palm02R', 'palm01L', 'palm01R', 'f_index01L', 'f_index01R',
  'palm03L', 'palm03R', 'f_ring02L', 'f_ring02R', 'f_ring01R', 'f_ring03L', 'f_ring03R',
  'f_middle01L', 'f_middle02L', 'f_middle03L', 'f_middle01R', 'f_middle02R', 'f_middle03R',
  'f_index02L', 'f_index03L', 'f_index02R', 'f_index03R', 'thumb02L', 'f_pinky03L',
  'upper_armL', 'upper_armR', 'thumb02R', 'toeL', 'heel02L', 'toeR', 'heel02R'
];
const TRACK_FILTER_BROW = ['eyebrow_L', 'eyebrow_R'];

function filterClip(gltf, clipName, filterNames) {
  const clip = THREE.AnimationClip.findByName(gltf.animations, clipName);
  if (!clip) return null;
  const tracks = clip.tracks.filter((t) =>
    filterNames.some((f) => t.name.includes(f))
  );
  return new THREE.AnimationClip(clip.name + '_filtered', clip.duration, tracks);
}

export const Character3D = () => {
  const mountRef = useRef(null);
  const hoverRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;
    let aspect = width / height;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera matching reference
    const isDesktopLoading = window.innerWidth > 768;
    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, isDesktopLoading ? 12.6 : 13.1, isDesktopLoading ? 24.5 : 24.7);
    camera.zoom = 1.0;
    camera.updateProjectionMatrix();

    // Look target vector for smooth scroll-driven lookAt choreography
    const cameraTarget = new THREE.Vector3(0, isDesktopLoading ? 12.5 : 13.0, 0);

    // Head pitch offset for realistic physical head-rise entrance
    const introHeadPitch = { value: isDesktopLoading ? -0.26 : 0 };

    // 3. WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    mount.appendChild(renderer.domElement);

    // 4. Cinematic Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x2d124d, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xd9b3ff, 0);
    dirLight.position.set(1.5, 14, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x9a4dff, 0);
    rimLight.position.set(-2, 15, -8);
    scene.add(rimLight);

    // Pink / magenta desk monitor pointLight
    const pointLight = new THREE.PointLight(0xff55b0, 0, 18, 1.8);
    pointLight.position.set(-0.1, 9.2, 4.5);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Dynamic virtual mouse light that follows cursor
    const mouseVirtualLight = new THREE.PointLight(0xc490ff, 3.5, 30, 1.8);
    mouseVirtualLight.position.set(0, 13, 8);
    scene.add(mouseVirtualLight);

    // Load Environment HDR
    new RGBELoader().setPath('/models/').load('char_enviorment.hdr', function (hdr) {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdr;
      scene.environmentIntensity = 0;
      scene.environmentRotation.set(5.76, 85.85, 1);
    });

    // Lights turn on transition
    const turnOnLights = () => {
      const ease = 'power2.inOut';
      gsap.to(scene, { environmentIntensity: 0.65, duration: 2, ease });
      gsap.to(dirLight, { intensity: 1.6, duration: 2, ease });
      gsap.to(rimLight, { intensity: 2.2, duration: 2, ease });
      gsap.to('.character-rim', { y: '55%', opacity: 1, delay: 0.2, duration: 2 });
    };

    // 5. Load Decrypted GLTF Model
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(draco);

    let mixer = null;
    let spine006 = null;
    let screenlightMesh = null;
    let screenMesh = null;
    let characterModel = null;

    gltfLoader.load(
      '/models/character.glb',
      async (gltf) => {
        characterModel = gltf.scene;
        await renderer.compileAsync(characterModel, camera, scene);

        characterModel.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = false;
            node.receiveShadow = false;
            node.frustumCulled = false;
            if (node.material && !Array.isArray(node.material)) {
              node.material.precision = 'mediump';
            }
          }

          // CRITICAL: HIDE UNWANTED GIANT BACKDROP MESHES RESPONSIBLE FOR THE WHITE PANEL
          // Plane.003 is a 32-unit wide backdrop plane with default white/gray material
          // Plane (mesh 54) has undefined material which renders pure white
          if (
            node.name === 'Plane.003' ||
            node.name === 'Plane003' ||
            node.name === 'Plane' ||
            node.name === 'Plane.009' ||
            node.name === 'Plane.016'
          ) {
            node.visible = false;
          }

          // Screen light emissive mesh
          if (node.name === 'screenlight') {
            node.material.transparent = true;
            node.material.opacity = 0;
            node.material.emissive.set('#ff4fa8');

            gsap.timeline({ repeat: -1, repeatRefresh: true }).to(node.material, {
              emissiveIntensity: () => 6 + 3 * Math.random(),
              duration: () => 0.4 + 0.3 * Math.random(),
              delay: () => 0.05 + 0.1 * Math.random()
            });
            screenlightMesh = node;
          }

          // Computer monitor screen display mesh (Plane.004)
          if (node.name === 'Plane.004' || node.name === 'Plane004') {
            if (node.isMesh && node.material) {
              const mats = Array.isArray(node.material) ? node.material : [node.material];
              mats.forEach((m) => {
                if (m.name === 'Material.027') {
                  m.transparent = true;
                  m.opacity = 0;
                  m.color.set('#ff4fa8');
                  m.emissive = new THREE.Color('#ff4fa8');
                  m.emissiveIntensity = 2.0;
                  screenMesh = node;
                }
              });
            }
            node.children?.forEach((c) => {
              if (c.material) {
                c.material.transparent = true;
                c.material.opacity = 0;
                if (c.material.name === 'Material.027') {
                  screenMesh = c;
                  c.material.color.set('#ff4fa8');
                  c.material.emissive = new THREE.Color('#ff4fa8');
                  c.material.emissiveIntensity = 2.0;
                }
              }
            });
          }
        });

        // Position feet
        const footR = characterModel.getObjectByName('footR');
        const footL = characterModel.getObjectByName('footL');
        if (footR) footR.position.y = 3.36;
        if (footL) footL.position.y = 3.36;

        // Set initial slightly lowered body position for staged cinematic rise
        characterModel.position.set(0, isDesktopLoading ? -0.42 : 0, 0);
        characterModel.rotation.set(isDesktopLoading ? 0.06 : 0, 0, 0);

        // Animations Setup
        mixer = new THREE.AnimationMixer(characterModel);
        let introAction = null;

        if (gltf.animations) {
          const intro = gltf.animations.find((a) => a.name === 'introAnimation');
          if (intro) {
            introAction = mixer.clipAction(intro);
            introAction.setLoop(THREE.LoopOnce, 1);
            introAction.clampWhenFinished = true;
            if (!isDesktopLoading) {
              introAction.play();
            }
          }

          ['key1', 'key2', 'key5', 'key6'].forEach((keyName) => {
            const clip = THREE.AnimationClip.findByName(gltf.animations, keyName);
            if (clip) {
              const act = mixer.clipAction(clip);
              act.play();
              act.timeScale = 1.2;
            }
          });

          // Typing animation
          const typingAction = filterClip(gltf, 'typing', TRACK_FILTER_TYPING);
          if (typingAction) {
            const act = mixer.clipAction(typingAction);
            act.enabled = true;
            act.play();
            act.timeScale = 1.2;
          }

          // Blinking animation starts naturally
          setTimeout(() => {
            const blink = gltf.animations.find((a) => a.name === 'Blink');
            if (blink) {
              mixer.clipAction(blink).play().fadeIn(0.5);
            }
          }, 3000);

          // Brow up hover interaction
          const browClip = filterClip(gltf, 'browup', TRACK_FILTER_BROW);
          if (browClip && hoverRef.current) {
            const browAct = mixer.clipAction(browClip);
            browAct.setLoop(THREE.LoopOnce, 1);
            browAct.clampWhenFinished = true;
            browAct.enabled = true;

            const onEnter = () => {
              browAct.reset().fadeIn(0.5).play();
            };
            const onLeave = () => {
              browAct.fadeOut(0.6);
            };
            hoverRef.current.addEventListener('mouseenter', onEnter);
            hoverRef.current.addEventListener('mouseleave', onLeave);
          }
        }

        scene.add(characterModel);

        spine006 = characterModel.getObjectByName('spine006') || null;

        // STAGE 2 & 3: Master 3D Avatar Physical Entrance Choreography
        const startHero3DEntrance = () => {
          // Avatar physical intro animation plays
          if (introAction) {
            introAction.reset().play();
          }

          // Lighting smoothly turns on
          turnOnLights();

          // Avatar upper body slowly rises into Hero position
          gsap.to(characterModel.position, {
            y: 0,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.15
          });
          gsap.to(characterModel.rotation, {
            x: 0,
            duration: 1.5,
            ease: 'power2.out',
            delay: 0.15
          });

          // Head rises up smoothly so face becomes properly visible
          gsap.to(introHeadPitch, {
            value: 0,
            duration: 1.4,
            ease: 'power2.out',
            delay: 0.25
          });

          // Camera smoothly floats into Hero framing
          gsap.to(camera.position, {
            y: 13.1,
            z: 24.7,
            duration: 1.6,
            ease: 'power2.out',
            delay: 0.1
          });
          gsap.to(cameraTarget, {
            y: 13.0,
            duration: 1.6,
            ease: 'power2.out',
            delay: 0.1
          });
        };

        if (isDesktopLoading) {
          window.addEventListener('hero-intro-start', startHero3DEntrance, { once: true });
        } else {
          turnOnLights();
        }

        // Setup Master 3D Scroll Choreography
        setup3DScroll(characterModel, camera, screenMesh, screenlightMesh);
      },
      undefined,
      (err) => {
        console.error('Error loading 3D character:', err);
      }
    );

    // 6. Master GSAP Scroll Choreography for 3D Camera & Model
    const setup3DScroll = (model, cam, screenM, screenlightM) => {
      if (window.innerWidth <= 1024) return;

      const spine005 = model.getObjectByName('spine005');

      // Timeline 1: Master Scroll-Driven Hero 3D Choreography (Avatar shifts from center to left, camera dollys smoothly)
      const hero3DTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.landing-section',
          start: 'top top',
          end: '+=700',
          scrub: 1.2,
          invalidateOnRefresh: true,
          id: 'hero-3d-master'
        }
      });

      hero3DTl
        .to(model.rotation, { y: 0.35, x: 0.04, duration: 1, ease: 'power1.inOut' }, 0)
        .to(model.position, { x: -0.95, y: 0.2, z: 0.5, duration: 1, ease: 'power1.inOut' }, 0)
        .to(model.scale, { x: 1.05, y: 1.05, z: 1.05, duration: 1, ease: 'power1.inOut' }, 0)
        .to(cam.position, { x: -0.45, y: 12.8, z: 22.5, duration: 1, ease: 'power1.inOut' }, 0)
        .to(cameraTarget, { x: -0.45, y: 12.8, z: 0, duration: 1, ease: 'power1.inOut' }, 0)
        .to(rimLight, { intensity: 3.0, duration: 1 }, 0)
        .to(dirLight, { intensity: 2.0, duration: 1 }, 0);

      // Timeline 2: About Me Scene Pinned 3D Choreography (Avatar frames left side while text reveals on right, then dollys back for FULL BODY REVEAL)
      const about3DTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top top',
          end: '+=1600',
          scrub: 1.2,
          invalidateOnRefresh: true,
          id: 'about-3d-master'
        }
      });

      about3DTl
        // Phase 1 (0.00 -> 0.20): Settle into prominent left composition for About Me
        .to(model.position, { x: -0.95, y: 0.2, z: 0.5, duration: 0.2, ease: 'power1.inOut' }, 0)
        .to(model.rotation, { y: 0.35, x: 0.04, duration: 0.2, ease: 'power1.inOut' }, 0)
        .to(cam.position, { x: -0.45, y: 12.8, z: 22.5, duration: 0.2, ease: 'power1.inOut' }, 0)
        .to(cameraTarget, { x: -0.45, y: 12.8, z: 0, duration: 0.2, ease: 'power1.inOut' }, 0)

        // Phase 2 (0.20 -> 0.70): Living micro-camera movement while About Me text reveals line-by-line
        .to(cam.position, { y: 12.5, z: 21.8, duration: 0.5, ease: 'sine.inOut' }, 0.2)
        .to(model.rotation, { y: 0.32, duration: 0.5, ease: 'sine.inOut' }, 0.2)
        .to(model.position, { x: -0.9, duration: 0.5, ease: 'sine.inOut' }, 0.2)

        // Phase 3 (0.70 -> 1.00): FULL BODY REVEAL — Continuous cinematic camera pull-back into WHAT I DO desk workstation
        // Camera pulls back to z = 72 and elevates to frame full seated character, desk, chair, legs, and feet
        .to(cam.position, { x: 1.7, y: 7.8, z: 72.0, duration: 0.3, ease: 'power2.inOut' }, 0.70)
        .to(cameraTarget, { x: 1.7, y: 6.8, z: 2.0, duration: 0.3, ease: 'power2.inOut' }, 0.70)
        .to(model.rotation, { y: 0.35, x: 0.02, duration: 0.3, ease: 'power2.inOut' }, 0.70)
        .to(model.position, { x: 0, y: 0, z: 0, duration: 0.3, ease: 'power2.inOut' }, 0.70)
        .to(model.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power2.inOut' }, 0.70);

      // Character leans forward toward keyboard to type
      if (spine005) {
        about3DTl.to(spine005.rotation, { x: 0.35, duration: 0.3, ease: 'power2.inOut' }, 0.70);
      }

      // Pink monitor screen powers on and desk glow activates during desk entrance
      if (screenM && screenM.material) {
        about3DTl.to(screenM.material, { opacity: 1, duration: 0.25 }, 0.75);
      }
      if (screenlightM && screenlightM.material) {
        about3DTl.to(screenlightM.material, { opacity: 1, duration: 0.25 }, 0.75);
      }
      about3DTl.to(pointLight, { intensity: 18, duration: 0.25 }, 0.75);

      // Timeline 3: Active Desk Scene during What I Do scroll
      const whatDeskTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.whatIDO',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
          id: 'what-3d-master'
        }
      });

      whatDeskTl
        .to(cam.position, { x: 1.7, y: 7.8, z: 72.0, ease: 'none' }, 0)
        .to(cameraTarget, { x: 1.7, y: 6.8, z: 2.0, ease: 'none' }, 0)
        .to(model.rotation, { y: 0.42, ease: 'none' }, 0);

      // Timeline 4: Transition out of 3D Scene into Experience Section
      const exit3DTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.career-section',
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
          invalidateOnRefresh: true
        }
      });

      exit3DTl
        .to('.character-container', { autoAlpha: 0, y: -60, ease: 'power2.out' }, 0)
        .to(pointLight, { intensity: 0 }, 0)
        .to(mouseVirtualLight, { intensity: 0 }, 0);
    };

    // 7. Mouse Coordinates Tracking
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        targetMouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        targetMouse.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 8. Render Animation Loop
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (mixer) mixer.update(delta);

      // Smooth delayed mouse lerp for cinematic light physics
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // Cursor acts as dynamic 3D virtual light source illuminating avatar, desk, and environment
      mouseVirtualLight.position.x = mouse.x * 12;
      mouseVirtualLight.position.y = 12.5 + mouse.y * 7;
      mouseVirtualLight.position.z = 10 + (1 - Math.abs(mouse.x)) * 3;
      mouseVirtualLight.intensity = 3.2 + Math.abs(mouse.x) * 1.5 + Math.abs(mouse.y);

      // Head bone (spine006) tracking
      if (spine006) {
        if (camera.position.z < 45) {
          const r = Math.PI / 6;
          spine006.rotation.y = THREE.MathUtils.lerp(spine006.rotation.y, mouse.x * r, 0.1);
          const s = -0.3;
          const c = 0.4;
          const basePitch = mouse.y > s ? (mouse.y < c ? -mouse.y - 0.5 * r : -r - 0.5 * r) : -s - 0.5 * r;
          spine006.rotation.x = THREE.MathUtils.lerp(
            spine006.rotation.x,
            basePitch + introHeadPitch.value,
            0.15
          );
        } else if (window.innerWidth > 1024) {
          spine006.rotation.x = THREE.MathUtils.lerp(spine006.rotation.x, -0.35 + introHeadPitch.value, 0.04);
          spine006.rotation.y = THREE.MathUtils.lerp(spine006.rotation.y, -0.25, 0.04);
        }
      }

      // Sync camera direction dynamically to cameraTarget
      camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

      // Point light synced to screen light
      if (screenlightMesh && screenlightMesh.material && screenlightMesh.material.opacity > 0.9) {
        pointLight.intensity = 20 * screenlightMesh.material.emissiveIntensity;
      } else {
        pointLight.intensity = 0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      aspect = width / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      draco.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={mountRef}>
        <div className="character-rim" />
        <div className="character-hover" ref={hoverRef} />
      </div>
    </div>
  );
};
