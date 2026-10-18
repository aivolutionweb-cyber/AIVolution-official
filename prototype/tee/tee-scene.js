/* tee-scene.js — Authentic 3D garment fashion viewer with true physical geometry,
   physically based cotton materials, soft studio lighting, and surface-conforming decals. */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DecalGeometry } from "three/addons/geometries/DecalGeometry.js";

export async function createTeeScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();

  // Low-distortion perspective camera (editorial look)
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 1.85);

  // Soft Studio Environment & Lighting
  // Balanced so both black cotton garment and artwork shine with clarity from 360 degrees
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

  // Rim lights to separate the dark garment silhouette from background
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

  // Contact shadow receiver
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.ShadowMaterial({ opacity: 0.14 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.42;
  ground.receiveShadow = true;
  scene.add(ground);

  // Texture loaders
  const textureLoader = new THREE.TextureLoader();
  const [frontTex, backTex, normalTex, aoTex] = await Promise.all([
    new Promise((resolve, reject) => textureLoader.load("./assets/front-chest-logo.png", resolve, undefined, reject)),
    new Promise((resolve, reject) => textureLoader.load("./assets/back-art-isolated.png", resolve, undefined, reject)),
    new Promise((resolve, reject) => textureLoader.load("./assets/extracted_0.jpg", resolve, undefined, reject)),
    new Promise((resolve, reject) => textureLoader.load("./assets/extracted_1.jpg", resolve, undefined, reject)),
  ]);

  frontTex.colorSpace = THREE.SRGBColorSpace;
  frontTex.anisotropy = 16;
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.anisotropy = 16;

  normalTex.wrapS = normalTex.wrapT = THREE.RepeatWrapping;
  normalTex.repeat.set(8, 8);

  // Garment Group
  const shirt = new THREE.Group();
  scene.add(shirt);

  // Load genuine 3D model
  const gltfLoader = new GLTFLoader();
  const gltf = await new Promise((resolve, reject) =>
    gltfLoader.load("./assets/shirt_baked.glb", resolve, undefined, reject)
  );

  let shirtMesh = null;
  gltf.scene.traverse((child) => {
    if (child.isMesh && !shirtMesh) {
      shirtMesh = child;
    }
  });

  if (!shirtMesh) {
    throw new Error("No mesh found in shirt model");
  }

  // Center geometry at origin for perfect rotation axis
  shirtMesh.geometry.center();
  shirtMesh.geometry.computeVertexNormals();

  // Premium heavyweight cotton physical material
  const clothMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x18151f), // Deep charcoal black cotton
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
  shirt.add(shirtMesh);

  // 1. FRONT: Orbital Solar Insignia on wearer's left chest (viewer's right, exactly at chest level)
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
  const frontDecal = new THREE.Mesh(frontGeo, frontDecalMat);
  shirtMesh.add(frontDecal);

  // 2. BACK: Creation of Adam wireframe × human hand artwork
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
  const backDecal = new THREE.Mesh(backGeo, backDecalMat);
  shirtMesh.add(backDecal);

  // Micro-motion dynamics and playful elastic spring pull physics
  const posAttr = shirtMesh.geometry.attributes.position;
  const basePositions = new Float32Array(posAttr.array);
  const pullWeights = new Float32Array(posAttr.count);
  const raycaster = new THREE.Raycaster();
  let isPulling = false;
  let grabPoint = null;
  let wasDeformed = false;

  const springState = {
    x: 0, y: 0, z: 0,
    vx: 0, vy: 0, vz: 0,
    targetX: 0, targetY: 0, targetZ: 0,
    roll: 0, vRoll: 0, targetRoll: 0,
    pitch: 0, vPitch: 0, targetPitch: 0,
    shirtZ: 0, vShirtZ: 0, targetShirtZ: 0,
  };

  function tryGrabCloth(ndcX, ndcY) {
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const hits = raycaster.intersectObject(shirtMesh, false);
    if (hits.length === 0) return false;

    const hit = hits[0];
    grabPoint = shirtMesh.worldToLocal(hit.point.clone());
    isPulling = true;

    // Compute weights for all vertices around grab point (shoulder, corner, or cloth)
    const R = 0.20; // 20cm radius of influence
    const hx = grabPoint.x, hy = grabPoint.y, hz = grabPoint.z;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = basePositions[i * 3] - hx;
      const vy = basePositions[i * 3 + 1] - hy;
      const vz = basePositions[i * 3 + 2] - hz;
      const d = Math.sqrt(vx * vx + vy * vy + vz * vz);
      if (d < R) {
        const q = 1 - d / R;
        pullWeights[i] = q * q * (3 - 2 * q); // smooth cubic falloff
      } else {
        pullWeights[i] = 0;
      }
    }
    return true;
  }

  function pullCloth(dx, dy) {
    if (!isPulling || !grabPoint) return;
    const dist = Math.hypot(dx, dy);

    // Pull forward towards viewer (+Z) and in pointer drag direction
    const pullZ = Math.min(0.26, dist * 0.0022 + 0.08);
    const pullX = dx * 0.0012;
    const pullY = -dy * 0.0012;

    springState.targetZ = pullZ;
    springState.targetX = pullX;
    springState.targetY = pullY;

    // Instant tactile tracking while pulling
    springState.z = pullZ;
    springState.x = pullX;
    springState.y = pullY;
    springState.vz = 0;
    springState.vx = 0;
    springState.vy = 0;

    // Playful whole-garment tilt and pull towards viewer
    const hx = grabPoint.x;
    springState.targetRoll = (hx > 0 ? 1 : -1) * Math.min(0.26, dist * 0.0018);
    springState.targetPitch = Math.min(0.22, dist * 0.0014);
    springState.targetShirtZ = Math.min(0.16, dist * 0.0012 + 0.04);

    springState.roll = springState.targetRoll;
    springState.pitch = springState.targetPitch;
    springState.shirtZ = springState.targetShirtZ;
    springState.vRoll = 0;
    springState.vPitch = 0;
    springState.vShirtZ = 0;
  }

  function releaseCloth() {
    isPulling = false;
    springState.targetX = 0;
    springState.targetY = 0;
    springState.targetZ = 0;
    springState.targetRoll = 0;
    springState.targetPitch = 0;
    springState.targetShirtZ = 0;
    // Initial elastic snap-back velocity from released state
    springState.vz = -springState.z * 14;
    springState.vShirtZ = -springState.shirtZ * 14;
  }

  function updateCloth(t, breeze = 1.0, dt = 0.016) {
    // Update spring physics (elastic rebound back to rest)
    const k = 280; // snappy spring stiffness
    const d = 16;  // natural cloth damping
    
    // Z displacement (towards viewer)
    const az = -k * (springState.z - springState.targetZ) - d * springState.vz;
    springState.vz += az * dt;
    springState.z += springState.vz * dt;

    // X displacement
    const ax = -k * (springState.x - springState.targetX) - d * springState.vx;
    springState.vx += ax * dt;
    springState.x += springState.vx * dt;

    // Y displacement
    const ay = -k * (springState.y - springState.targetY) - d * springState.vy;
    springState.vy += ay * dt;
    springState.y += springState.vy * dt;

    // Roll tilt
    const aRoll = -k * (springState.roll - springState.targetRoll) - d * springState.vRoll;
    springState.vRoll += aRoll * dt;
    springState.roll += springState.vRoll * dt;

    // Pitch tilt
    const aPitch = -k * (springState.pitch - springState.targetPitch) - d * springState.vPitch;
    springState.vPitch += aPitch * dt;
    springState.pitch += springState.vPitch * dt;

    // Garment Z position
    const aShirtZ = -k * (springState.shirtZ - springState.targetShirtZ) - d * springState.vShirtZ;
    springState.vShirtZ += aShirtZ * dt;
    springState.shirtZ += springState.vShirtZ * dt;

    // Idle float combined with spring roll and Z
    shirt.position.y = Math.sin(t * 1.6) * 0.015;
    shirt.position.z = springState.shirtZ;
    shirt.rotation.z = Math.sin(t * 1.1) * 0.008 + springState.roll;

    // Apply vertex deformation if spring is active
    const springActive = isPulling || Math.abs(springState.z) > 0.0005 || Math.abs(springState.vz) > 0.001;
    if (springActive) {
      for (let i = 0; i < posAttr.count; i++) {
        const w = pullWeights[i];
        if (w > 0) {
          posAttr.setXYZ(
            i,
            basePositions[i * 3] + springState.x * w,
            basePositions[i * 3 + 1] + springState.y * w,
            basePositions[i * 3 + 2] + springState.z * w * 1.4
          );
        }
      }
      posAttr.needsUpdate = true;
      wasDeformed = true;
    } else if (wasDeformed) {
      for (let i = 0; i < posAttr.count; i++) {
        if (pullWeights[i] > 0) {
          posAttr.setXYZ(i, basePositions[i * 3], basePositions[i * 3 + 1], basePositions[i * 3 + 2]);
          pullWeights[i] = 0;
        }
      }
      posAttr.needsUpdate = true;
      wasDeformed = false;
    } else if (breeze > 0.05) {
      // Gentle hem wave displacement only when not being pulled
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
  }

  function resize(w, h) {
    const pr = Math.min(window.devicePixelRatio || 1, w < 400 ? 1.6 : 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  return {
    renderer,
    scene,
    camera,
    shirt,
    shirtMesh,
    ground,
    posAttr,
    basePositions,
    tryGrabCloth,
    pullCloth,
    releaseCloth,
    springState,
    updateCloth,
    resize,
  };
}
