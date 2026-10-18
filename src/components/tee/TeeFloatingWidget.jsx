import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';

export const TeeFloatingWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [activeSide, setActiveSide] = useState('FRONT');
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canvasRef = useRef(null);
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
    tween: null,
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
  const nearest = (a, t) => t + Math.round((a - t) / (Math.PI * 2)) * Math.PI * 2;
  const THREE_CLAMP = (p) => Math.max(-0.25, Math.min(0.25, p));

  const tweenTo = useCallback((prop, target, dur = 600) => {
    stateRef.current.tween = {
      prop,
      from: prop === 'yaw' ? stateRef.current.yaw : stateRef.current.pitch,
      to: target,
      t0: performance.now(),
      dur,
    };
  }, []);

  const poke = useCallback(() => {
    stateRef.current.lastInteract = performance.now();
    setHintDismissed(true);
  }, []);

  const goFront = useCallback(() => {
    stateRef.current.tween = null;
    tweenTo('yaw', nearest(stateRef.current.yaw, 0));
    poke();
  }, [poke, tweenTo]);

  const goBack = useCallback(() => {
    stateRef.current.tween = null;
    tweenTo('yaw', nearest(stateRef.current.yaw, Math.PI));
    poke();
  }, [poke, tweenTo]);

  const goSide = useCallback(() => {
    stateRef.current.tween = null;
    tweenTo('yaw', nearest(stateRef.current.yaw, 0) + 0.75);
    poke();
  }, [poke, tweenTo]);

  const doReset = useCallback(() => {
    stateRef.current.tween = null;
    tweenTo('yaw', nearest(stateRef.current.yaw, 0));
    tweenTo('pitch', 0.04);
    stateRef.current.vel = 0;
    stateRef.current.targetCamZ = stateRef.current.isExpanded ? 1.45 : 1.85;
    poke();
  }, [poke, tweenTo]);

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

      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const S = stateRef.current;

      if (S.tween) {
        const k = Math.min(1, (now - S.tween.t0) / S.tween.dur);
        const e = 1 - Math.pow(1 - k, 3);
        const v = S.tween.from + (S.tween.to - S.tween.from) * e;
        if (S.tween.prop === 'yaw') S.yaw = v;
        else S.pitch = v;
        if (k >= 1) S.tween = null;
      } else if (!S.dragging) {
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

  // Pointer interaction (playful elastic cloth pull + 360 spin)
  const onPointerDown = (e) => {
    const S = stateRef.current;
    S.dragging = true;
    S.vel = 0;
    S.tween = null;
    S.lastX = e.clientX;
    S.lastY = e.clientY;
    S.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);

    // Hit test shirt mesh for cloth pull
    const canvas = canvasRef.current;
    const sc = sceneRef.current;
    if (canvas && sc && sc.shirtMesh && sc.raycaster) {
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
    const k = (isExpanded ? 320 : 208) / Math.max(1, width);

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

  const onWheel = (e) => {
    if (!isExpanded) return;
    e.preventDefault();
    stateRef.current.targetCamZ = Math.max(
      1.15,
      Math.min(2.4, stateRef.current.targetCamZ + e.deltaY * 0.0015)
    );
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      } else if (e.key === 'f' || e.key === 'F') {
        goFront();
      } else if (e.key === 'b' || e.key === 'B') {
        goBack();
      } else if (e.key === 'r' || e.key === 'R') {
        doReset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded, goFront, goBack, doReset]);

  return (
    <>
      {/* FLOATING WIDGET (Bottom Right) */}
      <aside
        id="tee-floating-widget"
        aria-label="Interactive 3D Aivolutions T-shirt"
        className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none transition-all duration-300 ${
          isExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Playful hint */}
        <div
          className={`absolute -top-9 right-2 font-mono text-[11px] font-bold tracking-wider bg-[#F3ECD9] text-[#140F1E] px-3 py-1.5 rounded-full border border-black/15 shadow-xl transition-all duration-300 flex items-center gap-1.5 pointer-events-none ${
            hintDismissed ? 'opacity-0 translate-y-1' : 'opacity-100 animate-bounce'
          }`}
        >
          <span>pull shoulder or spin</span>
          <span className="text-[#05F196]">✨</span>
        </div>

        {/* 3D View Stage — Open, borderless, floating directly in space */}
        <div className="relative w-[220px] h-[250px] sm:w-[248px] sm:h-[278px] overflow-visible cursor-grab active:cursor-grabbing">
          <div
            ref={widgetMountRef}
            className="w-full h-full"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none outline-none"
              tabIndex={0}
              aria-label="3D Aivolutions T-shirt. Pull shoulder or drag to rotate."
            />
          </div>

          {/* Fallback if WebGL fails */}
          {hasError && (
            <div className="absolute inset-0 p-3 bg-[#0E0C14]/90 rounded-2xl flex flex-col items-center justify-center text-center">
              <img src="/merch/front-chest-logo.png" alt="Front print" className="w-16 h-auto" />
              <p className="font-mono text-[10px] text-white/50 mt-2">3D viewer unavailable</p>
            </div>
          )}

          {/* Side tag */}
          <span className="absolute top-1 right-2 font-mono text-[9px] font-bold tracking-widest text-white/50 pointer-events-none">
            {activeSide}
          </span>
        </div>

        {/* Action bar */}
        <div className="mt-2 flex items-center justify-between gap-1.5 p-1.5 rounded-full bg-[#0E0C14]/85 backdrop-blur-xl border border-white/15 shadow-lg">
          <button
            onClick={goFront}
            className="font-mono text-[10px] font-bold text-white/80 hover:text-white px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
            title="Front view (F)"
          >
            Front
          </button>
          <button
            onClick={goBack}
            className="font-mono text-[10px] font-bold text-white/80 hover:text-white px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
            title="Back view (B)"
          >
            Back
          </button>
          <button
            onClick={doReset}
            className="font-mono text-[11px] font-bold text-white/80 hover:text-white px-1.5 py-1 rounded-full hover:bg-white/10 transition-colors"
            title="Reset (R)"
            aria-label="Reset orientation"
          >
            ⟲
          </button>
          <button
            onClick={() => {
              poke();
              setIsExpanded(true);
            }}
            className="font-mono text-[11px] font-extrabold text-[#06281B] bg-[#38EF7D] hover:bg-[#2fe070] px-2.5 py-1 rounded-full shadow transition-transform active:scale-95 flex items-center gap-1"
            title="Expand merchandise studio"
          >
            <span className="hidden sm:inline text-[10px]">Expand</span>
            <span>⤢</span>
          </button>
        </div>
      </aside>

      {/* EXPANDED 3D MERCHANDISE STUDIO (Modal Overlay) */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Aivolutions merchandise studio viewer"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0E0C14] border border-white/15 shadow-[0_30px_90px_rgba(0,0,0,0.85)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2 sm:px-8 sm:pt-7">
              <div>
                <p className="font-mono text-xs font-semibold tracking-widest text-[#38EF7D] uppercase">
                  OFFICIAL MERCH // 2025/26
                </p>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  The society uniform, up close.
                </h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="font-mono text-xs font-bold text-ink bg-paper hover:bg-white px-4 py-2 rounded-full shadow transition-transform active:scale-95"
                aria-label="Close studio (Esc)"
              >
                ✕ Close
              </button>
            </div>

            {/* 3D Garment Mount */}
            <div
              ref={modalMountRef}
              onWheel={onWheel}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="mx-6 sm:mx-8 my-3 h-[420px] sm:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden border border-white/10 shadow-inner cursor-grab active:cursor-grabbing relative"
              style={{
                background: 'radial-gradient(circle at 50% 32%, #2c233c 0%, #15111d 55%, #08060c 100%)',
              }}
            >
              {/* Floating watermark tag inside viewer */}
              <span className="absolute top-4 right-5 font-mono text-[10px] font-bold tracking-widest text-white/50 pointer-events-none">
                VIEW: {activeSide}
              </span>
            </div>

            {/* Controls & Specs */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goFront}
                    className="font-mono text-xs font-semibold text-white/90 hover:text-white px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                  >
                    Front View
                  </button>
                  <button
                    onClick={goSide}
                    className="font-mono text-xs font-semibold text-white/90 hover:text-white px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                  >
                    ¾ View
                  </button>
                  <button
                    onClick={goBack}
                    className="font-mono text-xs font-semibold text-white/90 hover:text-white px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                  >
                    Back Artwork
                  </button>
                  <button
                    onClick={doReset}
                    className="font-mono text-sm font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
                    title="Reset orientation"
                    aria-label="Reset orientation"
                  >
                    ⟲
                  </button>
                </div>

                <p className="font-mono text-[11px] text-white/50">
                  drag to spin · scroll to zoom · <kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5">F</kbd>/<kbd className="px-1.5 py-0.5 rounded border border-white/20 bg-white/5">B</kbd> sides
                </p>
              </div>

              {/* Minimal spec grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
                <div>
                  <strong className="block text-sm font-bold text-white">240 GSM</strong>
                  <span className="font-mono text-[11px] text-white/60">Heavyweight Cotton</span>
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">Ivory Chest Mark</strong>
                  <span className="font-mono text-[11px] text-white/60">Orbital Solar Insignia</span>
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">Full Back Print</strong>
                  <span className="font-mono text-[11px] text-white/60">Creation of Adam Duality</span>
                </div>
                <div>
                  <strong className="block text-sm font-bold text-white">S – XXL</strong>
                  <span className="font-mono text-[11px] text-white/60">Custom Oversized Cut</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
