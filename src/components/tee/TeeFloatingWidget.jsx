import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

// The 3D society tee.
// - A small spinning tee fixed in the bottom-right corner of every page, with a "check our merch" button.
//   (The Preloader covers it while it plays: that sits on top of everything.)
// - The merch studio: a big viewer in a pop-up. It opens from that button, or from the navbar's
//   "3D Merch" link, which adds ?merch=open to the current page's address.
// One canvas (one WebGL context) is moved between the two.
export const TeeFloatingWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [activeSide, setActiveSide] = useState('FRONT');
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canvasRef = useRef(null);
  const asideRef = useRef(null);
  const onScreenRef = useRef(true);
  const widgetMountRef = useRef(null);
  const modalMountRef = useRef(null);
  const sceneRef = useRef(null);
  const stateRef = useRef({
    yaw: -0.55,
    pitch: 0.04,
    vel: 0,
    dragging: false,
    grabMode: null,
    grabPoint: null,
    grabStartX: 0,
    grabStartY: 0,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    lastInteract: performance.now(),
    camZ: 1.85,
    targetCamZ: 1.85,
    isExpanded: false,
    spring: {
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      targetX: 0, targetY: 0, targetZ: 0,
      roll: 0, vRoll: 0, targetRoll: 0,
      pitch: 0, vPitch: 0, targetPitch: 0,
      shirtZ: 0, vShirtZ: 0, targetShirtZ: 0,
    },
  });

  const norm = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const THREE_CLAMP = (p) => Math.max(-0.25, Math.min(0.25, p));

  const poke = useCallback(() => {
    stateRef.current.lastInteract = performance.now();
    setHintDismissed(true);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let animId = null;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0, 1.85);

    // Soft studio lighting
    const keyFront = new THREE.DirectionalLight(0xfff6eb, 2.2);
    keyFront.position.set(2.4, 3.2, 3.2);
    keyFront.castShadow = true;
    keyFront.shadow.mapSize.set(1024, 1024);
    keyFront.shadow.bias = -0.0005;
    scene.add(keyFront);

    const fillFront = new THREE.DirectionalLight(0xd4e0ff, 1.1);
    fillFront.position.set(-2.8, 0.8, 2.2);
    scene.add(fillFront);

    const keyBack = new THREE.DirectionalLight(0xfff6eb, 2.1);
    keyBack.position.set(-2.2, 3.0, -3.2);
    scene.add(keyBack);

    const fillBack = new THREE.DirectionalLight(0xd4e0ff, 1.1);
    fillBack.position.set(2.6, 0.8, -2.6);
    scene.add(fillBack);

    const rimTop = new THREE.DirectionalLight(0x75ffb8, 1.25);
    rimTop.position.set(0, 3.8, 0);
    scene.add(rimTop);

    const rimLeft = new THREE.DirectionalLight(0x38ef7d, 0.6);
    rimLeft.position.set(-3.2, 0, 0);
    scene.add(rimLeft);

    const rimRight = new THREE.DirectionalLight(0xff7a59, 0.5);
    rimRight.position.set(3.2, 0, 0);
    scene.add(rimRight);

    const ambLight = new THREE.AmbientLight(0xffffff, 0.68);
    scene.add(ambLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.14 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.42;
    ground.receiveShadow = true;
    scene.add(ground);

    const shirtGroup = new THREE.Group();
    scene.add(shirtGroup);

    const textureLoader = new THREE.TextureLoader();
    let posAttr = null;
    let basePositions = null;

    Promise.all([
      new Promise((res, rej) => textureLoader.load('/merch/front-chest-logo.png', res, undefined, rej)),
      new Promise((res, rej) => textureLoader.load('/merch/back-art-isolated.png', res, undefined, rej)),
      new Promise((res, rej) => textureLoader.load('/merch/extracted_0.jpg', res, undefined, rej)),
      new Promise((res, rej) => textureLoader.load('/merch/extracted_1.jpg', res, undefined, rej)),
      new Promise((res, rej) => new GLTFLoader().load('/merch/shirt_baked.glb', res, undefined, rej)),
    ])
      .then(([frontTex, backTex, normalTex, aoTex, gltf]) => {
        if (destroyed) return;

        frontTex.colorSpace = THREE.SRGBColorSpace;
        frontTex.anisotropy = 16;
        backTex.colorSpace = THREE.SRGBColorSpace;
        backTex.anisotropy = 16;

        normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
        normalTex.repeat.set(8, 8);

        let shirtMesh = null;
        gltf.scene.traverse((child) => {
          if (child.isMesh && !shirtMesh) shirtMesh = child;
        });

        if (!shirtMesh) throw new Error('Mesh missing');

        shirtMesh.geometry.center();
        shirtMesh.geometry.computeVertexNormals();

        const clothMat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x18151f),
          roughness: 0.88,
          metalness: 0.0,
          sheen: 0.45,
          sheenRoughness: 0.8,
          sheenColor: new THREE.Color(0x625d70),
          normalMap: normalTex,
          normalScale: new THREE.Vector2(0.5, 0.5),
          aoMap: aoTex,
          aoMapIntensity: 0.85,
          side: THREE.DoubleSide,
        });

        shirtMesh.material = clothMat;
        shirtMesh.castShadow = true;
        shirtMesh.receiveShadow = true;
        shirtGroup.add(shirtMesh);

        // Front Decal: wearer's left chest (viewer's right, exactly at chest level)
        const frontDecalMat = new THREE.MeshStandardMaterial({
          map: frontTex,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          side: THREE.FrontSide,
          roughness: 0.8,
        });
        const frontGeo = new DecalGeometry(
          shirtMesh,
          new THREE.Vector3(0.0636, 0.108, 0.121),
          new THREE.Euler(0, -0.16, 0),
          new THREE.Vector3(0.090, 0.062, 0.08)
        );
        shirtMesh.add(new THREE.Mesh(frontGeo, frontDecalMat));

        // Back Decal
        const backDecalMat = new THREE.MeshStandardMaterial({
          map: backTex,
          transparent: true,
          depthTest: false,
          depthWrite: false,
          side: THREE.FrontSide,
          roughness: 0.8,
        });
        const backGeo = new DecalGeometry(
          shirtMesh,
          new THREE.Vector3(0, 0.005, -0.09),
          new THREE.Euler(0, Math.PI, 0),
          new THREE.Vector3(0.285, 0.355, 0.13)
        );
        shirtMesh.add(new THREE.Mesh(backGeo, backDecalMat));

        posAttr = shirtMesh.geometry.attributes.position;
        basePositions = new Float32Array(posAttr.array);

        sceneRef.current = {
          renderer,
          scene,
          camera,
          shirt: shirtGroup,
          shirtMesh,
          posAttr,
          basePositions,
          pullWeights: new Float32Array(posAttr.count),
          raycaster: new THREE.Raycaster(),
          wasDeformed: false,
          resize: (w, h) => {
            const pr = Math.min(window.devicePixelRatio || 1, 2);
            renderer.setPixelRatio(pr);
            renderer.setSize(w, h, false);
            camera.aspect = w / Math.max(1, h);
            camera.updateProjectionMatrix();
          },
        };

        setIsReady(true);
      })
      .catch((err) => {
        console.error('3D T-shirt load error:', err);
        setHasError(true);
      });

    // Render loop
    let lastTime = performance.now();
    const renderLoop = (now) => {
      animId = requestAnimationFrame(renderLoop);
      if (!sceneRef.current || destroyed) return;
      // nothing to draw while the corner tee is hidden and the studio is closed
      if (!stateRef.current.isExpanded && !onScreenRef.current) {
        lastTime = now;
        return;
      }
      // the small corner tee is drawn at ~30 fps (it is on every page, so keep it light); the studio at full speed
      if (!stateRef.current.isExpanded && now - lastTime < 30) return;

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const S = stateRef.current;

      if (!S.dragging) {
        if (Math.abs(S.vel) > 0.0004) {
          S.yaw += S.vel * dt;
          S.vel *= Math.exp(-dt * 2.2);
        } else if (now - S.lastInteract > 3800) {
          S.yaw += dt * 0.14;
        }
      }

      S.pitch += (THREE_CLAMP(S.pitch) - S.pitch) * Math.min(1, dt * 8);

      const sc = sceneRef.current;

      // Spring evaluation for playful cloth pull & elastic return
      const sp = S.spring;
      const k = 280;
      const d = 16;

      const az = -k * (sp.z - sp.targetZ) - d * sp.vz;
      sp.vz += az * dt;
      sp.z += sp.vz * dt;

      const ax = -k * (sp.x - sp.targetX) - d * sp.vx;
      sp.vx += ax * dt;
      sp.x += sp.vx * dt;

      const ay = -k * (sp.y - sp.targetY) - d * sp.vy;
      sp.vy += ay * dt;
      sp.y += sp.vy * dt;

      const aRoll = -k * (sp.roll - sp.targetRoll) - d * sp.vRoll;
      sp.vRoll += aRoll * dt;
      sp.roll += sp.vRoll * dt;

      const aPitch = -k * (sp.pitch - sp.targetPitch) - d * sp.vPitch;
      sp.vPitch += aPitch * dt;
      sp.pitch += sp.vPitch * dt;

      const aShirtZ = -k * (sp.shirtZ - sp.targetShirtZ) - d * sp.vShirtZ;
      sp.vShirtZ += aShirtZ * dt;
      sp.shirtZ += sp.vShirtZ * dt;

      sc.shirt.rotation.y = S.yaw;
      sc.shirt.rotation.x = S.pitch + sp.pitch;
      sc.shirt.position.y = Math.sin((now / 1000) * 1.6) * 0.015;
      sc.shirt.position.z = sp.shirtZ;
      sc.shirt.rotation.z = Math.sin((now / 1000) * 1.1) * 0.008 + sp.roll;

      // Vertex deformation & hem wave
      const isSpringActive = S.grabMode === 'cloth' || Math.abs(sp.z) > 0.0005 || Math.abs(sp.vz) > 0.001;
      if (isSpringActive && posAttr && basePositions) {
        for (let i = 0; i < posAttr.count; i++) {
          const w = sc.pullWeights ? sc.pullWeights[i] : 0;
          if (w > 0) {
            posAttr.setXYZ(
              i,
              basePositions[i * 3] + sp.x * w,
              basePositions[i * 3 + 1] + sp.y * w,
              basePositions[i * 3 + 2] + sp.z * w * 1.4
            );
          }
        }
        posAttr.needsUpdate = true;
        sc.wasDeformed = true;
      } else if (sc.wasDeformed && posAttr && basePositions) {
        for (let i = 0; i < posAttr.count; i++) {
          if (sc.pullWeights && sc.pullWeights[i] > 0) {
            posAttr.setXYZ(i, basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
            sc.pullWeights[i] = 0;
          }
        }
        posAttr.needsUpdate = true;
        sc.wasDeformed = false;
      } else if (posAttr && basePositions) {
        const t = now / 1000;
        const breeze = S.dragging ? 0.25 : 1.0;
        for (let i = 0; i < posAttr.count; i++) {
          const y = basePositions[i * 3 + 1];
          if (y < -0.15) {
            const hemWeight = Math.min(1.0, (-0.15 - y) / 0.18);
            const x = basePositions[i * 3];
            const z = basePositions[i * 3 + 2];
            const wave = Math.sin(t * 2.8 + x * 9.0 + z * 6.0) * 0.0028 * breeze * hemWeight;
            posAttr.setZ(i, z + wave);
          }
        }
        posAttr.needsUpdate = true;
      }

      // Camera smooth zoom
      camera.position.z += (S.targetCamZ - camera.position.z) * Math.min(1, dt * 6);

      // Update side tag state
      const n = Math.abs(norm(S.yaw));
      const label = n < 0.9 ? 'FRONT' : n > 2.24 ? 'BACK' : '¾ SIDE';
      setActiveSide((prev) => (prev !== label ? label : prev));

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      destroyed = true;
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  // Handle canvas mounting between widget and expanded modal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isReady) return;

    const targetMount = isExpanded ? modalMountRef.current : widgetMountRef.current;
    if (targetMount && canvas.parentElement !== targetMount) {
      targetMount.appendChild(canvas);
    }

    stateRef.current.isExpanded = isExpanded;
    stateRef.current.targetCamZ = isExpanded ? 1.45 : 1.85;

    const resize = () => {
      if (!sceneRef.current || !targetMount) return;
      const rect = targetMount.getBoundingClientRect();
      sceneRef.current.resize(Math.max(2, rect.width), Math.max(2, rect.height));
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (targetMount) ro.observe(targetMount);

    return () => ro.disconnect();
  }, [isExpanded, isReady]);

  // Pointer interaction: drag to spin 360°. On the small corner tee, grabbing the shirt itself tugs the fabric;
  // in the studio a drag anywhere always spins.
  const onPointerDown = (e) => {
    const S = stateRef.current;
    S.dragging = true;
    S.vel = 0;
    S.lastX = e.clientX;
    S.lastY = e.clientY;
    S.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);

    // Hit test shirt mesh for cloth pull
    const canvas = canvasRef.current;
    const sc = sceneRef.current;
    if (!isExpanded && canvas && sc && sc.shirtMesh && sc.raycaster) {
      const rect = canvas.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      sc.raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), sc.camera);
      const hits = sc.raycaster.intersectObject(sc.shirtMesh, false);
      if (hits.length > 0) {
        S.grabMode = 'cloth';
        S.grabPoint = sc.shirtMesh.worldToLocal(hits[0].point.clone());
        S.grabStartX = e.clientX;
        S.grabStartY = e.clientY;

        // Compute vertex weights for the grabbed region (radius ~0.20)
        const hx = S.grabPoint.x, hy = S.grabPoint.y, hz = S.grabPoint.z;
        const R = 0.20;
        const pos = sc.posAttr;
        const base = sc.basePositions;
        for (let i = 0; i < pos.count; i++) {
          const vx = base[i * 3] - hx;
          const vy = base[i * 3 + 1] - hy;
          const vz = base[i * 3 + 2] - hz;
          const d = Math.sqrt(vx * vx + vy * vy + vz * vz);
          if (d < R) {
            const q = 1 - d / R;
            sc.pullWeights[i] = q * q * (3 - 2 * q);
          } else {
            sc.pullWeights[i] = 0;
          }
        }
      } else {
        S.grabMode = 'spin';
      }
    } else {
      S.grabMode = 'spin';
    }
    poke();
  };

  const onPointerMove = (e) => {
    const S = stateRef.current;
    if (!S.dragging) return;
    const now = performance.now();
    const dx = e.clientX - S.lastX;
    const dy = e.clientY - S.lastY;
    const dt = Math.max(8, now - S.lastT);

    const mount = isExpanded ? modalMountRef.current : widgetMountRef.current;
    const width = mount ? mount.getBoundingClientRect().width : 220;
    const k = (isExpanded ? 1300 : 208) / Math.max(1, width);

    if (S.grabMode === 'cloth' && S.grabPoint) {
      const pullDx = e.clientX - S.grabStartX;
      const pullDy = e.clientY - S.grabStartY;
      const dist = Math.hypot(pullDx, pullDy);

      const pullZ = Math.min(0.26, dist * 0.0022 + 0.08);
      const pullX = pullDx * 0.0012;
      const pullY = -pullDy * 0.0012;

      const sp = S.spring;
      sp.targetZ = pullZ;
      sp.targetX = pullX;
      sp.targetY = pullY;
      sp.z = pullZ;
      sp.x = pullX;
      sp.y = pullY;
      sp.vz = 0;
      sp.vx = 0;
      sp.vy = 0;

      const hx = S.grabPoint.x;
      sp.targetRoll = (hx > 0 ? 1 : -1) * Math.min(0.26, dist * 0.0018);
      sp.targetPitch = Math.min(0.22, dist * 0.0014);
      sp.targetShirtZ = Math.min(0.16, dist * 0.0012 + 0.04);
      sp.roll = sp.targetRoll;
      sp.pitch = sp.targetPitch;
      sp.shirtZ = sp.targetShirtZ;
      sp.vRoll = 0;
      sp.vPitch = 0;
      sp.vShirtZ = 0;

      // Subtle yaw nudge when pulling horizontally
      S.yaw += (dx / 320) * k * 0.35;
    } else {
      S.yaw += (dx / 220) * k;
      S.pitch = THREE_CLAMP(S.pitch + (dy / 300) * k);
      S.vel = 0.7 * S.vel + 0.3 * (((dx / 220) * k) / (dt / 1000));
      S.vel = Math.max(-9, Math.min(9, S.vel));
    }

    S.lastX = e.clientX;
    S.lastY = e.clientY;
    S.lastT = now;
    poke();
  };

  const onPointerUp = (e) => {
    const S = stateRef.current;
    S.dragging = false;
    if (S.grabMode === 'cloth') {
      const sp = S.spring;
      sp.targetX = 0;
      sp.targetY = 0;
      sp.targetZ = 0;
      sp.targetRoll = 0;
      sp.targetPitch = 0;
      sp.targetShirtZ = 0;
      sp.vz = -sp.z * 14;
      sp.vShirtZ = -sp.shirtZ * 14;
      S.grabMode = null;
    }
    if (Math.abs(S.vel) < 0.4) S.vel = 0;
    poke();
  };

  // The pointer listeners go straight on the canvas, not as React props: the canvas gets moved into the
  // studio pop-up (rendered into <body>), and React's events don't reach a moved element there.
  // handlersRef always holds this render's versions of the handlers.
  const handlersRef = useRef(null);
  handlersRef.current = { onPointerDown, onPointerMove, onPointerUp };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const down = (e) => handlersRef.current.onPointerDown(e);
    const move = (e) => handlersRef.current.onPointerMove(e);
    const up = (e) => handlersRef.current.onPointerUp(e);
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    return () => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
    };
  }, []);

  const openStudio = () => {
    poke();
    setIsExpanded(true);
  };
  const closeStudio = () => setIsExpanded(false);

  // Navbar "3D Merch" link: /?merch=open opens the studio, then the address goes back to plain /
  useEffect(() => {
    if (new URLSearchParams(location.search).get('merch') === null) return;
    setIsExpanded(true);
    navigate({ pathname: location.pathname, hash: location.hash }, { replace: true });
  }, [location.search, location.pathname, location.hash, navigate]);

  // Is the corner tee visible? (the render loop sleeps while it isn't and the studio is closed)
  useEffect(() => {
    const el = asideRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      onScreenRef.current = entry.isIntersecting;
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // While the studio is open: no page scrolling behind it, and scroll-to-zoom on the viewer.
  // The wheel listener is added by hand because React's is passive (it can't stop the page scroll).
  useEffect(() => {
    if (!isExpanded) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = modalMountRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      stateRef.current.targetCamZ = Math.max(
        1.15,
        Math.min(2.4, stateRef.current.targetCamZ + e.deltaY * 0.0015)
      );
    };
    if (el) el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      document.body.style.overflow = prevOverflow;
      if (el) el.removeEventListener('wheel', onWheel);
    };
  }, [isExpanded]);

  // Esc closes the studio
  useEffect(() => {
    if (!isExpanded) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded]);

  return (
    <>
      {/* CORNER TEE (fixed bottom-right, every page; sits just above the round scroll-to-top button) */}
      <aside
        ref={asideRef}
        id="tee-floating-widget"
        aria-label="Interactive 3D AIvolutions T-shirt"
        className={`fixed bottom-20 right-5 sm:bottom-[5.75rem] sm:right-8 z-40 flex flex-col items-center select-none pointer-events-none transition-[opacity,transform] duration-300 ${
          isExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Playful hint, gone after the first spin */}
        <span
          className={`font-hand text-sm sm:text-base leading-none text-ink bg-cream/90 border border-ink/15 rounded-full px-2 py-0.5 -rotate-6 transition-opacity duration-300 ${
            hintDismissed ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          psst… spin me ↻
        </span>

        {/* 3D stage: no box, the tee floats on the page */}
        <div
          className={`relative w-[88px] h-[97px] sm:w-[112px] sm:h-[123px] lg:w-[128px] lg:h-[141px] cursor-grab active:cursor-grabbing ${
            isExpanded ? '' : 'pointer-events-auto'
          }`}
        >
          <div ref={widgetMountRef} className="w-full h-full">
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none outline-none"
              tabIndex={0}
              aria-label="3D AIvolutions T-shirt. Drag to spin, pull a sleeve to tug it."
            />
          </div>

          {/* Fallback if WebGL fails */}
          {hasError && (
            <div className="absolute inset-1 bg-screen rounded-xl border-2 border-ink flex flex-col items-center justify-center text-center">
              <img src="/merch/front-chest-logo.png" alt="Front print" className="w-10 h-auto" />
              <p className="font-mono text-[9px] text-white/60 mt-1">3D unavailable</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={openStudio}
          className={`btn-sticker -mt-1 whitespace-nowrap ${isExpanded ? '' : 'pointer-events-auto'}`}
          style={{ '--bg': 'var(--mint)', '--r': '-3deg', padding: '0.38rem 0.75rem', fontSize: '0.8rem', borderWidth: '2px', boxShadow: '3px 3px 0 var(--ink)' }}
        >
          check our merch <span aria-hidden="true">↗</span>
        </button>
      </aside>

      {/* MERCH STUDIO (pop-up, rendered into <body> so nothing on the page can sit on top of it) */}
      {isExpanded &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="AIvolutions merch studio"
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-ink/70 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeStudio();
            }}
          >
            <div className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto bg-cream text-ink border-[2.5px] border-ink rounded-2xl shadow-[8px_8px_0_var(--ink)] flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-2 sm:px-8 sm:pt-7">
                <div>
                  <p className="font-mono text-xs font-bold tracking-widest text-marker uppercase">
                    official merch // 2025/26
                  </p>
                  <h3 className="font-bricolage text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                    The society uniform, up close.
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeStudio}
                  className="btn-sticker shrink-0"
                  style={{ '--bg': '#fff', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                  aria-label="Close merch studio (Esc)"
                >
                  ✕ close
                </button>
              </div>

              {/* 3D viewer */}
              <div
                ref={modalMountRef}
                className="relative mx-5 sm:mx-8 my-3 h-[44vh] min-h-[280px] max-h-[540px] sm:h-[54vh] rounded-xl overflow-hidden border-2 border-ink cursor-grab active:cursor-grabbing"
                style={{
                  background: 'radial-gradient(circle at 50% 32%, #2c233c 0%, #15111d 55%, #08060c 100%)',
                }}
              >
                <span className="absolute top-3 right-4 font-mono text-[10px] font-bold tracking-widest text-white/50 pointer-events-none">
                  VIEW: {activeSide}
                </span>
              </div>

              {/* Hint & specs */}
              <div className="px-5 pb-6 sm:px-8 sm:pb-7 space-y-4">
                <p className="font-mono text-[11px] text-pencil">
                  drag to spin<span className="hidden sm:inline"> · scroll to zoom · esc to close</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t-2 border-dashed border-ink/20">
                  <div>
                    <strong className="block text-sm font-bold">240 GSM</strong>
                    <span className="font-mono text-[11px] text-pencil">Heavyweight Cotton</span>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold">Ivory Chest Mark</strong>
                    <span className="font-mono text-[11px] text-pencil">Orbital Solar Insignia</span>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold">Full Back Print</strong>
                    <span className="font-mono text-[11px] text-pencil">Creation of Adam Duality</span>
                  </div>
                  <div>
                    <strong className="block text-sm font-bold">S – XXL</strong>
                    <span className="font-mono text-[11px] text-pencil">Custom Oversized Cut</span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
