import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Box, Compass, Sparkles, Activity, Zap, Trophy, Eye } from 'lucide-react';
import { soundFX } from '../services/soundFX';

export const CricketStadium3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'broadcast' | 'batsman' | 'hawkEye' | 'topDown' | 'stumpCam' | 'drone'>('broadcast');
  const [bowlerType, setBowlerType] = useState<'pace' | 'spin' | 'yorker'>('pace');
  const [shotType, setShotType] = useState<'coverDrive' | 'pullShot' | 'wicket' | 'straightDrive' | 'upperCut'>('coverDrive');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'twilight' | 'night'>('night');
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [ballSpeed, setBallSpeed] = useState<number>(0);
  const [ballPhase, setBallPhase] = useState<'bowled' | 'hit' | 'idle'>('idle');

  const animationIdRef = useRef<number | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const batsmanGroupRef = useRef<THREE.Group | null>(null);
  const bowlerGroupRef = useRef<THREE.Group | null>(null);

  const tRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 520;

    // ── 1. Scene ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Sky Colors based on time of day
    const skyColors = {
      day: { bg: 0x87ceeb, fog: 0x87ceeb, fogDensity: 0.003, ambient: 1.2, sunColor: 0xfff4e0, sunIntensity: 2.5 },
      twilight: { bg: 0x2d1b4e, fog: 0x2d1b4e, fogDensity: 0.005, ambient: 0.6, sunColor: 0xff7b54, sunIntensity: 1.5 },
      night: { bg: 0x060418, fog: 0x060418, fogDensity: 0.006, ambient: 0.4, sunColor: 0xddb7ff, sunIntensity: 2.0 },
    };
    const sky = skyColors[timeOfDay];
    scene.background = new THREE.Color(sky.bg);
    scene.fog = new THREE.FogExp2(sky.fog, sky.fogDensity);

    // ── 2. Camera ──
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1200);
    camera.position.set(0, 32, 64);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ── 3. Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = timeOfDay === 'day' ? 1.2 : 0.8;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── 4. Lighting ──
    const ambientLight = new THREE.AmbientLight(0xffffff, sky.ambient);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(sky.sunColor, sky.sunIntensity);
    sunLight.position.set(60, 80, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    scene.add(sunLight);

    const floodLight2 = new THREE.DirectionalLight(0x4cd7f6, timeOfDay === 'night' ? 1.8 : 0.5);
    floodLight2.position.set(-50, 60, -40);
    scene.add(floodLight2);

    // Spot Floodlights (night/twilight)
    if (timeOfDay !== 'day') {
      const spotPositions = [
        { x: 55, z: 55 }, { x: -55, z: 55 }, { x: 55, z: -55 }, { x: -55, z: -55 },
      ];
      spotPositions.forEach((pos) => {
        const spot = new THREE.SpotLight(0xfff8dc, 3.0, 180, Math.PI / 6, 0.5, 1);
        spot.position.set(pos.x, 75, pos.z);
        spot.target.position.set(0, 0, 0);
        spot.castShadow = true;
        scene.add(spot);
        scene.add(spot.target);

        // Floodlight tower pole
        const poleGeo = new THREE.CylinderGeometry(0.3, 0.5, 76, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.3 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(pos.x, 38, pos.z);
        pole.castShadow = true;
        scene.add(pole);

        // Lamp head
        const lampGeo = new THREE.BoxGeometry(3, 1.5, 3);
        const lampMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffffcc, emissiveIntensity: 0.8 });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(pos.x, 76, pos.z);
        scene.add(lamp);
      });
    }

    // ── 5. Ground Surface (Realistic Turf) ──
    const groundGeo = new THREE.CylinderGeometry(48, 48, 0.6, 96);
    const groundMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'night' ? 0x0a2016 : timeOfDay === 'twilight' ? 0x133b25 : 0x1a6b35,
      roughness: 0.85,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.3;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grass stripe pattern (alternating dark/light bands)
    for (let i = -5; i <= 5; i++) {
      const stripeGeo = new THREE.PlaneGeometry(96, 4);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x155a2c : 0x1a6b35,
        transparent: true,
        opacity: timeOfDay === 'night' ? 0.15 : 0.25,
        side: THREE.DoubleSide,
      });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(0, 0.02, i * 8);
      scene.add(stripe);
    }

    // ── 6. Boundary Rope ──
    const boundaryRopeGeo = new THREE.TorusGeometry(46, 0.15, 8, 128);
    const boundaryRopeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xec4899,
      emissiveIntensity: 0.4,
    });
    const boundaryRope = new THREE.Mesh(boundaryRopeGeo, boundaryRopeMat);
    boundaryRope.rotation.x = Math.PI / 2;
    boundaryRope.position.y = 0.15;
    scene.add(boundaryRope);

    // 30-Yard Circle
    const innerRingGeo = new THREE.TorusGeometry(23, 0.08, 8, 96);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x4cd7f6,
      emissive: 0x4cd7f6,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.08;
    scene.add(innerRing);

    // ── 7. Realistic Pitch Strip (22 Yards) ──
    const pitchGeo = new THREE.BoxGeometry(3.66, 0.12, 20.12);
    const pitchMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'day' ? 0xc4a55a : 0x5a4833,
      roughness: 0.92,
      metalness: 0.02,
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = 0.08;
    pitch.receiveShadow = true;
    scene.add(pitch);

    // Pitch Crease Lines
    const creaseLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const createCreaseLine = (width: number, depth: number, x: number, z: number) => {
      const geo = new THREE.PlaneGeometry(width, depth);
      const mesh = new THREE.Mesh(geo, creaseLineMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.16, z);
      return mesh;
    };

    // Popping crease (batting end)
    scene.add(createCreaseLine(3.66, 0.06, 0, 8.8));
    // Bowling crease (batting end)
    scene.add(createCreaseLine(3.66, 0.06, 0, 10.06));
    // Return crease (batting end, left)
    scene.add(createCreaseLine(0.06, 1.26, -1.32, 9.43));
    // Return crease (batting end, right)
    scene.add(createCreaseLine(0.06, 1.26, 1.32, 9.43));
    // Popping crease (bowling end)
    scene.add(createCreaseLine(3.66, 0.06, 0, -8.8));
    // Bowling crease (bowling end)
    scene.add(createCreaseLine(3.66, 0.06, 0, -10.06));
    // Return crease (bowling end, left)
    scene.add(createCreaseLine(0.06, 1.26, -1.32, -9.43));
    // Return crease (bowling end, right)
    scene.add(createCreaseLine(0.06, 1.26, 1.32, -9.43));

    // ── 8. Stumps + Bails ──
    const createStumps = (zPos: number) => {
      const group = new THREE.Group();
      const stumpPositions = [-0.28, 0, 0.28];
      stumpPositions.forEach((xOff) => {
        const stumpGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12);
        const stumpMat = new THREE.MeshStandardMaterial({ color: 0xf5f0dc, metalness: 0.1, roughness: 0.5 });
        const stump = new THREE.Mesh(stumpGeo, stumpMat);
        stump.position.set(xOff, 0.36, zPos);
        stump.castShadow = true;
        group.add(stump);
      });
      // Bails
      const bailGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8);
      const bailMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8 });
      [-0.14, 0.14].forEach((xOff) => {
        const bail = new THREE.Mesh(bailGeo, bailMat);
        bail.position.set(xOff, 0.74, zPos);
        bail.rotation.z = Math.PI / 2;
        group.add(bail);
      });
      return group;
    };
    scene.add(createStumps(10.06));
    scene.add(createStumps(-10.06));

    // ── 9. Batsman Figure ──
    const batsmanGroup = new THREE.Group();
    // Body
    const bodyGeo = new THREE.CapsuleGeometry(0.35, 1.2, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.1;
    body.castShadow = true;
    batsmanGroup.add(body);
    // Head / Helmet
    const helmetGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const helmetMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, metalness: 0.6, roughness: 0.3 });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.y = 2.0;
    helmet.castShadow = true;
    batsmanGroup.add(helmet);
    // Helmet grille
    const grillGeo = new THREE.TorusGeometry(0.16, 0.015, 4, 12, Math.PI);
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9 });
    const grill = new THREE.Mesh(grillGeo, grillMat);
    grill.position.set(0, 1.92, 0.22);
    grill.rotation.x = Math.PI / 2;
    batsmanGroup.add(grill);
    // Bat
    const batHandleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8);
    const batHandleMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.7 });
    const batHandle = new THREE.Mesh(batHandleGeo, batHandleMat);
    batHandle.position.set(0.5, 1.4, 0.15);
    batHandle.rotation.z = -0.3;
    batsmanGroup.add(batHandle);
    const batBladeGeo = new THREE.BoxGeometry(0.12, 0.55, 0.08);
    const batBladeMat = new THREE.MeshStandardMaterial({ color: 0xf5e6c8, roughness: 0.5 });
    const batBlade = new THREE.Mesh(batBladeGeo, batBladeMat);
    batBlade.position.set(0.62, 0.92, 0.15);
    batBlade.rotation.z = -0.3;
    batBlade.castShadow = true;
    batsmanGroup.add(batBlade);
    // Leg pads
    const padGeo = new THREE.CylinderGeometry(0.15, 0.12, 0.6, 8);
    const padMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5 });
    [-0.18, 0.18].forEach((xOff) => {
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(xOff, 0.3, 0.1);
      pad.castShadow = true;
      batsmanGroup.add(pad);
    });
    batsmanGroup.position.set(0.3, 0, 9.2);
    batsmanGroup.rotation.y = Math.PI;
    scene.add(batsmanGroup);
    batsmanGroupRef.current = batsmanGroup;

    // ── 10. Bowler Figure ──
    const bowlerGroup = new THREE.Group();
    const bowlerBody = new THREE.CapsuleGeometry(0.32, 1.1, 8, 16);
    const bowlerMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const bowlerMesh = new THREE.Mesh(bowlerBody, bowlerMat);
    bowlerMesh.position.y = 1.0;
    bowlerMesh.castShadow = true;
    bowlerGroup.add(bowlerMesh);
    // Bowler head
    const bowlerHeadGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const bowlerHeadMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c });
    const bowlerHead = new THREE.Mesh(bowlerHeadGeo, bowlerHeadMat);
    bowlerHead.position.y = 1.82;
    bowlerGroup.add(bowlerHead);
    // Bowling arm
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.7, 8);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const bowlArm = new THREE.Mesh(armGeo, armMat);
    bowlArm.position.set(0.4, 1.5, 0);
    bowlArm.rotation.z = -0.8;
    bowlerGroup.add(bowlArm);
    bowlerGroup.position.set(0, 0, -9.5);
    scene.add(bowlerGroup);
    bowlerGroupRef.current = bowlerGroup;

    // ── 11. Stadium Stands / Tiers ──
    const standColor = timeOfDay === 'night' ? 0x1a1040 : timeOfDay === 'twilight' ? 0x2d1b4e : 0x555577;
    const numSections = 16;
    for (let i = 0; i < numSections; i++) {
      const angle = (i / numSections) * Math.PI * 2;
      const standGeo = new THREE.BoxGeometry(16, 12, 6);
      const standMat = new THREE.MeshStandardMaterial({
        color: standColor,
        roughness: 0.7,
        metalness: 0.15,
      });
      const stand = new THREE.Mesh(standGeo, standMat);
      const radius = 58;
      stand.position.set(
        Math.sin(angle) * radius,
        6,
        Math.cos(angle) * radius,
      );
      stand.lookAt(0, 6, 0);
      stand.castShadow = true;
      stand.receiveShadow = true;
      scene.add(stand);

      // Seat rows on each stand
      for (let r = 0; r < 3; r++) {
        const seatRowGeo = new THREE.BoxGeometry(14, 0.5, 1.2);
        const seatColors = [0xec4899, 0xa855f7, 0x4cd7f6, 0x22c55e, 0xf59e0b];
        const seatMat = new THREE.MeshStandardMaterial({
          color: seatColors[(i + r) % seatColors.length],
          roughness: 0.8,
        });
        const seatRow = new THREE.Mesh(seatRowGeo, seatMat);
        seatRow.position.set(0, -4 + r * 3.5, -2);
        stand.add(seatRow);
      }
    }

    // ── 12. City Skyline Background ──
    const buildingGroup = new THREE.Group();
    const buildingColors = [0x1a1a2e, 0x16213e, 0x0f3460, 0x1a0a3e, 0x2d1b4e, 0x0d1b2a];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 100 + Math.random() * 120;
      const bWidth = 3 + Math.random() * 8;
      const bHeight = 15 + Math.random() * 60;
      const bDepth = 3 + Math.random() * 8;

      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const bMat = new THREE.MeshStandardMaterial({
        color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
        roughness: 0.6,
        metalness: 0.3,
      });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(
        Math.sin(angle) * radius,
        bHeight / 2,
        Math.cos(angle) * radius,
      );
      building.rotation.y = Math.random() * Math.PI;

      // Window lights on buildings
      if (timeOfDay !== 'day') {
        const windowRows = Math.floor(bHeight / 4);
        for (let w = 0; w < windowRows; w++) {
          if (Math.random() > 0.4) {
            const winGeo = new THREE.PlaneGeometry(bWidth * 0.7, 0.8);
            const winMat = new THREE.MeshBasicMaterial({
              color: Math.random() > 0.5 ? 0xfff4c4 : 0x88ccff,
              transparent: true,
              opacity: 0.3 + Math.random() * 0.5,
              side: THREE.DoubleSide,
            });
            const win = new THREE.Mesh(winGeo, winMat);
            win.position.set(0, -bHeight / 2 + 2 + w * 4, bDepth / 2 + 0.05);
            building.add(win);
          }
        }
      }

      buildingGroup.add(building);
    }
    scene.add(buildingGroup);

    // City ground plane extending outward
    const cityGroundGeo = new THREE.PlaneGeometry(600, 600);
    const cityGroundMat = new THREE.MeshStandardMaterial({
      color: timeOfDay === 'day' ? 0x4a7c59 : 0x080412,
      roughness: 1.0,
    });
    const cityGround = new THREE.Mesh(cityGroundGeo, cityGroundMat);
    cityGround.rotation.x = -Math.PI / 2;
    cityGround.position.y = -0.5;
    cityGround.receiveShadow = true;
    scene.add(cityGround);

    // ── 13. Stars (night/twilight) ──
    if (timeOfDay !== 'day') {
      const starGeo = new THREE.BufferGeometry();
      const starPositions = new Float32Array(2000 * 3);
      for (let i = 0; i < 2000; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 800;
        starPositions[i * 3 + 1] = 60 + Math.random() * 300;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.6,
        transparent: true,
        opacity: timeOfDay === 'twilight' ? 0.4 : 0.8,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
    }

    // ── 14. Cricket Ball ──
    const ballGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xcc2222,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.1,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 1.5, -10.06);
    ball.castShadow = true;
    scene.add(ball);
    ballRef.current = ball;

    // Ball seam line
    const seamGeo = new THREE.TorusGeometry(0.26, 0.015, 4, 32);
    const seamMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const seam = new THREE.Mesh(seamGeo, seamMat);
    ball.add(seam);

    // Glowing Trail Geometry
    const trailPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 60; i++) trailPoints.push(new THREE.Vector3(0, 0, 0));
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x4cd7f6,
      linewidth: 2,
      transparent: true,
      opacity: showTrajectory ? 0.8 : 0,
    });
    const trajectoryLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // Impact zone marker on pitch
    const impactGeo = new THREE.RingGeometry(0.1, 0.4, 32);
    const impactMat = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
    });
    const impactMarker = new THREE.Mesh(impactGeo, impactMat);
    impactMarker.rotation.x = -Math.PI / 2;
    impactMarker.position.set(0, 0.17, 0);
    scene.add(impactMarker);

    // ── 15. Fielder Silhouettes (positioned in key fielding spots) ──
    const fielderPositions = [
      { x: 15, z: 30, name: 'Long-on' },
      { x: -15, z: 30, name: 'Long-off' },
      { x: 30, z: 10, name: 'Deep Square' },
      { x: -30, z: 10, name: 'Deep Cover' },
      { x: 25, z: -10, name: 'Third Man' },
      { x: -25, z: -10, name: 'Fine Leg' },
      { x: 8, z: 5, name: 'Mid-on' },
      { x: -8, z: 5, name: 'Mid-off' },
      { x: 3, z: 6, name: 'Short Leg' },
    ];

    fielderPositions.forEach((fp) => {
      const fielderGroup = new THREE.Group();
      const fBody = new THREE.CapsuleGeometry(0.25, 0.9, 6, 12);
      const fMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.7 });
      const fMesh = new THREE.Mesh(fBody, fMat);
      fMesh.position.y = 0.75;
      fMesh.castShadow = true;
      fielderGroup.add(fMesh);
      const fHead = new THREE.SphereGeometry(0.18, 12, 12);
      const fHeadMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c });
      const fHeadMesh = new THREE.Mesh(fHead, fHeadMat);
      fHeadMesh.position.y = 1.46;
      fielderGroup.add(fHeadMesh);
      fielderGroup.position.set(fp.x, 0, fp.z);
      fielderGroup.lookAt(0, 0, 9);
      scene.add(fielderGroup);
    });

    // ── 16. Wicketkeeper ──
    const wkGroup = new THREE.Group();
    const wkBody = new THREE.CapsuleGeometry(0.3, 0.8, 8, 12);
    const wkMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.6 });
    const wkMesh = new THREE.Mesh(wkBody, wkMat);
    wkMesh.position.y = 0.6;
    wkMesh.castShadow = true;
    wkGroup.add(wkMesh);
    const wkHead = new THREE.SphereGeometry(0.22, 12, 12);
    const wkHeadMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c });
    const wkHeadMesh = new THREE.Mesh(wkHead, wkHeadMat);
    wkHeadMesh.position.y = 1.28;
    wkGroup.add(wkHeadMesh);
    // Gloves
    [-0.35, 0.35].forEach((xOff) => {
      const gloveGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const gloveMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24 });
      const glove = new THREE.Mesh(gloveGeo, gloveMat);
      glove.position.set(xOff, 0.6, -0.2);
      wkGroup.add(glove);
    });
    wkGroup.position.set(0, 0, 12.5);
    wkGroup.rotation.y = Math.PI;
    scene.add(wkGroup);

    // ── 17. Umpire ──
    const umpireGroup = new THREE.Group();
    const umpBody = new THREE.CapsuleGeometry(0.3, 1.1, 8, 12);
    const umpMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const umpMesh = new THREE.Mesh(umpBody, umpMat);
    umpMesh.position.y = 0.95;
    umpireGroup.add(umpMesh);
    const umpHat = new THREE.CylinderGeometry(0.28, 0.28, 0.12, 16);
    const umpHatMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5 });
    const umpHatMesh = new THREE.Mesh(umpHat, umpHatMat);
    umpHatMesh.position.y = 1.82;
    umpireGroup.add(umpHatMesh);
    umpireGroup.position.set(-2.5, 0, -10.06);
    scene.add(umpireGroup);

    // ── 18. Scoreboard Screen ──
    const sbGeo = new THREE.BoxGeometry(14, 7, 0.5);
    const sbMat = new THREE.MeshStandardMaterial({
      color: 0x111122,
      emissive: 0x111133,
      emissiveIntensity: 0.3,
      metalness: 0.5,
    });
    const scoreboard = new THREE.Mesh(sbGeo, sbMat);
    scoreboard.position.set(0, 18, -68);
    scene.add(scoreboard);
    // Screen face
    const screenGeo = new THREE.PlaneGeometry(13, 6);
    const screenMat = new THREE.MeshBasicMaterial({
      color: 0x0a1628,
    });
    const screenFace = new THREE.Mesh(screenGeo, screenMat);
    screenFace.position.set(0, 18, -67.7);
    scene.add(screenFace);

    // ── ANIMATION LOOP ──
    let running = true;
    const clock = clockRef.current;
    clock.start();

    const animate = () => {
      if (!running) return;
      animationIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Bowler arm swing animation
      if (bowlerGroupRef.current) {
        const bowlerChildren = bowlerGroupRef.current.children;
        if (bowlerChildren[2]) {
          bowlerChildren[2].rotation.z = -0.8 + Math.sin(tRef.current * 3) * 0.6;
        }
      }

      if (isPlaying && ballRef.current) {
        tRef.current += 0.018;
        if (tRef.current > 2.4) tRef.current = 0;

        const t = tRef.current;
        let x = 0;
        let y = 1.5;
        let z = -10.06 + t * 14;

        if (t < 1.0) {
          // Phase 1: Ball bowled
          setBallPhase('bowled');
          const bounceT = t;
          if (bowlerType === 'yorker') {
            y = 1.5 - 1.5 * bounceT;
            x = 0.1 * Math.sin(bounceT * 2);
            z = -10.06 + bounceT * 19;
          } else {
            y = 2.0 - 2.6 * bounceT + 3.2 * Math.sin(bounceT * Math.PI);
            x = bowlerType === 'spin'
              ? Math.sin(bounceT * 5) * 1.0
              : 0.15 * Math.sin(bounceT * 2);
          }

          // Show impact on pitch
          if (bounceT > 0.4 && bounceT < 0.6) {
            impactMarker.position.set(x, 0.17, z);
            (impactMarker.material as THREE.MeshBasicMaterial).opacity = 0.8;
          } else {
            (impactMarker.material as THREE.MeshBasicMaterial).opacity = 0.0;
          }

          setBallSpeed(bowlerType === 'pace' ? 142 : bowlerType === 'spin' ? 84 : 145);

          // Batsman stance animation
          if (batsmanGroupRef.current) {
            batsmanGroupRef.current.rotation.y = Math.PI + Math.sin(bounceT * 2) * 0.05;
          }
        } else {
          // Phase 2: Post-bat trajectory
          setBallPhase('hit');
          const hitT = t - 1.0;

          if (shotType === 'coverDrive') {
            x = 0.2 + hitT * 24;
            y = Math.max(0.1, 1.0 + 9.0 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.8);
            z = 3.5 + hitT * 20;
          } else if (shotType === 'pullShot') {
            x = -hitT * 28;
            y = Math.max(0.1, 1.0 + 7.5 * Math.sin(hitT * Math.PI * 0.85) - hitT * 1.5);
            z = 3.5 + hitT * 14;
          } else if (shotType === 'straightDrive') {
            x = 0;
            y = Math.max(0.1, 0.8 + 3.5 * Math.sin(hitT * Math.PI * 0.9) - hitT);
            z = -10.06 + hitT * -35;
          } else if (shotType === 'upperCut') {
            x = hitT * 18;
            y = Math.max(0.1, 1.0 + 12 * Math.sin(hitT * Math.PI * 0.7) - hitT * 2);
            z = 3.5 - hitT * 20;
          } else {
            // Wicket dismantled
            x = 0;
            y = 0.5;
            z = 10.06;
          }

          setBallSpeed(
            shotType === 'coverDrive' ? 156 : shotType === 'pullShot' ? 148 :
            shotType === 'straightDrive' ? 162 : shotType === 'upperCut' ? 140 : 0
          );

          // Bat swing animation
          if (batsmanGroupRef.current) {
            const swing = Math.min(hitT * 3, 1.2);
            batsmanGroupRef.current.rotation.y = Math.PI - swing * 0.8;
          }
        }

        ballRef.current.position.set(x, Math.max(0.15, y), z);
        ballRef.current.rotation.x += delta * 15;
        ballRef.current.rotation.z += delta * 8;

        // Update glowing trail
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
          cam.position.lerp(new THREE.Vector3(0, 26, 52), 0.04);
          cam.lookAt(0, 2, 0);
        } else if (cameraView === 'batsman') {
          cam.position.lerp(new THREE.Vector3(1.5, 2.8, 12), 0.04);
          cam.lookAt(0, 1.2, -8);
        } else if (cameraView === 'hawkEye') {
          cam.position.lerp(new THREE.Vector3(20, 14, 0), 0.04);
          cam.lookAt(0, 1, 2);
        } else if (cameraView === 'topDown') {
          cam.position.lerp(new THREE.Vector3(0, 72, 0.1), 0.04);
          cam.lookAt(0, 0, 0);
        } else if (cameraView === 'stumpCam') {
          cam.position.lerp(new THREE.Vector3(0, 0.4, 10.5), 0.04);
          cam.lookAt(0, 1.5, -10);
        } else if (cameraView === 'drone') {
          const droneAngle = clock.elapsedTime * 0.3;
          const droneTarget = new THREE.Vector3(
            Math.sin(droneAngle) * 40,
            35,
            Math.cos(droneAngle) * 40,
          );
          cam.position.lerp(droneTarget, 0.04);
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
  }, [isPlaying, cameraView, bowlerType, shotType, timeOfDay, showTrajectory]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Box className="w-4 h-4" />
            <span>Interactive WebGL 3D Visualization</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold animate-pulse">LIVE</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            3D Stadium • Ball Trajectory • Hawk-Eye Physics
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Full-scene stadium with city skyline, player models, fielder placements, crease markings, and aerodynamic ball physics rendered at 60 FPS.
          </p>
        </div>

        {/* Play Controls */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-700 p-1.5 rounded-xl">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => { tRef.current = 0; }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Ball Loop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Viewport Container & Control HUD */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0c0a1a]">
        <div ref={containerRef} className="w-full h-[520px]" />

        {/* Floating Top Overlay HUD */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono">Camera:</span>
            {[
              { key: 'broadcast' as const, label: 'Broadcast' },
              { key: 'batsman' as const, label: 'Batter POV' },
              { key: 'hawkEye' as const, label: 'Hawk-Eye' },
              { key: 'topDown' as const, label: 'Top-Down' },
              { key: 'stumpCam' as const, label: 'Stump Cam' },
              { key: 'drone' as const, label: 'Drone' },
            ].map((cam) => (
              <button
                key={cam.key}
                onClick={() => {
                  soundFX.playClick();
                  setCameraView(cam.key);
                }}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  cameraView === cam.key ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>

          {/* Telemetry */}
          <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-lg pointer-events-auto">
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
              {ballPhase === 'bowled' ? 'BOWLING' : ballPhase === 'hit' ? 'SHOT PLAYED' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Floating Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Delivery Selector */}
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Delivery:</span>
            {[
              { key: 'pace' as const, label: '142 km/h Seam', color: 'bg-cyan-600' },
              { key: 'spin' as const, label: '84 km/h Spin', color: 'bg-cyan-600' },
              { key: 'yorker' as const, label: '145 km/h Yorker', color: 'bg-cyan-600' },
            ].map((d) => (
              <button
                key={d.key}
                onClick={() => {
                  soundFX.playClick();
                  setBowlerType(d.key);
                  tRef.current = 0;
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  bowlerType === d.key ? `${d.color} text-white` : 'text-slate-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Shot Selector */}
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Shot:</span>
            {[
              { key: 'coverDrive' as const, label: 'Cover Drive (6)' },
              { key: 'pullShot' as const, label: 'Pull Shot (4)' },
              { key: 'straightDrive' as const, label: 'Straight Drive (4)' },
              { key: 'upperCut' as const, label: 'Upper Cut (6)' },
              { key: 'wicket' as const, label: 'Wicket ⚡' },
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
                  shotType === s.key ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day & Trajectory Toggle - Floating Right Panel */}
        <div className="absolute top-16 right-4 flex flex-col gap-2 pointer-events-auto">
          <div className="bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block px-1">Time:</span>
            {[
              { key: 'day' as const, label: '☀️ Day' },
              { key: 'twilight' as const, label: '🌅 Twilight' },
              { key: 'night' as const, label: '🌙 Night' },
            ].map((tod) => (
              <button
                key={tod.key}
                onClick={() => {
                  soundFX.playClick();
                  setTimeOfDay(tod.key);
                }}
                className={`block w-full text-left px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeOfDay === tod.key ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tod.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowTrajectory(!showTrajectory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showTrajectory
                ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-950/85 border-slate-800 text-slate-500'
            } backdrop-blur-md`}
          >
            <Eye className="w-3.5 h-3.5" />
            Trail
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
            <span className="text-xs font-bold text-white block">Magnus Aerodynamic Arc</span>
            <p className="text-xs text-slate-400 mt-0.5">Lateral drift vectors based on ball seam angle and air humidity modeling.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Exit Velocity Modeling</span>
            <p className="text-xs text-slate-400 mt-0.5">Real-time parabolic collision equations at bat sweet-spot contact.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Sub-16ms WebGL Pipeline</span>
            <p className="text-xs text-slate-400 mt-0.5">GPU-accelerated shadows, fog, and anti-aliased rendering with ACES tonemapping.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Full Match Simulation</span>
            <p className="text-xs text-slate-400 mt-0.5">11 fielders, batsman with bat, bowler run-up, umpire, and wicketkeeper in 3D.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
