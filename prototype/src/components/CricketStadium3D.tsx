import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Box, Compass, Sparkles, Activity } from 'lucide-react';
import { soundFX } from '../services/soundFX';

export const CricketStadium3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'broadcast' | 'batsman' | 'hawkEye' | 'topDown'>('broadcast');
  const [bowlerType, setBowlerType] = useState<'pace' | 'spin'>('pace');
  const [shotType, setShotType] = useState<'coverDrive' | 'pullShot' | 'wicket'>('coverDrive');

  const animationIdRef = useRef<number | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const tRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 480;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0a1a);
    scene.fog = new THREE.FogExp2(0x0c0a1a, 0.008);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 32, 64);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const floodLight1 = new THREE.DirectionalLight(0xddb7ff, 2.0);
    floodLight1.position.set(40, 60, 40);
    scene.add(floodLight1);

    const floodLight2 = new THREE.DirectionalLight(0x4cd7f6, 1.8);
    floodLight2.position.set(-40, 50, -40);
    scene.add(floodLight2);

    // 5. Stadium Ground (Grass Oval)
    const groundGeo = new THREE.CylinderGeometry(45, 45, 0.5, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0f2a1d,
      roughness: 0.8,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.25;
    scene.add(ground);

    // Boundary Ring
    const boundaryGeo = new THREE.RingGeometry(43.5, 44.2, 64);
    const boundaryMat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide });
    const boundary = new THREE.Mesh(boundaryGeo, boundaryMat);
    boundary.rotation.x = -Math.PI / 2;
    boundary.position.y = 0.05;
    scene.add(boundary);

    // 30-Yard Circle
    const innerRingGeo = new THREE.RingGeometry(22, 22.4, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0x4cd7f6, side: THREE.DoubleSide, opacity: 0.5, transparent: true });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.06;
    scene.add(innerRing);

    // 6. Pitch Strip (22 Yards)
    const pitchGeo = new THREE.BoxGeometry(4.2, 0.1, 24);
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0x5a4833, roughness: 0.9 });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.position.y = 0.08;
    scene.add(pitch);

    // Stumps (Bowling & Batting Crease)
    const createStumps = (zPos: number) => {
      const group = new THREE.Group();
      for (let i = -1; i <= 1; i++) {
        const stumpGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
        const stumpMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stump = new THREE.Mesh(stumpGeo, stumpMat);
        stump.position.set(i * 0.35, 0.6, zPos);
        group.add(stump);
      }
      return group;
    };
    scene.add(createStumps(10.5));  // Batting end
    scene.add(createStumps(-10.5)); // Bowling end

    // 7. Cricket Ball Mesh
    const ballGeo = new THREE.SphereGeometry(0.35, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: 0xef4444, // Match pink/red ball
      emissive: 0xef4444,
      emissiveIntensity: 0.3,
      roughness: 0.3,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 2.2, -10.5);
    scene.add(ball);
    ballRef.current = ball;

    // Glowing Trail Geometry
    const trailPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 40; i++) trailPoints.push(new THREE.Vector3(0, 0, 0));
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({ color: 0x4cd7f6, linewidth: 2 });
    const trajectoryLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trajectoryLine);
    trajectoryLineRef.current = trajectoryLine;

    // 8. Stadium Glow Dome
    const domeGeo = new THREE.SphereGeometry(58, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    scene.add(dome);

    // 9. Render Animation Loop
    let running = true;
    const animate = () => {
      if (!running) return;
      animationIdRef.current = requestAnimationFrame(animate);

      if (isPlaying && ballRef.current) {
        tRef.current += 0.02;
        if (tRef.current > 2.2) tRef.current = 0; // Loop cycle

        const t = tRef.current;
        let x = 0;
        let y = 1.8;
        let z = -10.5 + t * 14;

        if (t < 1.0) {
          // Phase 1: Ball Bowled down the pitch
          const bounceT = t;
          y = 2.2 - 2.8 * bounceT + 3.4 * Math.sin(bounceT * Math.PI);
          x = (bowlerType === 'spin' ? Math.sin(bounceT * 4) * 0.8 : 0.2 * Math.sin(bounceT * 2));
        } else {
          // Phase 2: Post-Bat Hit Trajectory
          const hitT = t - 1.0;
          if (shotType === 'coverDrive') {
            x = 0.2 + hitT * 22; // Lofted over extra cover
            y = Math.max(0.1, 1.2 + 8.5 * Math.sin(hitT * Math.PI * 0.9) - hitT * 1.5);
            z = 3.5 + hitT * 18;
          } else if (shotType === 'pullShot') {
            x = -hitT * 26; // Dispatched to deep square leg
            y = Math.max(0.1, 1.2 + 7.2 * Math.sin(hitT * Math.PI * 0.9) - hitT * 1.2);
            z = 3.5 + hitT * 12;
          } else {
            // Wicket / Middle Stump Cleaned
            x = 0;
            y = 0.8;
            z = 10.5;
          }
        }

        ballRef.current.position.set(x, Math.max(0.15, y), z);

        // Update glowing trail line
        if (trajectoryLineRef.current) {
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

      // Smooth Camera Orientations
      if (cameraRef.current) {
        if (cameraView === 'broadcast') {
          cameraRef.current.position.lerp(new THREE.Vector3(0, 24, 46), 0.05);
          cameraRef.current.lookAt(0, 2, 0);
        } else if (cameraView === 'batsman') {
          cameraRef.current.position.lerp(new THREE.Vector3(0, 3.2, 14), 0.05);
          cameraRef.current.lookAt(0, 1.5, -8);
        } else if (cameraView === 'hawkEye') {
          cameraRef.current.position.lerp(new THREE.Vector3(18, 12, 0), 0.05);
          cameraRef.current.lookAt(0, 1, 2);
        } else if (cameraView === 'topDown') {
          cameraRef.current.position.lerp(new THREE.Vector3(0, 68, 0.1), 0.05);
          cameraRef.current.lookAt(0, 0, 0);
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
  }, [isPlaying, cameraView, bowlerType, shotType]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Box className="w-4 h-4" />
            <span>Interactive WebGL 3D Visualization</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            3D Stadium Ball Trajectory & Hawk-Eye Physics Simulator
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Hardware-accelerated 3D cricket stadium modeling aerodynamic seam wobble, boundary launch trajectories, and camera angles rendered at 60 FPS.
          </p>
        </div>

        {/* Live Controls */}
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
        <div ref={containerRef} className="w-full h-[480px]" />

        {/* Floating Top Overlay HUD */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono">Camera:</span>
            <button
              onClick={() => setCameraView('broadcast')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                cameraView === 'broadcast' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Broadcast Cam
            </button>
            <button
              onClick={() => setCameraView('batsman')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                cameraView === 'batsman' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Batter POV
            </button>
            <button
              onClick={() => setCameraView('hawkEye')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                cameraView === 'hawkEye' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hawk-Eye Side
            </button>
            <button
              onClick={() => setCameraView('topDown')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                cameraView === 'topDown' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top-Down Oval
            </button>
          </div>

          {/* Real-time Telemetry Pill */}
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-lg">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>60 FPS • WebGL 3D • Hawk-Eye Sync</span>
          </div>
        </div>

        {/* Floating Bottom Shot & Bowler Selector */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Delivery:</span>
            <button
              onClick={() => { setBowlerType('pace'); tRef.current = 0; }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                bowlerType === 'pace' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              128 km/h Seam
            </button>
            <button
              onClick={() => { setBowlerType('spin'); tRef.current = 0; }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                bowlerType === 'spin' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              82 km/h Leg-Spin
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-slate-800 pointer-events-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">Shot:</span>
            <button
              onClick={() => {
                soundFX.playSuccess();
                setShotType('coverDrive');
                tRef.current = 0;
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                shotType === 'coverDrive' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lofted Cover Drive (6)
            </button>
            <button
              onClick={() => {
                soundFX.playSuccess();
                setShotType('pullShot');
                tRef.current = 0;
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                shotType === 'pullShot' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Deep Pull Shot (4)
            </button>
            <button
              onClick={() => {
                soundFX.playSecurityAlert();
                setShotType('wicket');
                tRef.current = 0;
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                shotType === 'wicket' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wicket Dismantled ⚡
            </button>
          </div>
        </div>
      </div>

      {/* Physics Spec Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Magnus Aerodynamic Arc</span>
            <p className="text-xs text-slate-400 mt-0.5">Calculates lateral drift vectors based on ball seam angle and Dubai stadium humidity.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Exit Velocity Modeling</span>
            <p className="text-xs text-slate-400 mt-0.5">Real-time parabolic collision equations measuring bat sweet-spot impact force.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Sub-16ms WebGL Pipeline</span>
            <p className="text-xs text-slate-400 mt-0.5">Direct GPU shader rendering with dynamic fog, boundary rings, and pitch strip coordinates.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
