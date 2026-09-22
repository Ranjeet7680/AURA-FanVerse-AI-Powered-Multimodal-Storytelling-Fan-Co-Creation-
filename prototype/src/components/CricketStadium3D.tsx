import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Play,
  Pause,
  RotateCcw,
  Box,
  Compass,
  Sparkles,
  Activity,
  Zap,
  Trophy,
  Eye,
  Sun,
  Moon,
  Sunset,
  Camera,
  Layers
} from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { useLanguage } from '../context/LanguageContext';

// ─── PROCEDURAL CANVAS TEXTURE GENERATORS ──────────────────────────────────
function createTurfTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base grass tone
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 1024, 1024);

  // Mower directional lawn stripes (radial & linear bands)
  const stripeWidth = 32;
  for (let x = 0; x < 1024; x += stripeWidth) {
    const isLight = (x / stripeWidth) % 2 === 0;
    ctx.fillStyle = isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(15, 60, 30, 0.18)';
    ctx.fillRect(x, 0, stripeWidth, 1024);
  }

  // Circular outfield mower ring highlights
  for (let r = 80; r < 500; r += 70) {
    ctx.beginPath();
    ctx.arc(512, 512, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 12;
    ctx.stroke();
  }

  // Pitch apron wear ring
  const apronGrad = ctx.createRadialGradient(512, 512, 30, 512, 512, 140);
  apronGrad.addColorStop(0, 'rgba(161, 126, 75, 0.25)');
  apronGrad.addColorStop(1, 'rgba(20, 83, 45, 0)');
  ctx.fillStyle = apronGrad;
  ctx.beginPath();
  ctx.arc(512, 512, 140, 0, Math.PI * 2);
  ctx.fill();

  // Grass blade noise speckling
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 15000; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 1024;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

function createPitchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Clay pitch base gradient (ochre/khaki soil)
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#8c6e43');
  grad.addColorStop(0.2, '#aa8856');
  grad.addColorStop(0.5, '#ba9762');
  grad.addColorStop(0.8, '#aa8856');
  grad.addColorStop(1, '#8c6e43');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Bowler landing scuff marks & spike marks
  const addScuffArea = (cy: number) => {
    ctx.fillStyle = 'rgba(70, 50, 25, 0.45)';
    for (let i = 0; i < 120; i++) {
      const sx = 200 + (Math.random() - 0.5) * 160;
      const sy = cy + (Math.random() - 0.5) * 80;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 3 + Math.random() * 6, 1 + Math.random() * 3, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  addScuffArea(200); // Bowling end scuffs
  addScuffArea(824); // Batting crease footmarks

  // Micro pitch crack lines
  ctx.strokeStyle = 'rgba(60, 40, 20, 0.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 15; i++) {
    const startX = 100 + Math.random() * 312;
    const startY = 150 + Math.random() * 724;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + (Math.random() - 0.5) * 30, startY + Math.random() * 40);
    ctx.stroke();
  }

  // Painted crisp white crease markings
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;

  // Popping Crease (Batting end)
  ctx.fillRect(64, 860, 384, 6);
  // Bowling Crease (Batting end stumps line)
  ctx.fillRect(64, 940, 384, 5);
  // Return Creases
  ctx.fillRect(64, 860, 5, 120);
  ctx.fillRect(444, 860, 5, 120);

  // Popping Crease (Bowling end)
  ctx.fillRect(64, 164, 384, 6);
  // Bowling Crease (Bowling end stumps line)
  ctx.fillRect(64, 84, 384, 5);
  // Return Creases
  ctx.fillRect(64, 44, 5, 120);
  ctx.fillRect(444, 44, 5, 120);

  // Wide ball guide marks
  ctx.fillRect(140, 860, 3, 30);
  ctx.fillRect(368, 860, 3, 30);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createLedBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark cyber background
  ctx.fillStyle = '#060416';
  ctx.fillRect(0, 0, 2048, 128);

  // Top/bottom neon glow lines
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(0, 0, 2048, 4);
  ctx.fillStyle = '#ec4899';
  ctx.fillRect(0, 124, 2048, 4);

  // Glowing sponsor typography repeated
  ctx.font = 'bold 36px monospace';
  ctx.textBaseline = 'middle';

  const banners = [
    { text: '⚡ AURA FANVERSE', color: '#38bdf8' },
    { text: '• AI HAWK-EYE 3D', color: '#f472b6' },
    { text: '• 150 KM/H SPEED GUN', color: '#fbbf24' },
    { text: '• CYBER SHIELD v4.9', color: '#34d399' },
    { text: '• ZERO-TRUST CANON', color: '#a78bfa' },
  ];

  let curX = 20;
  for (let repeat = 0; repeat < 4; repeat++) {
    for (const b of banners) {
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, curX, 64);
      curX += ctx.measureText(b.text).width + 36;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

export const CricketStadium3D: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'broadcast' | 'batsman' | 'hawkEye' | 'topDown' | 'stumpCam' | 'drone'>('broadcast');
  const [bowlerType, setBowlerType] = useState<'pace' | 'spin' | 'yorker'>('pace');
  const [shotType, setShotType] = useState<'coverDrive' | 'pullShot' | 'wicket' | 'straightDrive' | 'upperCut'>('coverDrive');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'twilight' | 'night'>('night');
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [ballSpeed, setBallSpeed] = useState<number>(142);
  const [ballPhase, setBallPhase] = useState<'bowled' | 'hit' | 'idle'>('idle');
  const [crowdFlashes, setCrowdFlashes] = useState<boolean>(true);

  const animationIdRef = useRef<number | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const batsmanGroupRef = useRef<THREE.Group | null>(null);
  const bowlerGroupRef = useRef<THREE.Group | null>(null);
  const stumpsGroupRef = useRef<THREE.Group | null>(null);
  const jumbotronScreenRef = useRef<THREE.Mesh | null>(null);

  const tRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 540;

    // ── 1. Scene & Environment Lighting ──────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const skyConfig = {
      day: {
        bg: 0x87ceeb,
        fog: 0x93c5fd,
        fogDensity: 0.0025,
        ambientColor: 0xffffff,
        ambientIntensity: 1.4,
        sunColor: 0xfffbeb,
        sunIntensity: 2.8,
        sunPos: [80, 100, 50] as [number, number, number],
      },
      twilight: {
        bg: 0x1e1136,
        fog: 0x311a4f,
        fogDensity: 0.004,
        ambientColor: 0xffa585,
        ambientIntensity: 0.7,
        sunColor: 0xf97316,
        sunIntensity: 1.9,
        sunPos: [90, 30, -60] as [number, number, number],
      },
      night: {
        bg: 0x050414,
        fog: 0x07061d,
        fogDensity: 0.005,
        ambientColor: 0x818cf8,
        ambientIntensity: 0.45,
        sunColor: 0x38bdf8,
        sunIntensity: 0.9,
        sunPos: [30, 80, 30] as [number, number, number],
      },
    };
    const sky = skyConfig[timeOfDay];
    scene.background = new THREE.Color(sky.bg);
    scene.fog = new THREE.FogExp2(sky.fog, sky.fogDensity);

    // ── 2. Camera Setup ──────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1400);
    camera.position.set(0, 32, 62);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // ── 3. High-Quality WebGL Renderer ────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = timeOfDay === 'day' ? 1.15 : timeOfDay === 'twilight' ? 1.05 : 0.95;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── 4. Dynamic Stadium Lighting & Shadows ────────────────────────────────
    const ambientLight = new THREE.AmbientLight(sky.ambientColor, sky.ambientIntensity);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(sky.sunColor, sky.sunIntensity);
    mainSun.position.set(...sky.sunPos);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 2048;
    mainSun.shadow.mapSize.height = 2048;
    mainSun.shadow.bias = -0.0003;
    mainSun.shadow.camera.near = 1;
    mainSun.shadow.camera.far = 280;
    mainSun.shadow.camera.left = -65;
    mainSun.shadow.camera.right = 65;
    mainSun.shadow.camera.top = 65;
    mainSun.shadow.camera.bottom = -65;
    scene.add(mainSun);

    // ── 5. 4 Corner Floodlight Towers with Volumetric Cones ──────────────────
    const floodlightPositions = [
      { x: 58, z: 58, rotY: -Math.PI * 0.75 },
      { x: -58, z: 58, rotY: -Math.PI * 0.25 },
      { x: 58, z: -58, rotY: Math.PI * 0.75 },
      { x: -58, z: -58, rotY: Math.PI * 0.25 },
    ];

    floodlightPositions.forEach((pos) => {
      // Lattice Steel Pylon Tower
      const towerMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
      const towerGeo = new THREE.CylinderGeometry(0.35, 0.9, 78, 8);
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(pos.x, 39, pos.z);
      tower.castShadow = true;
      scene.add(tower);

      // Floodlight Bank Head
      const headGeo = new THREE.BoxGeometry(7, 3.5, 2.5);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(pos.x, 78, pos.z);
      head.lookAt(0, 10, 0);
      scene.add(head);

      // Glowing Multi-Lamp Halogen Matrix
      const lampArrayGeo = new THREE.PlaneGeometry(6.4, 3);
      const lampArrayMat = new THREE.MeshBasicMaterial({
        color: timeOfDay === 'day' ? 0xcccccc : 0xfffbeb,
        side: THREE.DoubleSide,
      });
      const lampArray = new THREE.Mesh(lampArrayGeo, lampArrayMat);
      lampArray.position.set(0, 0, 1.3);
      head.add(lampArray);

      // Night & Twilight Spotlights with Volumetric Cones
      if (timeOfDay !== 'day') {
        const spot = new THREE.SpotLight(0xfef08a, 3.2, 190, Math.PI / 5, 0.45, 1.2);
        spot.position.set(pos.x, 78, pos.z);
        spot.target.position.set(0, 0, 0);
        scene.add(spot);
        scene.add(spot.target);

        // Volumetric Light Cone
        const coneGeo = new THREE.CylinderGeometry(1.5, 28, 76, 24, 1, true);
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0xfef9c3,
          transparent: true,
          opacity: timeOfDay === 'night' ? 0.055 : 0.035,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(pos.x * 0.5, 39, pos.z * 0.5);
        cone.lookAt(0, 0, 0);
        cone.rotateX(Math.PI / 2);
        scene.add(cone);
      }
    });

    // ── 6. Realistic Procedural Turf Ground (Oval) ───────────────────────────
    const turfTexture = createTurfTexture();
    const groundGeo = new THREE.CylinderGeometry(49, 49, 0.6, 96);
    const groundMat = new THREE.MeshStandardMaterial({
      map: turfTexture,
      roughness: 0.88,
      metalness: 0.04,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── 7. LED Digital Sponsor Perimeter Ribbon Hoarding ─────────────────────
    const ledTexture = createLedBoardTexture();
    const ledBoardGeo = new THREE.CylinderGeometry(47.2, 47.2, 0.95, 128, 1, true);
    const ledBoardMat = new THREE.MeshBasicMaterial({
      map: ledTexture,
      side: THREE.DoubleSide,
    });
    const ledBoard = new THREE.Mesh(ledBoardGeo, ledBoardMat);
    ledBoard.position.y = 0.47;
    scene.add(ledBoard);

    // Boundary Rope
    const ropeGeo = new THREE.TorusGeometry(46.8, 0.14, 8, 128);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.x = Math.PI / 2;
    rope.position.y = 0.12;
    scene.add(rope);

    // 30-Yard Fielding Restriction Circle
    const innerRingGeo = new THREE.TorusGeometry(23.2, 0.07, 8, 96);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.75,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.08;
    scene.add(innerRing);

    // ── 8. Weathered Clay Pitch Strip (22 Yards) ─────────────────────────────
    const pitchTexture = createPitchTexture();
    const pitchGeo = new THREE.BoxGeometry(3.66, 0.14, 20.12);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: pitchTexture,
      roughness: 0.94,
      metalness: 0.02,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = 0.07;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // ── 9. Sight Screens at Both Ends ────────────────────────────────────────
    const createSightScreen = (zPos: number) => {
      const group = new THREE.Group();
      // Screen frame
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const frame = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 0.3), frameMat);
      frame.position.y = 2.8;
      group.add(frame);
      // White/Black Slats (White for pink/red ball)
      const slatMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
      const screen = new THREE.Mesh(new THREE.BoxGeometry(9.4, 4.4, 0.35), slatMat);
      screen.position.y = 2.8;
      group.add(screen);
      // Wheeled Legs
      const legMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 8), legMat);
      leg1.position.set(-3.5, 1.5, 0);
      group.add(leg1);
      const leg2 = leg1.clone();
      leg2.position.set(3.5, 1.5, 0);
      group.add(leg2);

      group.position.set(0, 0, zPos);
      return group;
    };
    scene.add(createSightScreen(47.5));
    scene.add(createSightScreen(-47.5));

    // ── 10. Stumps + Bails ───────────────────────────────────────────────────
    const createWickets = (zPos: number) => {
      const group = new THREE.Group();
      const stumpPositions = [-0.28, 0, 0.28];
      stumpPositions.forEach((xOff) => {
        const sGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12);
        const sMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
        const stump = new THREE.Mesh(sGeo, sMat);
        stump.position.set(xOff, 0.36, zPos);
        stump.castShadow = true;
        group.add(stump);
      });
      // 2 Bails
      [-0.14, 0.14].forEach((xOff) => {
        const bGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8);
        const bMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });
        const bail = new THREE.Mesh(bGeo, bMat);
        bail.position.set(xOff, 0.74, zPos);
        bail.rotation.z = Math.PI / 2;
        group.add(bail);
      });
      return group;
    };
    const battingStumps = createWickets(10.06);
    scene.add(battingStumps);
    stumpsGroupRef.current = battingStumps;
    scene.add(createWickets(-10.06));

    // ── 11. Batsman Model with Willow Bat, Helmet, and Pads ──────────────────
    const batsmanGroup = new THREE.Group();
    // Torso / Jersey
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.36, 1.15, 8, 16), torsoMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    batsmanGroup.add(torso);

    // Helmet with Visor Grill
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.6 });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), helmetMat);
    helmet.position.y = 1.98;
    helmet.castShadow = true;
    batsmanGroup.add(helmet);

    const grillMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95 });
    const grill = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.018, 4, 16, Math.PI), grillMat);
    grill.position.set(0, 1.9, 0.22);
    grill.rotation.x = Math.PI / 2;
    batsmanGroup.add(grill);

    // Cricket Bat
    const batGroup = new THREE.Group();
    // Cane Handle
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8), handleMat);
    handle.position.y = 0.55;
    batGroup.add(handle);
    // Willow Blade
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.4 });
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.62, 0.09), bladeMat);
    blade.position.y = 0.05;
    blade.castShadow = true;
    batGroup.add(blade);
    // Batting gloves
    const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), gloveMat);
    glove.position.set(0, 0.52, 0);
    batGroup.add(glove);

    batGroup.position.set(0.55, 1.1, 0.15);
    batGroup.rotation.z = -0.35;
    batsmanGroup.add(batGroup);

    // Batting Pads
    const padMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
    [-0.18, 0.18].forEach((xOff) => {
      const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.65, 8), padMat);
      pad.position.set(xOff, 0.32, 0.12);
      pad.castShadow = true;
      batsmanGroup.add(pad);
    });

    batsmanGroup.position.set(0.35, 0, 9.2);
    batsmanGroup.rotation.y = Math.PI;
    scene.add(batsmanGroup);
    batsmanGroupRef.current = batsmanGroup;

    // ── 12. Bowler Model with Run-Up Momentum ────────────────────────────────
    const bowlerGroup = new THREE.Group();
    const bTorso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 1.1, 8, 16), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    bTorso.position.y = 1.05;
    bTorso.castShadow = true;
    bowlerGroup.add(bTorso);

    const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    bHead.position.y = 1.85;
    bowlerGroup.add(bHead);

    const bArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.72, 8), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
    bArm.position.set(0.42, 1.5, 0);
    bArm.rotation.z = -0.85;
    bowlerGroup.add(bArm);

    bowlerGroup.position.set(0, 0, -9.8);
    scene.add(bowlerGroup);
    bowlerGroupRef.current = bowlerGroup;

    // ── 13. Multi-Tier Stadium Bowl with Cantilever Canopy Roof ───────────────
    const standColor = timeOfDay === 'night' ? 0x1e1b4b : timeOfDay === 'twilight' ? 0x2e1065 : 0x475569;
    const numBays = 20;

    for (let i = 0; i < numBays; i++) {
      const angle = (i / numBays) * Math.PI * 2;
      const bayRadius = 59;
      const bayGroup = new THREE.Group();

      // Concrete Tier Rake Bay
      const bayGeo = new THREE.BoxGeometry(16, 14, 8);
      const bayMat = new THREE.MeshStandardMaterial({ color: standColor, roughness: 0.8, metalness: 0.1 });
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.y = 7;
      bay.castShadow = true;
      bay.receiveShadow = true;
      bayGroup.add(bay);

      // Colorful Spectator Seat Rows
      const seatPalette = [0xec4899, 0xa855f7, 0x06b6d4, 0x10b981, 0xf59e0b];
      for (let s = 0; s < 4; s++) {
        const rowGeo = new THREE.BoxGeometry(14, 0.45, 1.2);
        const rowMat = new THREE.MeshStandardMaterial({ color: seatPalette[(i + s) % seatPalette.length], roughness: 0.7 });
        const row = new THREE.Mesh(rowGeo, rowMat);
        row.position.set(0, 2 + s * 3, -2 + s * 0.4);
        bayGroup.add(row);
      }

      // Cantilever Canopy Roof Truss (Overhang over seats)
      const roofGeo = new THREE.BoxGeometry(15.5, 0.5, 10);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0, 14.5, -2);
      roof.rotation.x = 0.1;
      roof.castShadow = true;
      bayGroup.add(roof);

      bayGroup.position.set(Math.sin(angle) * bayRadius, 0, Math.cos(angle) * bayRadius);
      bayGroup.lookAt(0, 0, 0);
      scene.add(bayGroup);
    }

    // ── 14. Modern Pavilion Building & Jumbotron ──────────────────────────────
    // 3D Pavilion at North End
    const pavilionGroup = new THREE.Group();
    const pavBase = new THREE.Mesh(new THREE.BoxGeometry(32, 18, 12), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 }));
    pavBase.position.y = 9;
    pavilionGroup.add(pavBase);

    // Balconies & Glass Corporate Boxes
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.65 });
    const glassBox = new THREE.Mesh(new THREE.BoxGeometry(28, 4.5, 1), glassMat);
    glassBox.position.set(0, 13, 6.1);
    pavilionGroup.add(glassBox);

    pavilionGroup.position.set(0, 0, -68);
    scene.add(pavilionGroup);

    // Jumbotron Big Screen Display
    const jumbotronGroup = new THREE.Group();
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 1), new THREE.MeshStandardMaterial({ color: 0x020617 }));
    jumbotronGroup.add(frameMesh);

    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const sCtx = screenCanvas.getContext('2d')!;
    sCtx.fillStyle = '#090d16';
    sCtx.fillRect(0, 0, 512, 256);
    sCtx.fillStyle = '#06b6d4';
    sCtx.font = 'bold 36px monospace';
    sCtx.fillText('AURA LIVE TELEMETRY', 30, 60);
    sCtx.fillStyle = '#f43f5e';
    sCtx.font = 'bold 54px monospace';
    sCtx.fillText('HAWK-EYE 3D', 30, 130);
    sCtx.fillStyle = '#38bdf8';
    sCtx.font = '24px monospace';
    sCtx.fillText('BALL SPEED: 142 KM/H • 60 FPS', 30, 190);

    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(16.5, 7.8), new THREE.MeshBasicMaterial({ map: screenTex }));
    screenFace.position.z = 0.55;
    jumbotronGroup.add(screenFace);
    jumbotronScreenRef.current = screenFace;

    jumbotronGroup.position.set(0, 25, 68);
    jumbotronGroup.lookAt(0, 10, 0);
    scene.add(jumbotronGroup);

    // ── 15. Dynamic City Skyline Background ──────────────────────────────────
    const skylineGroup = new THREE.Group();
    const buildingColors = [0x0f172a, 0x1e1b4b, 0x020617, 0x172554, 0x1e293b];
    for (let b = 0; b < 75; b++) {
      const bAngle = Math.random() * Math.PI * 2;
      const bDist = 110 + Math.random() * 90;
      const bW = 5 + Math.random() * 9;
      const bH = 20 + Math.random() * 55;
      const bD = 5 + Math.random() * 9;

      const bGeo = new THREE.BoxGeometry(bW, bH, bD);
      const bMat = new THREE.MeshStandardMaterial({
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
        roughness: 0.5,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(Math.sin(bAngle) * bDist, bH / 2, Math.cos(bAngle) * bDist);
      skylineGroup.add(building);
    }
    scene.add(skylineGroup);

    // Stars in Night & Twilight
    if (timeOfDay !== 'day') {
      const starGeo = new THREE.BufferGeometry();
      const starCoords = new Float32Array(2500 * 3);
      for (let i = 0; i < 2500; i++) {
        starCoords[i * 3] = (Math.random() - 0.5) * 800;
        starCoords[i * 3 + 1] = 50 + Math.random() * 320;
        starCoords[i * 3 + 2] = (Math.random() - 0.5) * 800;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.65,
        transparent: true,
        opacity: timeOfDay === 'night' ? 0.85 : 0.45,
      });
      scene.add(new THREE.Points(starGeo, starMat));
    }

    // ── 16. Cricket Ball with Raised White Seam & Hawk-Eye Trail ─────────────
    const ballGeo = new THREE.SphereGeometry(0.26, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.15,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 1.6, -9.8);
    ball.castShadow = true;
    scene.add(ball);
    ballRef.current = ball;

    // Raised Seam
    const seamMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.27, 0.015, 6, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    ball.add(seamMesh);

    // Glowing 60-Point Hawk-Eye Trajectory Trail
    const trailPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) trailPoints.push(new THREE.Vector3(0, 0, 0));
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: showTrajectory ? 0.9 : 0,
    });
    const trajectoryLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // Pitch Bounce Impact Decal
    const impactRing = new THREE.Mesh(
      new THREE.RingGeometry(0.12, 0.45, 32),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    impactRing.rotation.x = -Math.PI / 2;
    impactRing.position.set(0, 0.15, 0);
    scene.add(impactRing);

    // ── 17. 9 Authentic Fielder Silhouettes ──────────────────────────────────
    const fielderCoords = [
      { x: 18, z: 32, name: 'Long-on' },
      { x: -18, z: 32, name: 'Long-off' },
      { x: 34, z: 12, name: 'Deep Square Leg' },
      { x: -34, z: 12, name: 'Deep Cover' },
      { x: 28, z: -14, name: 'Third Man' },
      { x: -28, z: -14, name: 'Deep Fine Leg' },
      { x: 9, z: 4, name: 'Mid-on' },
      { x: -9, z: 4, name: 'Mid-off' },
      { x: 4, z: 7, name: 'Short Midwicket' },
    ];

    fielderCoords.forEach((fc) => {
      const fGroup = new THREE.Group();
      const fBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.9, 6, 12), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      fBody.position.y = 0.75;
      fBody.castShadow = true;
      fGroup.add(fBody);

      const fHead = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x92400e }));
      fHead.position.y = 1.48;
      fGroup.add(fHead);

      fGroup.position.set(fc.x, 0, fc.z);
      fGroup.lookAt(0, 0, 9);
      scene.add(fGroup);
    });

    // Wicketkeeper Crouched
    const wkGroup = new THREE.Group();
    const wkBody = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.75, 8, 12), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
    wkBody.position.y = 0.55;
    wkBody.castShadow = true;
    wkGroup.add(wkBody);

    const wkHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), new THREE.MeshStandardMaterial({ color: 0x92400e }));
    wkHead.position.y = 1.25;
    wkGroup.add(wkHead);

    [-0.32, 0.32].forEach((xOff) => {
      const glove = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
      glove.position.set(xOff, 0.55, -0.2);
      wkGroup.add(glove);
    });
    wkGroup.position.set(0, 0, 12.6);
    wkGroup.rotation.y = Math.PI;
    scene.add(wkGroup);

    // ── 18. Main Animation & Physics Loop ────────────────────────────────────
    let running = true;
    const clock = clockRef.current;
    clock.start();

    const animate = () => {
      if (!running) return;
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate LED Sponsor Ribbon scrolling
      ledTexture.offset.x -= 0.0015;

      // Random Spectator Camera Flashes
      if (crowdFlashes && Math.random() < 0.04) {
        const flashAngle = Math.random() * Math.PI * 2;
        const flashR = 56 + Math.random() * 5;
        const flashY = 3 + Math.random() * 8;
        // Temporary light flash
        const flashLight = new THREE.PointLight(0xffffff, 4, 15);
        flashLight.position.set(Math.sin(flashAngle) * flashR, flashY, Math.cos(flashAngle) * flashR);
        scene.add(flashLight);
        setTimeout(() => scene.remove(flashLight), 60);
      }

      // Ball Trajectory & Physics
      if (isPlaying && ballRef.current) {
        tRef.current += bowlerType === 'spin' ? 0.014 : 0.021;
        if (tRef.current > 2.4) tRef.current = 0;

        const t = tRef.current;
        let x = 0;
        let y = 1.6;
        let z = -9.8 + t * 14;

        if (t < 1.0) {
          // Phase 1: Ball Bowled down pitch
          setBallPhase('bowled');
          const bounceT = t;

          if (bowlerType === 'yorker') {
            y = 1.6 - 1.55 * bounceT;
            x = 0.1 * Math.sin(bounceT * 2);
            z = -9.8 + bounceT * 19.8;
          } else {
            y = 2.0 - 2.8 * bounceT + 3.4 * Math.sin(bounceT * Math.PI);
            x = bowlerType === 'spin' ? Math.sin(bounceT * 5) * 1.1 : 0.18 * Math.sin(bounceT * 2);
          }

          // Pitch impact splash
          if (bounceT > 0.42 && bounceT < 0.6) {
            impactRing.position.set(x, 0.16, z);
            (impactRing.material as THREE.MeshBasicMaterial).opacity = 0.85;
          } else {
            (impactRing.material as THREE.MeshBasicMaterial).opacity = 0;
          }

          setBallSpeed(bowlerType === 'pace' ? 142 : bowlerType === 'spin' ? 86 : 148);

          // Reset wickets tilt
          if (stumpsGroupRef.current) {
            stumpsGroupRef.current.rotation.x = 0;
            stumpsGroupRef.current.position.y = 0;
          }

          // Batsman stance backlift
          if (batsmanGroupRef.current) {
            batsmanGroupRef.current.rotation.y = Math.PI + Math.sin(bounceT * 2) * 0.06;
          }
        } else {
          // Phase 2: Post-Bat Trajectory
          setBallPhase('hit');
          const hitT = t - 1.0;

          if (shotType === 'coverDrive') {
            x = 0.3 + hitT * 25;
            y = Math.max(0.12, 1.1 + 9.5 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.7);
            z = 3.5 + hitT * 22;
          } else if (shotType === 'pullShot') {
            x = -hitT * 29;
            y = Math.max(0.12, 1.1 + 8.2 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.4);
            z = 3.5 + hitT * 15;
          } else if (shotType === 'straightDrive') {
            x = 0;
            y = Math.max(0.12, 0.9 + 4.2 * Math.sin(hitT * Math.PI * 0.9) - hitT * 1.1);
            z = -9.8 + hitT * -36;
          } else if (shotType === 'upperCut') {
            x = hitT * 19;
            y = Math.max(0.12, 1.2 + 13.5 * Math.sin(hitT * Math.PI * 0.72) - hitT * 2.2);
            z = 3.5 - hitT * 21;
          } else {
            // Wicket Dismantled!
            x = 0;
            y = 0.45;
            z = 10.06;
            if (stumpsGroupRef.current) {
              stumpsGroupRef.current.rotation.x = -Math.min(hitT * 4, 1.2);
              stumpsGroupRef.current.position.y = Math.sin(hitT * 3) * 0.4;
            }
          }

          setBallSpeed(
            shotType === 'coverDrive' ? 158 : shotType === 'pullShot' ? 152 :
            shotType === 'straightDrive' ? 164 : shotType === 'upperCut' ? 144 : 0
          );

          // Batsman swing follow-through
          if (batsmanGroupRef.current) {
            const swing = Math.min(hitT * 3.5, 1.3);
            batsmanGroupRef.current.rotation.y = Math.PI - swing * 0.85;
          }
        }

        ballRef.current.position.set(x, Math.max(0.15, y), z);
        ballRef.current.rotation.x += delta * 18;
        ballRef.current.rotation.z += delta * 10;

        // Update glowing trail line
        if (trajectoryLineRef.current && showTrajectory) {
          const positions = trajectoryLineRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = positions.length - 3; i >= 3; i -= 3) {
            positions[i] = positions[i - 3];
            positions[i + 1] = positions[i - 2];
            positions[i + 2] = positions[i - 1];
          }
          positions[0] = x;
          positions[1] = Math.max(0.15, y);
          positions[2] = z;
          trajectoryLineRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Smooth Camera Transitions
      if (cameraRef.current) {
        const cam = cameraRef.current;
        if (cameraView === 'broadcast') {
          cam.position.lerp(new THREE.Vector3(0, 28, 56), 0.045);
          cam.lookAt(0, 2, 0);
        } else if (cameraView === 'batsman') {
          cam.position.lerp(new THREE.Vector3(1.6, 2.9, 12.5), 0.045);
          cam.lookAt(0, 1.4, -8);
        } else if (cameraView === 'hawkEye') {
          cam.position.lerp(new THREE.Vector3(22, 14, 0), 0.045);
          cam.lookAt(0, 1.2, 2);
        } else if (cameraView === 'topDown') {
          cam.position.lerp(new THREE.Vector3(0, 74, 0.1), 0.045);
          cam.lookAt(0, 0, 0);
        } else if (cameraView === 'stumpCam') {
          cam.position.lerp(new THREE.Vector3(0, 0.45, 10.7), 0.045);
          cam.lookAt(0, 1.6, -10);
        } else if (cameraView === 'drone') {
          const droneAngle = elapsed * 0.28;
          const dronePos = new THREE.Vector3(Math.sin(droneAngle) * 44, 38, Math.cos(droneAngle) * 44);
          cam.position.lerp(dronePos, 0.045);
          cam.lookAt(0, 0, 0);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      cameraRef.current.aspect = w / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      renderer.dispose();
    };
  }, [isPlaying, cameraView, bowlerType, shotType, timeOfDay, showTrajectory, crowdFlashes]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Box className="w-4 h-4" />
            <span>{t('stadium.title')}</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold animate-pulse">LIVE 60 FPS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('stadium.subtitle')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            {t('stadium.desc')}
          </p>
        </div>

        {/* Play & Reset Controls */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 p-1.5 rounded-xl">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? t('stadium.pause') : t('stadium.play')}</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              tRef.current = 0;
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Ball Loop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Viewport Container & Control HUD */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#060414]">
        <div ref={containerRef} className="w-full h-[540px]" />

        {/* Floating Top Overlay HUD */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 pointer-events-auto shadow-lg flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              Cam:
            </span>
            {[
              { key: 'broadcast' as const, label: t('stadium.cam_broadcast') },
              { key: 'batsman' as const, label: t('stadium.cam_batter') },
              { key: 'hawkEye' as const, label: t('stadium.cam_hawkeye') },
              { key: 'topDown' as const, label: t('stadium.cam_topdown') },
              { key: 'stumpCam' as const, label: t('stadium.cam_stump') },
              { key: 'drone' as const, label: t('stadium.cam_drone') },
            ].map((cam) => (
              <button
                key={cam.key}
                onClick={() => {
                  soundFX.playClick();
                  setCameraView(cam.key);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  cameraView === cam.key ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>

          {/* Telemetry HUD */}
          <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-lg pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>60 FPS</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{ballSpeed} km/h</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span className={`font-bold ${
              ballPhase === 'bowled' ? 'text-cyan-400' : ballPhase === 'hit' ? 'text-pink-400' : 'text-slate-500'
            }`}>
              {ballPhase === 'bowled' ? t('stadium.in_flight') : ballPhase === 'hit' ? t('stadium.contact_made') : t('stadium.ready')}
            </span>
          </div>
        </div>

        {/* Floating Bottom Delivery & Shot Selectors */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Delivery Type */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono px-1">{t('stadium.delivery')}</span>
            {[
              { key: 'pace' as const, label: t('stadium.del_seam') },
              { key: 'spin' as const, label: t('stadium.del_spin') },
              { key: 'yorker' as const, label: t('stadium.del_yorker') },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  soundFX.playClick();
                  setBowlerType(d.key);
                  tRef.current = 0;
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  bowlerType === d.key ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Shot Selection */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono px-1">{t('stadium.shot')}</span>
            {[
              { key: 'coverDrive' as const, label: t('stadium.shot_cover') },
              { key: 'pullShot' as const, label: t('stadium.shot_pull') },
              { key: 'straightDrive' as const, label: t('stadium.shot_straight') },
              { key: 'upperCut' as const, label: t('stadium.shot_upper') },
              { key: 'wicket' as const, label: t('stadium.shot_wicket') },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  if (s.key === 'wicket') {
                    soundFX.playSecurityAlert();
                  } else {
                    soundFX.playSuccess();
                  }
                  setShotType(s.key);
                  tRef.current = 0;
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  shotType === s.key ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Right Control Deck (Time of Day, Trajectory, Flash) */}
        <div className="absolute top-18 right-4 flex flex-col gap-2 pointer-events-auto">
          {/* Time of Day */}
          <div className="bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block px-1">{t('stadium.lighting')}</span>
            {[
              { key: 'day' as const, label: t('stadium.light_day'), icon: Sun },
              { key: 'twilight' as const, label: t('stadium.light_sunset'), icon: Sunset },
              { key: 'night' as const, label: t('stadium.light_night'), icon: Moon },
            ].map((tod) => {
              const Icon = tod.icon;
              return (
                <button
                  key={tod.key}
                  onClick={() => {
                    soundFX.playClick();
                    setTimeOfDay(tod.key);
                  }}
                  className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    timeOfDay === tod.key ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tod.label}</span>
                </button>
              );
            })}
          </div>

          {/* Trail Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setShowTrajectory(!showTrajectory);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showTrajectory
                ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-950/85 border-slate-800 text-slate-500'
            } backdrop-blur-md`}
          >
            <Eye className="w-3.5 h-3.5" />
            {t('stadium.trail')}
          </button>

          {/* Flash Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setCrowdFlashes(!crowdFlashes);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              crowdFlashes
                ? 'bg-purple-600/20 border-purple-500/40 text-purple-300'
                : 'bg-slate-950/85 border-slate-800 text-slate-500'
            } backdrop-blur-md`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t('stadium.flashes')}
          </button>
        </div>
      </div>

      {/* Physics Spec Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Magnus Aerodynamic Seam</span>
            <p className="text-xs text-slate-400 mt-0.5">Calculates lateral seam swing and drift vectors based on air density and release RPM.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Procedural Turf & Pitch</span>
            <p className="text-xs text-slate-400 mt-0.5">Dual 1024px canvas textures rendering lawn mower stripes, clay cracks, and spike scuffs.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Volumetric Floodlight Cones</span>
            <p className="text-xs text-slate-400 mt-0.5">4 steel lattice pylons with additive blending volumetric cones illuminating the ground.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Flying Bails & Wickets Physics</span>
            <p className="text-xs text-slate-400 mt-0.5">Dynamic rotational inertia and gravity equations on bails when wickets are dismantled.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
