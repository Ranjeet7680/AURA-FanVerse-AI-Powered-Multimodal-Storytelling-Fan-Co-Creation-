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
  Eye,
  Camera,
  Globe2,
  ShieldAlert,
  Flame
} from 'lucide-react';
import {
  STADIUM_TRANSLATIONS,
  STADIUM_CAMERAS,
  STADIUM_BOWLING_STYLES,
  STADIUM_SHOTS
} from '../data/stadiumLocalization';
import { soundFX } from '../services/soundFX';

interface CricketStadium3DProps {
  selectedLang?: string;
  onSelectLang?: (lang: string) => void;
}

export const CricketStadium3D: React.FC<CricketStadium3DProps> = ({
  selectedLang = 'en',
  onSelectLang
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentLang, setCurrentLang] = useState<string>(selectedLang);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraViewKey, setCameraViewKey] = useState<string>('broadcast');
  const [bowlerStyleKey, setBowlerStyleKey] = useState<string>('outswinger');
  const [shotTypeKey, setShotTypeKey] = useState<string>('coverDrive');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'twilight' | 'night'>('night');
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [ballSpeed, setBallSpeed] = useState<number>(145);
  const [ballPhase, setBallPhase] = useState<'bowled' | 'hit' | 'catch' | 'idle'>('idle');
  const [eventBanner, setEventBanner] = useState<string | null>(null);

  // Synchronize language prop
  useEffect(() => {
    if (selectedLang && selectedLang !== currentLang) {
      setCurrentLang(selectedLang);
    }
  }, [selectedLang]);

  const trans = STADIUM_TRANSLATIONS[currentLang] || STADIUM_TRANSLATIONS.en;
  const isRtl = currentLang === 'ar';

  const animationIdRef = useRef<number | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const batsmanGroupRef = useRef<THREE.Group | null>(null);
  const bowlerGroupRef = useRef<THREE.Group | null>(null);
  const battingStumpsRef = useRef<THREE.Group | null>(null);
  const fielderDeepCoverRef = useRef<THREE.Group | null>(null);

  const tRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const handleLanguageSwitch = (langCode: string) => {
    soundFX.playClick();
    setCurrentLang(langCode);
    if (onSelectLang) {
      onSelectLang(langCode);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 540;

    // ── 1. Scene ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const skyConfigs = {
      day: { bg: 0x70b5f9, fog: 0x70b5f9, fogDensity: 0.002, ambient: 1.3, sunColor: 0xfff6e5, sunIntensity: 2.6 },
      twilight: { bg: 0x221138, fog: 0x221138, fogDensity: 0.004, ambient: 0.7, sunColor: 0xff6b42, sunIntensity: 1.6 },
      night: { bg: 0x040212, fog: 0x040212, fogDensity: 0.005, ambient: 0.45, sunColor: 0xdcb7ff, sunIntensity: 1.9 },
    };
    const sky = skyConfigs[timeOfDay];
    scene.background = new THREE.Color(sky.bg);
    scene.fog = new THREE.FogExp2(sky.fog, sky.fogDensity);

    // ── 2. Camera ──
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1400);
    camera.position.set(0, 26, 54);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // ── 3. Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = timeOfDay === 'day' ? 1.25 : 0.85;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── 4. Main Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, sky.ambient);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(sky.sunColor, sky.sunIntensity);
    sunLight.position.set(55, 85, 45);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -65;
    sunLight.shadow.camera.right = 65;
    sunLight.shadow.camera.top = 65;
    sunLight.shadow.camera.bottom = -65;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x4cd7f6, timeOfDay === 'night' ? 1.4 : 0.4);
    rimLight.position.set(-55, 65, -45);
    scene.add(rimLight);

    // ── 5. Steel Lattice Floodlight Towers (4 corners) ──
    const floodlightCoords = [
      { x: 56, z: 56 }, { x: -56, z: 56 }, { x: 56, z: -56 }, { x: -56, z: -56 }
    ];
    floodlightCoords.forEach((pos) => {
      // Main 4-column steel lattice tower
      const towerGroup = new THREE.Group();
      const mastHeight = 82;
      const legGeo = new THREE.CylinderGeometry(0.25, 0.4, mastHeight, 8);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x555566, metalness: 0.8, roughness: 0.3 });

      [-1.2, 1.2].forEach((lx) => {
        [-1.2, 1.2].forEach((lz) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, mastHeight / 2, lz);
          towerGroup.add(leg);
        });
      });

      // Horizontal cross braces
      for (let b = 10; b < mastHeight; b += 12) {
        const braceGeo = new THREE.BoxGeometry(2.6, 0.2, 2.6);
        const brace = new THREE.Mesh(braceGeo, legMat);
        brace.position.y = b;
        towerGroup.add(brace);
      }

      // Large head frame with 4x3 grid of lamps
      const headFrameGeo = new THREE.BoxGeometry(7, 4.5, 1.2);
      const headFrame = new THREE.Mesh(headFrameGeo, legMat);
      headFrame.position.set(0, mastHeight + 2, 0);
      headFrame.lookAt(0, 0, 0);
      towerGroup.add(headFrame);

      // Emissive Lamp Array
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          const lampGeo = new THREE.BoxGeometry(1.2, 1, 0.5);
          const lampMat = new THREE.MeshBasicMaterial({
            color: timeOfDay === 'night' ? 0xfffce0 : 0xdddddd
          });
          const lamp = new THREE.Mesh(lampGeo, lampMat);
          lamp.position.set(-2.2 + c * 1.5, mastHeight + 0.8 + r * 1.3, 0.4);
          lamp.lookAt(0, 0, 0);
          towerGroup.add(lamp);
        }
      }

      towerGroup.position.set(pos.x, 0, pos.z);
      scene.add(towerGroup);

      // Night Spotlight illumination
      if (timeOfDay !== 'day') {
        const spot = new THREE.SpotLight(0xfff8d6, 3.2, 200, Math.PI / 5.5, 0.45, 1);
        spot.position.set(pos.x, mastHeight, pos.z);
        spot.target.position.set(0, 1, 0);
        scene.add(spot);
        scene.add(spot.target);
      }
    });

    // ── 6. Realistic Turf Ground with Mowing Pattern ──
    const grassCanvas = document.createElement('canvas');
    grassCanvas.width = 512;
    grassCanvas.height = 512;
    const gCtx = grassCanvas.getContext('2d')!;
    const baseGreen = timeOfDay === 'night' ? '#091c13' : timeOfDay === 'twilight' ? '#113521' : '#196833';
    gCtx.fillStyle = baseGreen;
    gCtx.fillRect(0, 0, 512, 512);

    // Blades noise
    for (let i = 0; i < 9000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      const brightness = Math.random() > 0.5 ? 22 : -18;
      const r = parseInt(baseGreen.slice(1, 3), 16) + brightness;
      const g = parseInt(baseGreen.slice(3, 5), 16) + brightness + Math.floor(Math.random() * 12);
      const b = parseInt(baseGreen.slice(5, 7), 16) + brightness;
      gCtx.fillStyle = `rgb(${Math.max(0, Math.min(255, r))},${Math.max(0, Math.min(255, g))},${Math.max(0, Math.min(255, b))})`;
      gCtx.fillRect(gx, gy, 1, Math.random() * 3 + 1);
    }
    // Subtle circular concentric lawn mower rings
    for (let cr = 10; cr < 250; cr += 20) {
      gCtx.strokeStyle = 'rgba(255,255,255,0.025)';
      gCtx.lineWidth = 10;
      gCtx.beginPath();
      gCtx.arc(256, 256, cr, 0, Math.PI * 2);
      gCtx.stroke();
    }
    const grassTexture = new THREE.CanvasTexture(grassCanvas);
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(6, 6);

    const groundGeo = new THREE.CylinderGeometry(49, 49, 0.6, 96);
    const groundMat = new THREE.MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.88,
      metalness: 0.02
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    scene.add(ground);

    // Boundary Rope
    const boundaryRopeGeo = new THREE.TorusGeometry(47, 0.16, 8, 128);
    const boundaryRopeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xec4899,
      emissiveIntensity: 0.4
    });
    const boundaryRope = new THREE.Mesh(boundaryRopeGeo, boundaryRopeMat);
    boundaryRope.rotation.x = Math.PI / 2;
    boundaryRope.position.y = 0.16;
    scene.add(boundaryRope);

    // 30-Yard Circle
    const innerRingGeo = new THREE.TorusGeometry(23.5, 0.08, 8, 96);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x4cd7f6,
      emissive: 0x4cd7f6,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.75
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.09;
    scene.add(innerRing);

    // ── 7. Worn Pitch Strip (22 Yards) ──
    const pitchCanvas = document.createElement('canvas');
    pitchCanvas.width = 256;
    pitchCanvas.height = 512;
    const pCtx = pitchCanvas.getContext('2d')!;
    const pitchBase = timeOfDay === 'day' ? '#c8aa62' : '#5c4a35';
    pCtx.fillStyle = pitchBase;
    pCtx.fillRect(0, 0, 256, 512);

    // Pitch cracks and grass tufts on edges
    for (let i = 0; i < 350; i++) {
      const px = Math.random() * 256;
      const py = Math.random() * 512;
      pCtx.fillStyle = `rgba(70,50,25,${0.12 + Math.random() * 0.18})`;
      pCtx.fillRect(px, py, Math.random() * 4 + 1, Math.random() * 2 + 1);
    }
    // Foot marks at popping creases
    [85, 425].forEach((cy) => {
      for (let f = 0; f < 80; f++) {
        pCtx.fillStyle = `rgba(50,35,15,${0.15 + Math.random() * 0.25})`;
        pCtx.beginPath();
        pCtx.arc(128 + (Math.random() - 0.5) * 85, cy + (Math.random() - 0.5) * 55, Math.random() * 6 + 2, 0, Math.PI * 2);
        pCtx.fill();
      }
    });
    const pitchTexture = new THREE.CanvasTexture(pitchCanvas);
    const pitchGeo = new THREE.BoxGeometry(3.66, 0.12, 20.12);
    const pitchMat = new THREE.MeshStandardMaterial({
      map: pitchTexture,
      roughness: 0.94,
      metalness: 0.01
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = 0.08;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Pitch Crease Markings
    const creaseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const createCrease = (w: number, d: number, x: number, z: number) => {
      const geo = new THREE.PlaneGeometry(w, d);
      const mesh = new THREE.Mesh(geo, creaseMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.16, z);
      return mesh;
    };
    scene.add(createCrease(3.66, 0.06, 0, 8.8));    // Batting popping
    scene.add(createCrease(3.66, 0.06, 0, 10.06));  // Batting bowling
    scene.add(createCrease(0.06, 1.26, -1.32, 9.43));
    scene.add(createCrease(0.06, 1.26, 1.32, 9.43));
    scene.add(createCrease(3.66, 0.06, 0, -8.8));   // Bowling popping
    scene.add(createCrease(3.66, 0.06, 0, -10.06)); // Bowling bowling
    scene.add(createCrease(0.06, 1.26, -1.32, -9.43));
    scene.add(createCrease(0.06, 1.26, 1.32, -9.43));

    // ── 8. Stumps & Bails ──
    const createWicketStumps = (zPos: number) => {
      const group = new THREE.Group();
      [-0.28, 0, 0.28].forEach((xOff) => {
        const stumpGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12);
        const stumpMat = new THREE.MeshStandardMaterial({ color: 0xf5f0dc, roughness: 0.4 });
        const stump = new THREE.Mesh(stumpGeo, stumpMat);
        stump.position.set(xOff, 0.36, zPos);
        stump.castShadow = true;
        group.add(stump);
      });
      [-0.14, 0.14].forEach((xOff) => {
        const bailGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8);
        const bailMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8 });
        const bail = new THREE.Mesh(bailGeo, bailMat);
        bail.position.set(xOff, 0.74, zPos);
        bail.rotation.z = Math.PI / 2;
        group.add(bail);
      });
      return group;
    };
    const battingStumps = createWicketStumps(10.06);
    scene.add(battingStumps);
    battingStumpsRef.current = battingStumps;
    scene.add(createWicketStumps(-10.06));

    // ── 9. Sight Screens at both Ends ──
    [-36, 36].forEach((sz) => {
      const screenGroup = new THREE.Group();
      const frameGeo = new THREE.BoxGeometry(8.5, 5, 0.4);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.5 });
      const screen = new THREE.Mesh(frameGeo, frameMat);
      screen.position.y = 3;
      screenGroup.add(screen);

      // Stand posts
      [-3.5, 3.5].forEach((sx) => {
        const postGeo = new THREE.CylinderGeometry(0.15, 0.15, 3, 8);
        const post = new THREE.Mesh(postGeo, frameMat);
        post.position.set(sx, 1.5, 0);
        screenGroup.add(post);
      });
      screenGroup.position.set(0, 0, sz);
      scene.add(screenGroup);
    });

    // ── 10. Batsman Figure & Bat Model ──
    const batsmanGroup = new THREE.Group();
    const bodyGeo = new THREE.CapsuleGeometry(0.35, 1.2, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    batsmanGroup.add(body);

    // Helmet with peak & grill
    const helmetGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.7, roughness: 0.2 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 2.0;
    helmet.castShadow = true;
    batsmanGroup.add(helmet);

    const grillGeo = new THREE.TorusGeometry(0.16, 0.015, 4, 12, Math.PI);
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9 });
    const grill = new THREE.Mesh(grillGeo, grillMat);
    grill.position.set(0, 1.92, 0.22);
    grill.rotation.x = Math.PI / 2;
    batsmanGroup.add(grill);

    // Cricket Bat with Handle and Blade
    const batGroup = new THREE.Group();
    const batHandleGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.55, 8);
    const batHandleMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.7 });
    const batHandle = new THREE.Mesh(batHandleGeo, batHandleMat);
    batHandle.position.y = 0.55;
    batGroup.add(batHandle);

    const batBladeGeo = new THREE.BoxGeometry(0.13, 0.6, 0.07);
    const batBladeMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.4 });
    const batBlade = new THREE.Mesh(batBladeGeo, batBladeMat);
    batBlade.position.y = 0.15;
    batBlade.castShadow = true;
    batGroup.add(batBlade);

    batGroup.position.set(0.4, 0.8, 0.2);
    batGroup.rotation.z = -0.25;
    batsmanGroup.add(batGroup);

    // Leg Pads
    const padGeo = new THREE.CylinderGeometry(0.14, 0.11, 0.65, 8);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5 });
    [-0.18, 0.18].forEach((xOff) => {
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(xOff, 0.32, 0.1);
      pad.castShadow = true;
      batsmanGroup.add(pad);
    });

    batsmanGroup.position.set(0.3, 0, 9.2);
    batsmanGroup.rotation.y = Math.PI;
    scene.add(batsmanGroup);
    batsmanGroupRef.current = batsmanGroup;

    // ── 11. Bowler Model with Arm ──
    const bowlerGroup = new THREE.Group();
    const bowlerBody = new THREE.CapsuleGeometry(0.32, 1.1, 8, 16);
    const bowlerMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const bowlerMesh = new THREE.Mesh(bowlerBody, bowlerMat);
    bowlerMesh.position.y = 1.0;
    bowlerMesh.castShadow = true;
    bowlerGroup.add(bowlerMesh);

    const bowlerHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x8b5e3c })
    );
    bowlerHead.position.y = 1.82;
    bowlerGroup.add(bowlerHead);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.75, 8);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const bowlArm = new THREE.Mesh(armGeo, armMat);
    bowlArm.position.set(0.4, 1.5, 0);
    bowlerGroup.add(bowlArm);

    bowlerGroup.position.set(0, 0, -10.06);
    scene.add(bowlerGroup);
    bowlerGroupRef.current = bowlerGroup;

    // ── 12. Grandstand Tiers with Canopy Roofs ──
    const standSections = 18;
    const standRadius = 59;
    const standGroup = new THREE.Group();

    for (let i = 0; i < standSections; i++) {
      const angle = (i / standSections) * Math.PI * 2;
      const singleStand = new THREE.Group();

      // Lower & Upper Deck Tiers
      const tierGeo = new THREE.BoxGeometry(16, 13, 7);
      const tierMat = new THREE.MeshStandardMaterial({
        color: timeOfDay === 'night' ? 0x181232 : 0x444458,
        roughness: 0.75
      });
      const tier = new THREE.Mesh(tierGeo, tierMat);
      tier.position.y = 6.5;
      singleStand.add(tier);

      // Seat Rows
      for (let r = 0; r < 4; r++) {
        const seatGeo = new THREE.BoxGeometry(14, 0.45, 1.1);
        const seatPalette = [0xec4899, 0xa855f7, 0x4cd7f6, 0x22c55e, 0xf59e0b];
        const seatMat = new THREE.MeshStandardMaterial({
          color: seatPalette[(i + r) % seatPalette.length],
          roughness: 0.85
        });
        const seat = new THREE.Mesh(seatGeo, seatMat);
        seat.position.set(0, 1 + r * 3, -2 + r * 0.4);
        singleStand.add(seat);
      }

      // Grandstand Modern Curved Canopy Roof
      const roofGeo = new THREE.BoxGeometry(17, 0.4, 10);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xefefef,
        metalness: 0.3,
        roughness: 0.4
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(0, 14.5, -1);
      roof.rotation.x = -0.15; // Slope inward towards field
      singleStand.add(roof);

      singleStand.position.set(
        Math.sin(angle) * standRadius,
        0,
        Math.cos(angle) * standRadius
      );
      singleStand.lookAt(0, 6, 0);
      standGroup.add(singleStand);
    }
    scene.add(standGroup);

    // ── 13. Dual Giant Scoreboards / Jumbotrons ──
    const createJumbotron = (x: number, z: number, yRot: number) => {
      const jGroup = new THREE.Group();
      const frameGeo = new THREE.BoxGeometry(18, 9, 0.8);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x111124, metalness: 0.6 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      jGroup.add(frame);

      // Screen Face with high-tech canvas display
      const scCanvas = document.createElement('canvas');
      scCanvas.width = 512;
      scCanvas.height = 256;
      const sCtx = scCanvas.getContext('2d')!;
      sCtx.fillStyle = '#060a1e';
      sCtx.fillRect(0, 0, 512, 256);
      sCtx.fillStyle = '#00f0ff';
      sCtx.font = 'bold 26px monospace';
      sCtx.fillText('AURA CRICKET CUP 2026', 70, 45);
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 36px Arial';
      sCtx.fillText('IND-W  184/4 (19.2)', 60, 110);
      sCtx.fillStyle = '#f59e0b';
      sCtx.font = 'bold 24px monospace';
      sCtx.fillText('BALL SPEED: ' + ballSpeed + ' km/h', 60, 160);
      sCtx.fillStyle = '#ec4899';
      sCtx.font = 'bold 22px Arial';
      sCtx.fillText('WIN EQUITY: IND-W 62% vs AUS-W 38%', 60, 215);

      const scTexture = new THREE.CanvasTexture(scCanvas);
      const screenGeo = new THREE.PlaneGeometry(17, 8);
      const screenMat = new THREE.MeshBasicMaterial({ map: scTexture });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.z = 0.45;
      jGroup.add(screen);

      jGroup.position.set(x, 22, z);
      jGroup.rotation.y = yRot;
      return jGroup;
    };
    scene.add(createJumbotron(0, -68, 0));
    scene.add(createJumbotron(0, 68, Math.PI));

    // ── 14. 24 Boundary LED Sponsor Boards ──
    const sponsorSlogans = [
      'AURA FanVerse', '3D Hawk-Eye AI', 'DUBAI 2026', 'T20 WORLD STADIUM',
      'TACTICAL RADAR', 'V2V VOICE AI', 'ZERO TRUST', 'MULTIMODAL CRICKET'
    ];
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 256;
      bCanvas.height = 64;
      const bCtx = bCanvas.getContext('2d')!;
      bCtx.fillStyle = i % 2 === 0 ? '#1b0a3d' : '#0a1d35';
      bCtx.fillRect(0, 0, 256, 64);
      bCtx.fillStyle = i % 2 === 0 ? '#ec4899' : '#00f0ff';
      bCtx.font = 'bold 22px Arial';
      bCtx.textAlign = 'center';
      bCtx.fillText(sponsorSlogans[i % sponsorSlogans.length], 128, 38);

      const bTex = new THREE.CanvasTexture(bCanvas);
      const bGeo = new THREE.PlaneGeometry(5.2, 1.25);
      const bMat = new THREE.MeshBasicMaterial({ map: bTex, side: THREE.DoubleSide });
      const board = new THREE.Mesh(bGeo, bMat);
      board.position.set(Math.sin(angle) * 47.6, 0.65, Math.cos(angle) * 47.6);
      board.lookAt(0, 0.65, 0);
      scene.add(board);
    }

    // ── 15. Animated Crowd Particles ──
    const crowdCount = 3600;
    const crowdGeo = new THREE.BufferGeometry();
    const crowdPos = new Float32Array(crowdCount * 3);
    const crowdCols = new Float32Array(crowdCount * 3);
    const palette = [
      [1.0, 0.25, 0.5], [0.2, 0.6, 1.0], [1.0, 0.8, 0.1],
      [0.3, 0.9, 0.4], [1.0, 1.0, 1.0], [0.9, 0.3, 0.9]
    ];
    for (let i = 0; i < crowdCount; i++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 53 + Math.random() * 13;
      crowdPos[i * 3] = Math.sin(ang) * rad;
      crowdPos[i * 3 + 1] = 2 + Math.random() * 11;
      crowdPos[i * 3 + 2] = Math.cos(ang) * rad;
      const c = palette[Math.floor(Math.random() * palette.length)];
      crowdCols[i * 3] = c[0];
      crowdCols[i * 3 + 1] = c[1];
      crowdCols[i * 3 + 2] = c[2];
    }
    crowdGeo.setAttribute('position', new THREE.BufferAttribute(crowdPos, 3));
    crowdGeo.setAttribute('color', new THREE.BufferAttribute(crowdCols, 3));
    const crowdMat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true });
    const crowdPoints = new THREE.Points(crowdGeo, crowdMat);
    scene.add(crowdPoints);

    // ── 16. Fielders (with dynamic diving catch reference) ──
    const fielderCoords = [
      { key: 'cover', x: 26, z: 24, name: 'Deep Cover' },
      { key: 'point', x: -28, z: 12, name: 'Deep Point' },
      { key: 'midwicket', x: -22, z: 28, name: 'Deep Mid-Wicket' },
      { key: 'longon', x: 14, z: 38, name: 'Long-On' },
      { key: 'longoff', x: -14, z: 38, name: 'Long-Off' },
      { key: 'thirdman', x: 28, z: -14, name: 'Third Man' },
      { key: 'fineleg', x: -26, z: -14, name: 'Fine Leg' },
      { key: 'slip', x: 3.5, z: 12.5, name: 'First Slip' }
    ];

    fielderCoords.forEach((fc) => {
      const fGroup = new THREE.Group();
      const fBody = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.26, 0.95, 6, 12),
        new THREE.MeshStandardMaterial({ color: 0x2563eb })
      );
      fBody.position.y = 0.8;
      fBody.castShadow = true;
      fGroup.add(fBody);

      const fHead = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0x8b5e3c })
      );
      fHead.position.y = 1.5;
      fGroup.add(fHead);

      fGroup.position.set(fc.x, 0, fc.z);
      fGroup.lookAt(0, 0, 9);
      scene.add(fGroup);

      if (fc.key === 'cover') {
        fielderDeepCoverRef.current = fGroup;
      }
    });

    // Wicketkeeper
    const wkGroup = new THREE.Group();
    const wkBody = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 0.8, 6, 12),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    wkBody.position.y = 0.6;
    wkGroup.add(wkBody);
    const wkHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x8b5e3c })
    );
    wkHead.position.y = 1.25;
    wkGroup.add(wkHead);
    wkGroup.position.set(0, 0, 12.6);
    wkGroup.rotation.y = Math.PI;
    scene.add(wkGroup);

    // ── 17. Cricket Ball Mesh & Glowing Trail ──
    const ballGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      emissive: 0xef4444,
      emissiveIntensity: 0.45,
      roughness: 0.25
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 1.5, -10.06);
    ball.castShadow = true;
    scene.add(ball);
    ballRef.current = ball;

    // Seam line
    const seam = new THREE.Mesh(
      new THREE.TorusGeometry(0.26, 0.015, 4, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    ball.add(seam);

    // Glowing Trail
    const trailPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) trailPoints.push(new THREE.Vector3(0, 0, 0));
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x4cd7f6,
      linewidth: 2,
      transparent: true,
      opacity: showTrajectory ? 0.85 : 0
    });
    const trajectoryLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // Pitch Bounce Spot Marker
    const impactMarker = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.4, 32),
      new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
    );
    impactMarker.rotation.x = -Math.PI / 2;
    impactMarker.position.set(0, 0.17, 0);
    scene.add(impactMarker);

    // ── 18. Surrounding City Skyline with Lit Windows ──
    const cityGroup = new THREE.Group();
    for (let i = 0; i < 75; i++) {
      const cAngle = Math.random() * Math.PI * 2;
      const cDist = 95 + Math.random() * 110;
      const bW = 4 + Math.random() * 8;
      const bH = 20 + Math.random() * 65;
      const bGeo = new THREE.BoxGeometry(bW, bH, bW);
      const bMat = new THREE.MeshStandardMaterial({
        color: timeOfDay === 'night' ? 0x0c0822 : 0x223344,
        roughness: 0.6
      });
      const bldg = new THREE.Mesh(bGeo, bMat);
      bldg.position.set(Math.sin(cAngle) * cDist, bH / 2, Math.cos(cAngle) * cDist);
      cityGroup.add(bldg);
    }
    scene.add(cityGroup);

    // ── 19. ANIMATION LOOP & MULTIPLE SHOT/BALL DYNAMICS ──
    let running = true;
    const clock = clockRef.current;
    clock.start();

    const selectedDelivery = STADIUM_BOWLING_STYLES.find((b) => b.key === bowlerStyleKey) || STADIUM_BOWLING_STYLES[0];
    const selectedShot = STADIUM_SHOTS.find((s) => s.key === shotTypeKey) || STADIUM_SHOTS[0];

    const animate = () => {
      if (!running) return;
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Bowler arm action
      if (bowlerGroupRef.current) {
        const armMesh = bowlerGroupRef.current.children[2];
        if (armMesh) {
          armMesh.rotation.z = -0.8 + Math.sin(tRef.current * 3.2) * 0.7;
        }
      }

      if (isPlaying && ballRef.current) {
        tRef.current += 0.016;
        if (tRef.current > 2.5) {
          tRef.current = 0;
          setEventBanner(null);
          // Reset batting stumps
          if (battingStumpsRef.current) {
            battingStumpsRef.current.position.set(0, 0, 0);
            battingStumpsRef.current.rotation.set(0, 0, 0);
          }
          // Reset fielder position
          if (fielderDeepCoverRef.current) {
            fielderDeepCoverRef.current.position.set(26, 0, 24);
            fielderDeepCoverRef.current.rotation.set(0, 0, 0);
          }
        }

        const t = tRef.current;
        let x = 0;
        let y = 1.5;
        let z = -10.06 + t * 14;

        if (t < 1.0) {
          // PHASE 1: Bowling delivery
          setBallPhase('bowled');
          const bounceT = t;
          setBallSpeed(selectedDelivery.speed);

          if (selectedDelivery.key === 'yorker') {
            y = 1.5 - 1.45 * bounceT;
            x = 0.08 * Math.sin(bounceT * 2);
            z = -10.06 + bounceT * 19;
          } else if (selectedDelivery.key === 'bouncer') {
            y = 1.8 - 2.8 * bounceT + 4.2 * Math.sin(bounceT * Math.PI);
            x = 0.1 * Math.sin(bounceT * 2);
            z = -10.06 + bounceT * 18;
          } else if (selectedDelivery.key === 'outswinger') {
            y = 1.9 - 2.5 * bounceT + 3.2 * Math.sin(bounceT * Math.PI);
            x = bounceT * bounceT * 0.45; // late outward drift
          } else if (selectedDelivery.key === 'inswinger') {
            y = 1.9 - 2.5 * bounceT + 3.2 * Math.sin(bounceT * Math.PI);
            x = -bounceT * bounceT * 0.42; // late inward swing
          } else if (selectedDelivery.key === 'legspin') {
            y = 2.1 - 2.8 * bounceT + 3.5 * Math.sin(bounceT * Math.PI);
            x = bounceT < 0.5 ? -0.2 * bounceT : 0.6 * (bounceT - 0.5);
          } else if (selectedDelivery.key === 'carrom') {
            y = 2.0 - 2.6 * bounceT + 3.3 * Math.sin(bounceT * Math.PI);
            x = bounceT < 0.5 ? 0.15 * bounceT : -0.55 * (bounceT - 0.5);
          } else {
            // knuckle slower
            y = 2.2 - 3.2 * bounceT + 3.8 * Math.sin(bounceT * Math.PI);
            x = 0.2 * Math.sin(bounceT * 4);
          }

          // Pitch impact circle
          if (bounceT > 0.42 && bounceT < 0.58) {
            impactMarker.position.set(x, 0.17, z);
            (impactMarker.material as THREE.MeshBasicMaterial).opacity = 0.8;
          } else {
            (impactMarker.material as THREE.MeshBasicMaterial).opacity = 0.0;
          }

          // Batsman stance adjustment
          if (batsmanGroupRef.current) {
            batsmanGroupRef.current.rotation.y = Math.PI + Math.sin(bounceT * 3) * 0.06;
          }
        } else {
          // PHASE 2: Post-contact stroke or wicket
          const hitT = t - 1.0;
          setBallSpeed(selectedShot.speed);

          if (selectedShot.key === 'coverDrive') {
            setBallPhase('hit');
            x = 0.2 + hitT * 26;
            y = Math.max(0.15, 1.1 + 9.5 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.8);
            z = 3.5 + hitT * 22;
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerSix);
            }
          } else if (selectedShot.key === 'pullShot') {
            setBallPhase('hit');
            x = -hitT * 30;
            y = Math.max(0.15, 1.0 + 7.2 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.5);
            z = 3.5 + hitT * 14;
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerFour);
            }
          } else if (selectedShot.key === 'straightDrive') {
            setBallPhase('hit');
            x = 0.1;
            y = Math.max(0.15, 0.8 + 4.2 * Math.sin(hitT * Math.PI * 0.9) - hitT);
            z = -10.06 + hitT * -36;
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerFour);
            }
          } else if (selectedShot.key === 'upperCut') {
            setBallPhase('hit');
            x = hitT * 20;
            y = Math.max(0.15, 1.1 + 12.5 * Math.sin(hitT * Math.PI * 0.72) - hitT * 2);
            z = 3.5 - hitT * 22;
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerSix);
            }
          } else if (selectedShot.key === 'helicopter') {
            setBallPhase('hit');
            x = -hitT * 16;
            y = Math.max(0.15, 1.2 + 14 * Math.sin(hitT * Math.PI * 0.75) - hitT * 2.2);
            z = 3.5 + hitT * 30; // Towering over long-on
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerSix);
            }
          } else if (selectedShot.key === 'reverseSweep') {
            setBallPhase('hit');
            x = hitT * 28;
            y = Math.max(0.15, 0.7 + 3.8 * Math.sin(hitT * Math.PI * 0.9) - hitT);
            z = 8.5 - hitT * 18;
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerFour);
            }
          } else if (selectedShot.key === 'scoop') {
            setBallPhase('hit');
            x = -0.2;
            y = Math.max(0.15, 1.0 + 13 * Math.sin(hitT * Math.PI * 0.7) - hitT * 2);
            z = 10.06 + hitT * 28; // Over keeper
            if (hitT > 0.3 && !eventBanner) {
              setEventBanner(trans.bannerSix);
            }
          } else if (selectedShot.key === 'defense') {
            setBallPhase('hit');
            x = 0.1;
            y = 0.2;
            z = 8.5 + hitT * 0.4; // Drops softly
            if (hitT > 0.2 && !eventBanner) {
              setEventBanner(trans.bannerDefense);
            }
          } else if (selectedShot.key === 'boundaryCatch') {
            // DIVING CATCH ACTION BY DEEP COVER FIELDER
            setBallPhase('catch');
            x = 0.2 + hitT * 24;
            y = Math.max(0.8, 1.1 + 7.5 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.5);
            z = 3.5 + hitT * 21;

            // Fielder sprints and dives horizontally
            if (fielderDeepCoverRef.current) {
              const fX = 26 + (x - 26) * Math.min(hitT * 1.6, 1);
              const fZ = 24 + (z - 24) * Math.min(hitT * 1.6, 1);
              fielderDeepCoverRef.current.position.set(fX, hitT > 0.8 ? 0.3 : 0, fZ);
              if (hitT > 0.8) {
                // Horizontal dive rotation
                fielderDeepCoverRef.current.rotation.x = Math.PI / 2.5;
              }
            }

            if (hitT > 0.5 && !eventBanner) {
              setEventBanner(trans.bannerCatch);
            }
          } else {
            // WICKET DISMANTLED
            setBallPhase('hit');
            x = 0;
            y = 0.4;
            z = 10.06;

            // Stumps cartwheel
            if (battingStumpsRef.current) {
              battingStumpsRef.current.position.z = 10.06 + hitT * 4;
              battingStumpsRef.current.rotation.x = hitT * 3;
            }

            if (hitT > 0.2 && !eventBanner) {
              setEventBanner(trans.bannerWicket);
            }
          }

          // Batsman swing animation matching shot
          if (batsmanGroupRef.current) {
            if (selectedShot.key === 'helicopter') {
              batsmanGroupRef.current.rotation.y = Math.PI + hitT * 5; // Full whirl
            } else if (selectedShot.key === 'reverseSweep') {
              batsmanGroupRef.current.rotation.y = hitT * 2;
            } else if (selectedShot.key === 'scoop') {
              batsmanGroupRef.current.position.y = -0.3; // crouch
            } else {
              const swing = Math.min(hitT * 3, 1.3);
              batsmanGroupRef.current.rotation.y = Math.PI - swing * 0.9;
            }
          }
        }

        ballRef.current.position.set(x, Math.max(0.15, y), z);
        ballRef.current.rotation.x += delta * 18;
        ballRef.current.rotation.z += delta * 10;

        // Glowing trajectory line update
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

      // Smooth camera interpolation
      if (cameraRef.current) {
        const cam = cameraRef.current;
        const targetCam = STADIUM_CAMERAS.find((c) => c.key === cameraViewKey) || STADIUM_CAMERAS[0];

        if (targetCam.isDynamic) {
          // Drone rotating 360 orbit
          const droneAngle = clock.elapsedTime * 0.28;
          const dronePos = new THREE.Vector3(
            Math.sin(droneAngle) * 44,
            32,
            Math.cos(droneAngle) * 44
          );
          cam.position.lerp(dronePos, 0.04);
          cam.lookAt(0, 2, 0);
        } else {
          cam.position.lerp(new THREE.Vector3(...targetCam.pos), 0.045);
          cam.lookAt(...targetCam.lookAt);
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
  }, [isPlaying, cameraViewKey, bowlerStyleKey, shotTypeKey, timeOfDay, showTrajectory, currentLang]);

  return (
    <div className={`space-y-6 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-cyan-950/40 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 opacity-70" />

        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Box className="w-4 h-4" />
            <span>{trans.headerTag}</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold animate-pulse">
              {trans.liveTag}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {trans.headerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {trans.headerSubtitle}
          </p>
        </div>

        {/* Global Language Pill + Play Controls */}
        <div className="flex items-center gap-3 z-10">
          {/* Quick Language Dropdown Deck */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-purple-500/30 px-2.5 py-1.5 rounded-xl text-xs">
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={currentLang}
              onChange={(e) => handleLanguageSwitch(e.target.value)}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="en" className="bg-slate-900 text-white">🇬🇧 English</option>
              <option value="hi" className="bg-slate-900 text-white">🇮🇳 हिंदी (Hindi)</option>
              <option value="es" className="bg-slate-900 text-white">🇪🇸 Español</option>
              <option value="ar" className="bg-slate-900 text-white">🇸🇦 العربية (Arabic)</option>
              <option value="ta" className="bg-slate-900 text-white">🇮🇳 தமிழ் (Tamil)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 p-1.5 rounded-xl">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? trans.pauseLabel : trans.playLabel}</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                tRef.current = 0;
                setEventBanner(null);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={trans.resetLabel}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3D Viewport Container & Control HUD */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0c0a1a]">
        <div ref={containerRef} className="w-full h-[540px]" />

        {/* Floating Holographic Event Banner (Six / Four / Catch / Wicket) */}
        {eventBanner && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 animate-in zoom-in-75 duration-200">
            <div className="bg-slate-950/90 border-2 border-pink-500 text-white px-6 py-3 rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.8)] backdrop-blur-xl flex items-center gap-3">
              <Flame className="w-6 h-6 text-pink-400 animate-bounce" />
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-pink-200 to-cyan-300 bg-clip-text text-transparent">
                {eventBanner}
              </span>
            </div>
          </div>
        )}

        {/* Floating Top Overlay HUD: 10 Cameras + Telemetry */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none z-20">
          {/* Camera View Switcher (10 Views) */}
          <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 pointer-events-auto shadow-xl max-w-full overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono whitespace-nowrap flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>{trans.cameraLabel}</span>
            </span>
            {STADIUM_CAMERAS.map((cam) => {
              const label = cam.labels[currentLang] || cam.labels.en;
              const isSel = cameraViewKey === cam.key;
              return (
                <button
                  key={cam.key}
                  onClick={() => {
                    soundFX.playClick();
                    setCameraViewKey(cam.key);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Telemetry Pill */}
          <div className="flex items-center gap-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono shadow-xl pointer-events-auto">
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
            <span
              className={`font-black ${
                ballPhase === 'bowled'
                  ? 'text-cyan-400'
                  : ballPhase === 'catch'
                  ? 'text-pink-400 animate-pulse'
                  : ballPhase === 'hit'
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              {ballPhase === 'bowled'
                ? trans.phaseBowling
                : ballPhase === 'catch'
                ? trans.phaseCatch
                : ballPhase === 'hit'
                ? trans.phaseShot
                : trans.phaseIdle}
            </span>
          </div>
        </div>

        {/* Floating Right Panel: Time of Day & Trajectory Trail */}
        <div className="absolute top-18 right-4 flex flex-col gap-2 pointer-events-auto z-20">
          <div className="bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 space-y-1 shadow-lg text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block px-1">
              {trans.timeLabel}
            </span>
            {[
              { key: 'day' as const, label: '☀️ ' + (currentLang === 'hi' ? 'दिन' : currentLang === 'es' ? 'Día' : currentLang === 'ar' ? 'نهار' : currentLang === 'ta' ? 'பகல்' : 'Day') },
              { key: 'twilight' as const, label: '🌅 ' + (currentLang === 'hi' ? 'गोधूलि' : currentLang === 'es' ? 'Crepúsculo' : currentLang === 'ar' ? 'غروب' : currentLang === 'ta' ? 'மாலை' : 'Twilight') },
              { key: 'night' as const, label: '🌙 ' + (currentLang === 'hi' ? 'रात' : currentLang === 'es' ? 'Noche' : currentLang === 'ar' ? 'ليل' : currentLang === 'ta' ? 'இரவு' : 'Night') }
            ].map((tod) => (
              <button
                key={tod.key}
                onClick={() => {
                  soundFX.playClick();
                  setTimeOfDay(tod.key);
                }}
                className={`block w-full text-left px-2 py-1 rounded-xl font-bold transition-all ${
                  timeOfDay === tod.key ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tod.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundFX.playClick();
              setShowTrajectory(!showTrajectory);
            }}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold transition-all border shadow-lg backdrop-blur-md ${
              showTrajectory
                ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/90 border-slate-800 text-slate-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{trans.trailLabel}</span>
          </button>
        </div>

        {/* Floating Bottom Controls: Bowling Styles + Shots/Catches */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 pointer-events-none z-20">
          {/* Row 1: Bowling Styles (7 Styles) */}
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 pointer-events-auto overflow-x-auto shadow-xl">
            <span className="text-[11px] font-black text-slate-400 uppercase font-mono whitespace-nowrap px-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{trans.deliveryLabel}</span>
            </span>
            {STADIUM_BOWLING_STYLES.map((b) => {
              const bLabel = b.labels[currentLang] || b.labels.en;
              const isSel = bowlerStyleKey === b.key;
              return (
                <button
                  key={b.key}
                  onClick={() => {
                    soundFX.playClick();
                    setBowlerStyleKey(b.key);
                    tRef.current = 0;
                    setEventBanner(null);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {bLabel}
                </button>
              );
            })}
          </div>

          {/* Row 2: 10 Cricket Shots & Catching Actions */}
          <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md p-2 rounded-2xl border border-slate-800 pointer-events-auto overflow-x-auto shadow-xl">
            <span className="text-[11px] font-black text-slate-400 uppercase font-mono whitespace-nowrap px-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>{trans.shotLabel}</span>
            </span>
            {STADIUM_SHOTS.map((s) => {
              const sLabel = s.labels[currentLang] || s.labels.en;
              const isSel = shotTypeKey === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => {
                    soundFX.playSuccess();
                    setShotTypeKey(s.key);
                    tRef.current = 0;
                    setEventBanner(null);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSel
                      ? s.actionType === 'catch'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md ring-2 ring-emerald-400'
                        : s.actionType === 'wicket'
                        ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md ring-2 ring-red-400'
                        : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {sLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Physics Spec Grid (Localized 4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 shadow-lg">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{trans.card1Title}</span>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{trans.card1Desc}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 shadow-lg">
          <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{trans.card2Title}</span>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{trans.card2Desc}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 shadow-lg">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 flex-shrink-0">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{trans.card3Title}</span>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{trans.card3Desc}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 shadow-lg">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">{trans.card4Title}</span>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{trans.card4Desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
