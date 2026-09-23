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
  Layers,
  Target,
  Flame
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

// ─── ARTICULATED PLAYER RIG TYPES & BUILDERS ─────────────────────────────────
export interface BowlerRig {
  root: THREE.Group;
  hips: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  leftShoulder: THREE.Group;
  leftElbow: THREE.Group;
  rightShoulder: THREE.Group;
  rightElbow: THREE.Group;
  rightHand: THREE.Mesh;
  leftHip: THREE.Group;
  leftKnee: THREE.Group;
  rightHip: THREE.Group;
  rightKnee: THREE.Group;
}

export interface BatsmanRig {
  root: THREE.Group;
  hips: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  helmet: THREE.Mesh;
  grill: THREE.Mesh;
  leftShoulder: THREE.Group;
  leftElbow: THREE.Group;
  rightShoulder: THREE.Group;
  rightElbow: THREE.Group;
  batGroup: THREE.Group;
  leftHip: THREE.Group;
  leftKnee: THREE.Group;
  leftPad: THREE.Group;
  rightHip: THREE.Group;
  rightKnee: THREE.Group;
  rightPad: THREE.Group;
}

export interface WicketRig {
  group: THREE.Group;
  offStump: THREE.Mesh;
  middleStump: THREE.Mesh;
  legStump: THREE.Mesh;
  bail1: THREE.Mesh;
  bail2: THREE.Mesh;
}

function buildBowlerRig(): BowlerRig {
  const root = new THREE.Group();

  // Hips
  const hips = new THREE.Group();
  hips.position.y = 0.96;
  root.add(hips);

  const pelvisMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.6 });
  const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.22), pelvisMat);
  hips.add(pelvisMesh);

  // Torso
  const torso = new THREE.Group();
  torso.position.y = 0.09;
  hips.add(torso);

  const jerseyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 });
  const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.48, 16), jerseyMat);
  torsoMesh.position.y = 0.24;
  torsoMesh.castShadow = true;
  torso.add(torsoMesh);

  // Chest sponsor stripe
  const stripeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const stripeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.24), stripeMat);
  stripeMesh.position.set(0, 0.28, 0);
  torso.add(stripeMesh);

  // Collar
  const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 6, 16), collarMat);
  collar.position.set(0, 0.48, 0);
  collar.rotation.x = Math.PI / 2;
  torso.add(collar);

  // Head
  const head = new THREE.Group();
  head.position.set(0, 0.62, 0);
  torso.add(head);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.65 });
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMat);
  headMesh.castShadow = true;
  head.add(headMesh);

  // Cricket Cap with forward peak
  const capMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
  const capCrown = new THREE.Mesh(new THREE.SphereGeometry(0.145, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
  capCrown.position.y = 0.04;
  head.add(capCrown);

  const capPeak = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.12), capMat);
  capPeak.position.set(0, 0.06, 0.14);
  capPeak.rotation.x = 0.18;
  head.add(capPeak);

  // Left Arm (Counterbalance Arm)
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.25, 0.42, 0);
  torso.add(leftShoulder);

  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.28, 12), jerseyMat);
  leftUpperArm.position.y = -0.14;
  leftUpperArm.castShadow = true;
  leftShoulder.add(leftUpperArm);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.28, 0);
  leftShoulder.add(leftElbow);

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.26, 12), skinMat);
  leftForearm.position.y = -0.13;
  leftForearm.castShadow = true;
  leftElbow.add(leftForearm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), skinMat);
  leftHand.position.set(0, -0.27, 0);
  leftElbow.add(leftHand);

  // Right Arm (Bowling Arm - full 360 circumduction)
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.25, 0.42, 0);
  torso.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.30, 12), jerseyMat);
  rightUpperArm.position.y = -0.15;
  rightUpperArm.castShadow = true;
  rightShoulder.add(rightUpperArm);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.30, 0);
  rightShoulder.add(rightElbow);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.042, 0.28, 12), skinMat);
  rightForearm.position.y = -0.14;
  rightForearm.castShadow = true;
  rightElbow.add(rightForearm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), skinMat);
  rightHand.position.set(0, -0.29, 0);
  rightHand.castShadow = true;
  rightElbow.add(rightHand);

  // Legs (Trousers & Spiked Boots)
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
  const bootMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const soleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });

  // Left Leg
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.12, 0, 0);
  hips.add(leftHip);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 12), pantsMat);
  leftThigh.position.y = -0.21;
  leftThigh.castShadow = true;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.42, 0);
  leftHip.add(leftKnee);

  const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.42, 12), pantsMat);
  leftCalf.position.y = -0.21;
  leftCalf.castShadow = true;
  leftKnee.add(leftCalf);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.22), bootMat);
  leftBoot.position.set(0, -0.42, 0.04);
  leftBoot.castShadow = true;
  leftKnee.add(leftBoot);

  const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.02, 0.225), soleMat);
  leftSole.position.set(0, -0.46, 0.04);
  leftKnee.add(leftSole);

  // Right Leg
  const rightHip = new THREE.Group();
  rightHip.position.set(0.12, 0, 0);
  hips.add(rightHip);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.42, 12), pantsMat);
  rightThigh.position.y = -0.21;
  rightThigh.castShadow = true;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.42, 0);
  rightHip.add(rightKnee);

  const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.42, 12), pantsMat);
  rightCalf.position.y = -0.21;
  rightCalf.castShadow = true;
  rightKnee.add(rightCalf);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.22), bootMat);
  rightBoot.position.set(0, -0.42, 0.04);
  rightBoot.castShadow = true;
  rightKnee.add(rightBoot);

  const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.02, 0.225), soleMat);
  rightSole.position.set(0, -0.46, 0.04);
  rightKnee.add(rightSole);

  return {
    root,
    hips,
    torso,
    head,
    leftShoulder,
    leftElbow,
    rightShoulder,
    rightElbow,
    rightHand,
    leftHip,
    leftKnee,
    rightHip,
    rightKnee,
  };
}

function buildBatsmanRig(): BatsmanRig {
  const root = new THREE.Group();

  // Hips
  const hips = new THREE.Group();
  hips.position.y = 0.96;
  root.add(hips);

  const whitesMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
  const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.24), whitesMat);
  hips.add(pelvisMesh);

  // Torso
  const torso = new THREE.Group();
  torso.position.y = 0.09;
  hips.add(torso);

  const torsoMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.18, 0.50, 16), whitesMat);
  torsoMesh.position.y = 0.25;
  torsoMesh.castShadow = true;
  torso.add(torsoMesh);

  // Team insignia crest
  const crestMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), crestMat);
  crest.position.set(0.08, 0.36, 0.12);
  torso.add(crest);

  // Collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 16), whitesMat);
  collar.position.set(0, 0.50, 0);
  collar.rotation.x = Math.PI / 2;
  torso.add(collar);

  // Head & Helmet
  const head = new THREE.Group();
  head.position.set(0, 0.65, 0);
  torso.add(head);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), skinMat);
  head.add(headMesh);

  // Navy Cricket Helmet Shell
  const helmetMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.3 });
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.155, 16, 16), helmetMat);
  helmet.position.set(0, 0.03, -0.01);
  helmet.castShadow = true;
  head.add(helmet);

  // Steel Visor Grill
  const grillMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.95, roughness: 0.15 });
  const grill = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 6, 16, Math.PI), grillMat);
  grill.position.set(0, -0.04, 0.13);
  grill.rotation.x = Math.PI / 2;
  head.add(grill);

  // Grill horizontal safety bars
  [-0.03, -0.06].forEach((yOff) => {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.18, 6), grillMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, yOff, 0.14);
    head.add(bar);
  });

  // Left Arm (Top Hand - High Elbow)
  const leftShoulder = new THREE.Group();
  leftShoulder.position.set(-0.25, 0.44, 0);
  torso.add(leftShoulder);

  const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.052, 0.30, 12), whitesMat);
  leftUpperArm.position.y = -0.15;
  leftUpperArm.castShadow = true;
  leftShoulder.add(leftUpperArm);

  const leftElbow = new THREE.Group();
  leftElbow.position.set(0, -0.30, 0);
  leftShoulder.add(leftElbow);

  const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.28, 12), whitesMat);
  leftForearm.position.y = -0.14;
  leftForearm.castShadow = true;
  leftElbow.add(leftForearm);

  const gloveMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const leftGlove = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), gloveMat);
  leftGlove.position.set(0, -0.28, 0);
  leftGlove.castShadow = true;
  leftElbow.add(leftGlove);

  // Right Arm (Bottom Hand)
  const rightShoulder = new THREE.Group();
  rightShoulder.position.set(0.25, 0.44, 0);
  torso.add(rightShoulder);

  const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.052, 0.30, 12), whitesMat);
  rightUpperArm.position.y = -0.15;
  rightUpperArm.castShadow = true;
  rightShoulder.add(rightUpperArm);

  const rightElbow = new THREE.Group();
  rightElbow.position.set(0, -0.30, 0);
  rightShoulder.add(rightElbow);

  const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.28, 12), whitesMat);
  rightForearm.position.y = -0.14;
  rightForearm.castShadow = true;
  rightElbow.add(rightForearm);

  const rightGlove = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), gloveMat);
  rightGlove.position.set(0, -0.28, 0);
  rightGlove.castShadow = true;
  rightElbow.add(rightGlove);

  // Bat Group
  const batGroup = new THREE.Group();
  const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.38, 12), handleMat);
  handle.position.y = 0.42;
  batGroup.add(handle);

  const bladeMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.45 });
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.72, 0.075), bladeMat);
  blade.position.y = -0.05;
  blade.castShadow = true;
  batGroup.add(blade);

  const stickerMat = new THREE.MeshBasicMaterial({ color: 0xd97706 });
  const sticker = new THREE.Mesh(new THREE.BoxGeometry(0.132, 0.22, 0.077), stickerMat);
  sticker.position.y = 0.12;
  batGroup.add(sticker);

  batGroup.position.set(0.18, 0.22, 0.25);
  torso.add(batGroup);

  // Batting Pads
  const padMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x64748b });

  const createBattingPad = () => {
    const padGroup = new THREE.Group();
    const padShin = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.50, 0.12), padMat);
    padShin.position.set(0, -0.24, 0.04);
    padShin.castShadow = true;
    padGroup.add(padShin);

    const kneeRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.09, 0.12, 12), padMat);
    kneeRoll.position.set(0, 0.02, 0.05);
    kneeRoll.rotation.x = Math.PI / 2;
    padGroup.add(kneeRoll);

    [-0.12, -0.32].forEach((sy) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.025, 0.13), strapMat);
      strap.position.set(0, sy, 0.04);
      padGroup.add(strap);
    });

    return padGroup;
  };

  // Left Leg (Front Pad)
  const leftHip = new THREE.Group();
  leftHip.position.set(-0.14, 0, 0);
  hips.add(leftHip);

  const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.42, 12), whitesMat);
  leftThigh.position.y = -0.21;
  leftThigh.castShadow = true;
  leftHip.add(leftThigh);

  const leftKnee = new THREE.Group();
  leftKnee.position.set(0, -0.42, 0);
  leftHip.add(leftKnee);

  const leftPad = createBattingPad();
  leftKnee.add(leftPad);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.22), whitesMat);
  leftBoot.position.set(0, -0.48, 0.04);
  leftBoot.castShadow = true;
  leftKnee.add(leftBoot);

  // Right Leg (Back Pad)
  const rightHip = new THREE.Group();
  rightHip.position.set(0.14, 0, 0);
  hips.add(rightHip);

  const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.42, 12), whitesMat);
  rightThigh.position.y = -0.21;
  rightThigh.castShadow = true;
  rightHip.add(rightThigh);

  const rightKnee = new THREE.Group();
  rightKnee.position.set(0, -0.42, 0);
  rightHip.add(rightKnee);

  const rightPad = createBattingPad();
  rightKnee.add(rightPad);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.22), whitesMat);
  rightBoot.position.set(0, -0.48, 0.04);
  rightBoot.castShadow = true;
  rightKnee.add(rightBoot);

  root.position.set(0.35, 0, 9.2);
  root.rotation.y = Math.PI;

  return {
    root,
    hips,
    torso,
    head,
    helmet,
    grill,
    leftShoulder,
    leftElbow,
    rightShoulder,
    rightElbow,
    batGroup,
    leftHip,
    leftKnee,
    leftPad,
    rightHip,
    rightKnee,
    rightPad,
  };
}

function buildBattingWickets(zPos: number): WicketRig {
  const group = new THREE.Group();
  const stumpMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
  const bailMat = new THREE.MeshStandardMaterial({ color: 0xfde047 });

  const offStump = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12), stumpMat);
  offStump.position.set(0.28, 0.36, zPos);
  offStump.castShadow = true;
  group.add(offStump);

  const middleStump = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12), stumpMat);
  middleStump.position.set(0, 0.36, zPos);
  middleStump.castShadow = true;
  group.add(middleStump);

  const legStump = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 12), stumpMat);
  legStump.position.set(-0.28, 0.36, zPos);
  legStump.castShadow = true;
  group.add(legStump);

  const bail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), bailMat);
  bail1.position.set(0.14, 0.74, zPos);
  bail1.rotation.z = Math.PI / 2;
  group.add(bail1);

  const bail2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.18, 8), bailMat);
  bail2.position.set(-0.14, 0.74, zPos);
  bail2.rotation.z = Math.PI / 2;
  group.add(bail2);

  return {
    group,
    offStump,
    middleStump,
    legStump,
    bail1,
    bail2,
  };
}

export const CricketStadium3D: React.FC = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [cameraView, setCameraView] = useState<'broadcast' | 'batsman' | 'hawkEye' | 'topDown' | 'stumpCam' | 'drone' | 'ballFollow'>('broadcast');
  const [bowlerType, setBowlerType] = useState<'pace' | 'spin' | 'yorker'>('pace');
  const [shotType, setShotType] = useState<'coverDrive' | 'pullShot' | 'wicket' | 'straightDrive' | 'upperCut'>('coverDrive');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'twilight' | 'night'>('night');
  const [showTrajectory, setShowTrajectory] = useState<boolean>(true);
  const [show3dDiagram, setShow3dDiagram] = useState<boolean>(true);
  const [ballSpeed, setBallSpeed] = useState<number>(142);
  const [ballPhase, setBallPhase] = useState<'bowled' | 'hit' | 'idle'>('idle');
  const [actionStage, setActionStage] = useState<'runup' | 'gather' | 'release' | 'flight' | 'impact' | 'followThrough'>('runup');
  const [crowdFlashes, setCrowdFlashes] = useState<boolean>(true);

  const actionStageRef = useRef<'runup' | 'gather' | 'release' | 'flight' | 'impact' | 'followThrough'>('runup');
  const hasPlayedSoundRef = useRef<boolean>(false);
  const bowlerRigRef = useRef<BowlerRig | null>(null);
  const batsmanRigRef = useRef<BatsmanRig | null>(null);
  const battingWicketsRef = useRef<WicketRig | null>(null);
  const impactShockwaveRef = useRef<THREE.Mesh | null>(null);
  const impactLightRef = useRef<THREE.PointLight | null>(null);

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

    // ── 8B. 3D Tactical Coordinate Diagram & Vectors ─────────────────────────
    if (show3dDiagram) {
      // 3D Cartesian Axes Gizmo on Pitch (X: Red, Y: Green, Z: Blue)
      const axesHelper = new THREE.AxesHelper(6.5);
      axesHelper.position.set(0, 0.16, 0);
      scene.add(axesHelper);

      // Pitch Corridor Grid Diagram Lines
      const gridHelper = new THREE.GridHelper(18, 18, 0x06b6d4, 0xa855f7);
      gridHelper.position.set(0, 0.13, 0);
      scene.add(gridHelper);

      // Target Impact Radius Rings
      const targetRingGeo = new THREE.RingGeometry(0.8, 1.0, 32);
      const targetRingMat = new THREE.MeshBasicMaterial({ color: 0xec4899, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
      const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
      targetRing.rotation.x = Math.PI / 2;
      targetRing.position.set(0, 0.15, 4.5);
      scene.add(targetRing);
    }

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

    // ── 10. Batting End Stumps + Bowling End Stumps ─────────────────────────
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
    const battingWickets = buildBattingWickets(10.06);
    scene.add(battingWickets.group);
    battingWicketsRef.current = battingWickets;
    stumpsGroupRef.current = battingWickets.group;
    scene.add(createWickets(-10.06));

    // ── 11. Fully Articulated Batsman Model with Willow Bat, Helmet, and Pads ─
    const batsmanRig = buildBatsmanRig();
    scene.add(batsmanRig.root);
    batsmanRigRef.current = batsmanRig;
    batsmanGroupRef.current = batsmanRig.root;

    // ── 12. Fully Articulated Bowler Model with 4-Stage Biomechanics Rig ─────
    const bowlerRig = buildBowlerRig();
    scene.add(bowlerRig.root);
    bowlerRigRef.current = bowlerRig;
    bowlerGroupRef.current = bowlerRig.root;

    // ── 12B. Bat-Ball Contact Spark & Dynamic Impact Light ───────────────────
    const shockwaveGeo = new THREE.RingGeometry(0.15, 0.55, 32);
    const shockwaveMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockwave = new THREE.Mesh(shockwaveGeo, shockwaveMat);
    shockwave.rotation.x = -Math.PI / 2;
    scene.add(shockwave);
    impactShockwaveRef.current = shockwave;

    const impactLight = new THREE.PointLight(0xfef08a, 0, 14);
    scene.add(impactLight);
    impactLightRef.current = impactLight;

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

    // ── 17B. On-Field Umpires (Bowler End & Square Leg) ──────────────────────
    const createUmpire = (x: number, z: number, rotY: number) => {
      const uGroup = new THREE.Group();
      // Black trousers
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });
      [-0.11, 0.11].forEach((xOff) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.85, 8), pantsMat);
        leg.position.set(xOff, 0.42, 0);
        leg.castShadow = true;
        uGroup.add(leg);
      });
      // ICC Red Official Blazer
      const coatMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.5 });
      const coat = new THREE.Mesh(new THREE.CapsuleGeometry(0.26, 0.65, 6, 12), coatMat);
      coat.position.y = 1.15;
      coat.castShadow = true;
      uGroup.add(coat);
      // White shirt collar
      const shirtMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 4, 12), shirtMat);
      collar.position.set(0, 1.48, 0);
      collar.rotation.x = Math.PI / 2;
      uGroup.add(collar);
      // Head
      const headMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), headMat);
      head.position.y = 1.68;
      head.castShadow = true;
      uGroup.add(head);
      // White wide-brim sunhat
      const hatMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.02, 16), hatMat);
      brim.position.y = 1.78;
      uGroup.add(brim);
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.12, 16), hatMat);
      crown.position.y = 1.84;
      uGroup.add(crown);

      uGroup.position.set(x, 0, z);
      uGroup.rotation.y = rotY;
      return uGroup;
    };
    scene.add(createUmpire(0, -12.4, 0)); // Bowler's end umpire
    scene.add(createUmpire(22, 9.2, -Math.PI / 2)); // Square leg umpire

    // ── 17C. Non-Striker Batsman at Bowling End ──────────────────────────────
    const createNonStriker = (x: number, z: number) => {
      const nsGroup = new THREE.Group();
      const whitesMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 });
      [-0.12, 0.12].forEach((xOff) => {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.85, 8), whitesMat);
        pad.position.set(xOff, 0.42, 0.04);
        pad.castShadow = true;
        nsGroup.add(pad);
      });
      const jersey = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.65, 6, 12), whitesMat);
      jersey.position.y = 1.15;
      jersey.castShadow = true;
      nsGroup.add(jersey);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
      helmet.position.y = 1.68;
      helmet.castShadow = true;
      nsGroup.add(helmet);
      const batHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      batHandle.position.set(0.22, 0.72, 0.22);
      nsGroup.add(batHandle);
      const batBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.06), new THREE.MeshStandardMaterial({ color: 0xfde68a }));
      batBlade.position.set(0.22, 0.32, 0.22);
      batBlade.castShadow = true;
      nsGroup.add(batBlade);

      nsGroup.position.set(x, 0, z);
      nsGroup.rotation.y = 0;
      return nsGroup;
    };
    scene.add(createNonStriker(-1.8, -9.2));

    // ── 17D. Shaded Team Dugouts & Player Benches ─────────────────────────────
    const createTeamDugout = (xPos: number, teamName: string, primaryColor: number, secondaryColor: number) => {
      const dugoutGroup = new THREE.Group();
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.88,
      });
      const canopy = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 9, 16, 1, false, 0, Math.PI), roofMat);
      canopy.position.set(0, 3.2, 0);
      canopy.rotation.z = Math.PI / 2;
      dugoutGroup.add(canopy);

      const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      [-4.2, 4.2].forEach((xOff) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5, 8), frameMat);
        pillar.position.set(xOff, 1.75, 0);
        dugoutGroup.add(pillar);
      });

      const bench = new THREE.Mesh(new THREE.BoxGeometry(8, 0.45, 1.2), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      bench.position.set(0, 0.45, -0.6);
      dugoutGroup.add(bench);

      [-2.2, 0, 2.2].forEach((pX) => {
        const playerTorso = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.55, 6, 10), new THREE.MeshStandardMaterial({ color: primaryColor }));
        playerTorso.position.set(pX, 0.95, -0.6);
        dugoutGroup.add(playerTorso);
        const playerHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 10), new THREE.MeshStandardMaterial({ color: 0xc68642 }));
        playerHead.position.set(pX, 1.45, -0.6);
        dugoutGroup.add(playerHead);
        const playerCap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: secondaryColor }));
        playerCap.position.set(pX, 1.5, -0.6);
        dugoutGroup.add(playerCap);
      });

      const cooler = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.65), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      cooler.position.set(3.4, 0.35, 0.6);
      dugoutGroup.add(cooler);

      const signCanvas = document.createElement('canvas');
      signCanvas.width = 512;
      signCanvas.height = 64;
      const sCtx = signCanvas.getContext('2d')!;
      sCtx.fillStyle = '#0f172a';
      sCtx.fillRect(0, 0, 512, 64);
      sCtx.fillStyle = '#ffffff';
      sCtx.font = 'bold 28px sans-serif';
      sCtx.textAlign = 'center';
      sCtx.textBaseline = 'middle';
      sCtx.fillText(teamName, 256, 32);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signBoard = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 0.85), new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide }));
      signBoard.position.set(0, 3.4, 1.2);
      dugoutGroup.add(signBoard);

      dugoutGroup.position.set(xPos, 0, 0);
      dugoutGroup.lookAt(0, 0, 0);
      return dugoutGroup;
    };
    scene.add(createTeamDugout(48.5, '🇮🇳 TEAM INDIA WOMEN', 0x1d4ed8, 0xf97316));
    scene.add(createTeamDugout(-48.5, '🇦🇺 TEAM AUSTRALIA WOMEN', 0xfacc15, 0x15803d));

    // ── 17E. Boundary Triangular Foam Wedges (Toblerones) ────────────────────
    const numToblerones = 32;
    const tobleroneRadius = 47.1;
    const tobleroneGeo = new THREE.CylinderGeometry(0.22, 0.22, 1.4, 3);
    const tobleroneColors = [0x06b6d4, 0xec4899, 0xf59e0b, 0x3b82f6];

    for (let i = 0; i < numToblerones; i++) {
      const angle = (i / numToblerones) * Math.PI * 2;
      const tMat = new THREE.MeshStandardMaterial({
        color: tobleroneColors[i % tobleroneColors.length],
        roughness: 0.5,
      });
      const wedge = new THREE.Mesh(tobleroneGeo, tMat);
      wedge.position.set(Math.sin(angle) * tobleroneRadius, 0.12, Math.cos(angle) * tobleroneRadius);
      wedge.rotation.y = angle + Math.PI / 2;
      wedge.rotation.z = Math.PI / 2;
      scene.add(wedge);
    }

    // ── 17F. North End Mega Jumbotron Live World Cup Scoreboard ───────────────
    const northJumboGroup = new THREE.Group();
    const northFrame = new THREE.Mesh(new THREE.BoxGeometry(20, 10, 1.2), new THREE.MeshStandardMaterial({ color: 0x020617 }));
    northJumboGroup.add(northFrame);

    const northScreenCanvas = document.createElement('canvas');
    northScreenCanvas.width = 1024;
    northScreenCanvas.height = 512;
    const nsCtx = northScreenCanvas.getContext('2d')!;

    nsCtx.fillStyle = '#060416';
    nsCtx.fillRect(0, 0, 1024, 512);

    nsCtx.fillStyle = '#7c3aed';
    nsCtx.fillRect(0, 0, 1024, 60);
    nsCtx.fillStyle = '#ffffff';
    nsCtx.font = 'bold 28px monospace';
    nsCtx.fillText("ICC WOMEN'S T20 WORLD CUP FINAL • DUBAI", 30, 40);

    nsCtx.fillStyle = '#38bdf8';
    nsCtx.font = 'bold 72px monospace';
    nsCtx.fillText('IND-W  178/3', 40, 160);
    nsCtx.fillStyle = '#94a3b8';
    nsCtx.font = '36px monospace';
    nsCtx.fillText('18.4 OVERS', 560, 160);

    nsCtx.fillStyle = '#fbbf24';
    nsCtx.font = 'bold 36px monospace';
    nsCtx.fillText('TARGET: 192 • NEED 14 RUNS IN 8 BALLS', 40, 240);

    nsCtx.fillStyle = '#f472b6';
    nsCtx.font = 'bold 30px monospace';
    nsCtx.fillText('BAT: S. MANDHANA 84*(51)   H. KAUR 42(22)', 40, 320);

    nsCtx.fillStyle = '#34d399';
    nsCtx.font = '28px monospace';
    nsCtx.fillText('BOWL: M. SCHUTT 3.4-0-34-2', 40, 380);

    nsCtx.fillStyle = '#a855f7';
    nsCtx.font = 'bold 28px monospace';
    nsCtx.fillText('WIN SIM: IND-W 74.2% • CRR 9.53 • RRR 10.50', 40, 450);

    const northScreenTex = new THREE.CanvasTexture(northScreenCanvas);
    const northScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(18.5, 8.8), new THREE.MeshBasicMaterial({ map: northScreenTex }));
    northScreenMesh.position.z = 0.65;
    northJumboGroup.add(northScreenMesh);

    northJumboGroup.position.set(0, 26, -68);
    northJumboGroup.lookAt(0, 10, 0);
    scene.add(northJumboGroup);

    // ── 17G. Dubai Stadium "Ring of Fire" Roof LED Floodlight Halo ───────────
    const ringOfFireGroup = new THREE.Group();
    const ringRadius = 52.5;
    const ringY = 14.6;
    const numHaloLights = 80;

    for (let i = 0; i < numHaloLights; i++) {
      const angle = (i / numHaloLights) * Math.PI * 2;
      const lx = Math.sin(angle) * ringRadius;
      const lz = Math.cos(angle) * ringRadius;

      const fixMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.22, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
      );
      fixMesh.position.set(lx, ringY, lz);
      fixMesh.lookAt(0, 0, 0);
      ringOfFireGroup.add(fixMesh);

      const lensMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
        new THREE.MeshBasicMaterial({
          color: timeOfDay === 'day' ? 0xffffff : 0xfef08a,
        })
      );
      lensMesh.position.set(lx * 0.995, ringY - 0.1, lz * 0.995);
      ringOfFireGroup.add(lensMesh);
    }
    scene.add(ringOfFireGroup);

    // ── 17H. Sandy Sawdust Bowler Footing Crease Apron ────────────────────────
    const sawdustMat = new THREE.MeshStandardMaterial({ color: 0xa17e4b, roughness: 0.95 });
    [-9.6, 9.6].forEach((zP) => {
      const sawdust = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.02, 1.8), sawdustMat);
      sawdust.position.set(0, 0.145, zP);
      sawdust.receiveShadow = true;
      scene.add(sawdust);
    });

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

      // ── Ball Trajectory, Biomechanical Kinematics & Physics ────────────────
      if (isPlaying && ballRef.current) {
        tRef.current += bowlerType === 'spin' ? 0.013 : 0.018;
        if (tRef.current > 2.4) {
          tRef.current = 0;
          hasPlayedSoundRef.current = false;
        }

        const t = tRef.current;
        let x = 0;
        let y = 1.6;
        let z = -9.8;

        const bowler = bowlerRigRef.current;
        const batsman = batsmanRigRef.current;
        const wickets = battingWicketsRef.current;
        const shockwave = impactShockwaveRef.current;
        const impactLight = impactLightRef.current;

        // Reset Stumps & Bails if starting cycle
        if (t < 0.04 && wickets) {
          wickets.offStump.position.set(0.28, 0.36, 10.06);
          wickets.offStump.rotation.set(0, 0, 0);
          wickets.middleStump.position.set(0, 0.36, 10.06);
          wickets.middleStump.rotation.set(0, 0, 0);
          wickets.legStump.position.set(-0.28, 0.36, 10.06);
          wickets.legStump.rotation.set(0, 0, 0);
          wickets.bail1.position.set(0.14, 0.74, 10.06);
          wickets.bail1.rotation.set(0, 0, Math.PI / 2);
          wickets.bail2.position.set(-0.14, 0.74, 10.06);
          wickets.bail2.rotation.set(0, 0, Math.PI / 2);
        }

        if (t < 0.38) {
          // ── STAGE 1: RUN-UP & APPROACH (z: -17.2 -> -11.0) ──────────────────
          if (actionStageRef.current !== 'runup') {
            actionStageRef.current = 'runup';
            setActionStage('runup');
            setBallPhase('idle');
          }
          const runP = t / 0.38;
          const strideAngle = t * 26;

          if (bowler) {
            bowler.root.position.set(0, 0, -17.2 + runP * 6.2);
            bowler.hips.position.y = 0.96 + Math.abs(Math.sin(strideAngle)) * 0.08;
            bowler.torso.rotation.x = 0.22;
            bowler.torso.rotation.y = Math.sin(strideAngle) * 0.08;

            // Alternating running legs with knee drive
            bowler.leftHip.rotation.x = Math.sin(strideAngle) * 0.75;
            bowler.rightHip.rotation.x = -Math.sin(strideAngle) * 0.75;
            bowler.leftKnee.rotation.x = Math.max(0, -Math.sin(strideAngle) * 1.2);
            bowler.rightKnee.rotation.x = Math.max(0, Math.sin(strideAngle) * 1.2);

            // Arm pump
            bowler.leftShoulder.rotation.x = -Math.sin(strideAngle) * 0.7;
            bowler.leftShoulder.rotation.z = -0.2;
            bowler.rightShoulder.rotation.x = Math.sin(strideAngle) * 0.7;
            bowler.rightShoulder.rotation.z = 0.2;
            bowler.leftElbow.rotation.x = -0.6;
            bowler.rightElbow.rotation.x = -0.5;
          }

          // Ball is held in bowler's right hand
          x = (bowler ? bowler.root.position.x : 0) + 0.30;
          y = (bowler ? bowler.hips.position.y : 0.96) + 0.35 + Math.sin(strideAngle) * 0.12;
          z = (bowler ? bowler.root.position.z : -17.2) + 0.22;

          // Batsman ready stance & gentle tap
          if (batsman) {
            batsman.root.position.set(0.35, 0, 9.2);
            batsman.root.rotation.y = Math.PI;
            batsman.hips.position.y = 0.96;
            batsman.torso.rotation.set(0.08, 0, 0);
            batsman.batGroup.position.set(0.18, 0.22 + Math.abs(Math.sin(t * 12)) * 0.08, 0.25);
            batsman.batGroup.rotation.set(0.15, 0, -0.35);
            batsman.leftShoulder.rotation.set(-0.3, 0, -0.2);
            batsman.rightShoulder.rotation.set(-0.25, 0, 0.2);
            batsman.leftKnee.rotation.x = 0.22;
            batsman.rightKnee.rotation.x = 0.22;
          }

          setBallSpeed(24);

          // Hide impacts
          (impactRing.material as THREE.MeshBasicMaterial).opacity = 0;
          if (shockwave) (shockwave.material as THREE.MeshBasicMaterial).opacity = 0;
          if (impactLight) impactLight.intensity = 0;

        } else if (t < 0.48) {
          // ── STAGE 2: GATHER & DELIVERY BOUND (z: -11.0 -> -10.1) ───────────
          if (actionStageRef.current !== 'gather') {
            actionStageRef.current = 'gather';
            setActionStage('gather');
          }
          const gatherP = (t - 0.38) / 0.10;

          if (bowler) {
            bowler.root.position.set(0, 0, -11.0 + gatherP * 0.9);
            // Leap apex
            bowler.hips.position.y = 0.96 + Math.sin(gatherP * Math.PI) * 0.32;
            bowler.torso.rotation.x = -0.22 * Math.sin(gatherP * Math.PI);

            // Left non-bowling arm reaches high to sky
            bowler.leftShoulder.rotation.x = -1.8 - gatherP * 0.7;
            bowler.leftShoulder.rotation.z = -0.3;
            bowler.leftElbow.rotation.x = -0.3;

            // Right bowling arm cocks back
            bowler.rightShoulder.rotation.x = 0.8 + gatherP * 0.8;
            bowler.rightShoulder.rotation.z = 0.3;
            bowler.rightElbow.rotation.x = -0.7;

            // Stride bound leg tuck
            bowler.leftHip.rotation.x = -0.4;
            bowler.rightHip.rotation.x = 0.6;
            bowler.leftKnee.rotation.x = 0.8;
            bowler.rightKnee.rotation.x = 0.4;
          }

          // Ball remains cocked with right hand
          x = (bowler ? bowler.root.position.x : 0) + 0.32;
          y = (bowler ? bowler.hips.position.y : 0.96) + 0.58;
          z = (bowler ? bowler.root.position.z : -10.5) - 0.25;

          // Batsman triggers backlift
          if (batsman) {
            batsman.batGroup.position.set(0.18, 0.30 + gatherP * 0.15, 0.25);
            batsman.batGroup.rotation.set(0.15 + gatherP * 0.25, 0, -0.35 - gatherP * 0.4);
            batsman.leftShoulder.rotation.x = -0.3 - gatherP * 0.4;
            batsman.torso.rotation.y = gatherP * 0.12;
          }

          setBallSpeed(85);

        } else if (t < 0.52) {
          // ── STAGE 3: FRONT-FOOT PLANT & 360° HIGH RELEASE ──────────────────
          if (actionStageRef.current !== 'release') {
            actionStageRef.current = 'release';
            setActionStage('release');
            setBallPhase('bowled');
          }
          const relP = (t - 0.48) / 0.04;

          if (bowler) {
            bowler.root.position.set(0, 0, -10.1 + relP * 0.3);
            bowler.hips.position.y = 0.96;
            // Trunk snaps forward
            bowler.torso.rotation.x = 0.15 + relP * 0.42;

            // Left arm pulls down tight against ribs
            bowler.leftShoulder.rotation.x = 0.35 * relP;
            bowler.leftElbow.rotation.x = -1.2;

            // Right bowling arm completes 360 windmill overhead
            bowler.rightShoulder.rotation.x = -Math.PI * 0.35 - relP * Math.PI * 1.15;
            bowler.rightShoulder.rotation.z = 0.15;

            bowler.leftHip.rotation.x = 0.7; // Front foot plant
            bowler.rightHip.rotation.x = -0.5; // Drag back leg
            bowler.leftKnee.rotation.x = 0.1;
          }

          // Ball releases from hand at highest point (y = 2.38m)
          x = 0.24;
          y = 2.38 - relP * 0.15;
          z = -9.8 + relP * 0.7;

          setBallSpeed(bowlerType === 'pace' ? 142 : bowlerType === 'spin' ? 86 : 148);

        } else if (t < 1.0) {
          // ── STAGE 4: BALL IN FLIGHT & BOWLER FOLLOW-THROUGH ────────────────
          if (actionStageRef.current !== 'flight') {
            actionStageRef.current = 'flight';
            setActionStage('flight');
            setBallPhase('bowled');
          }
          const tau = (t - 0.52) / 0.48; // 0 to 1

          // Bowler follow-through and clearing the pitch danger area
          if (bowler) {
            bowler.root.position.set(-0.55 * Math.min(tau * 2.2, 1), 0, -9.8 + tau * 2.6);
            bowler.torso.rotation.x = 0.48;
            bowler.rightShoulder.rotation.x = 2.0;
            bowler.rightShoulder.rotation.z = 0.6;
            bowler.leftHip.rotation.x = Math.sin(tau * 14) * 0.4;
            bowler.rightHip.rotation.x = -Math.sin(tau * 14) * 0.4;
          }

          // Ball flight dynamics
          z = -9.1 + tau * 18.3; // Reaches batting crease (z = 9.2)

          if (bowlerType === 'yorker') {
            y = 2.23 - tau * 2.05;
            x = 0.24 * (1 - tau) + 0.1 * Math.sin(tau * 4);
          } else if (bowlerType === 'spin') {
            if (tau < 0.52) {
              const p1 = tau / 0.52;
              y = 2.23 - p1 * 2.08 + Math.sin(p1 * Math.PI) * 0.95;
              x = 0.24 * (1 - p1) - Math.sin(p1 * Math.PI) * 0.55;
            } else {
              const p2 = (tau - 0.52) / 0.48;
              y = 0.16 + Math.sin(p2 * Math.PI * 0.7) * 1.05;
              x = -0.32 + p2 * 0.82; // Sharp break off pitch
            }
          } else {
            // Pace Seam (142 km/h)
            if (tau < 0.55) {
              const p1 = tau / 0.55;
              y = 2.23 - p1 * 2.09 + Math.sin(p1 * Math.PI) * 0.45;
              x = 0.24 * (1 - p1) + 0.18 * Math.sin(p1 * Math.PI);
            } else {
              const p2 = (tau - 0.55) / 0.45;
              y = 0.16 + Math.sin(p2 * Math.PI * 0.72) * 1.15;
              x = 0.18 + p2 * 0.14;
            }
          }

          // Pitch impact splash
          if (tau > 0.50 && tau < 0.62) {
            impactRing.position.set(x, 0.16, z);
            (impactRing.material as THREE.MeshBasicMaterial).opacity = 0.85;
          } else {
            (impactRing.material as THREE.MeshBasicMaterial).opacity = 0;
          }

          // Batsman downswing to pitch of ball
          if (batsman) {
            const stride = Math.sin(tau * Math.PI * 0.5);
            if (shotType === 'coverDrive' || shotType === 'straightDrive') {
              batsman.leftKnee.rotation.x = 0.22 + stride * 0.42;
              batsman.torso.rotation.x = 0.08 + stride * 0.22;
              batsman.batGroup.rotation.z = -0.75 + stride * 0.5;
            } else if (shotType === 'pullShot') {
              batsman.rightKnee.rotation.x = 0.22 + stride * 0.35;
              batsman.root.rotation.y = Math.PI + stride * 0.5;
              batsman.batGroup.rotation.x = 0.4 - stride * 0.8;
            } else if (shotType === 'upperCut') {
              batsman.torso.rotation.x = 0.08 - stride * 0.25;
              batsman.batGroup.rotation.z = -0.75 + stride * 0.9;
            }
          }

          setBallSpeed(bowlerType === 'pace' ? 142 : bowlerType === 'spin' ? 86 : 148);

        } else if (t < 1.15) {
          // ── STAGE 5: BAT-BALL IMPACT / WICKET DISMANTLE ────────────────────
          if (actionStageRef.current !== 'impact') {
            actionStageRef.current = 'impact';
            setActionStage('impact');
            setBallPhase('hit');
          }

          // Trigger sound once per cycle
          if (!hasPlayedSoundRef.current) {
            if (shotType === 'wicket') {
              soundFX.playWicketShatter();
            } else {
              soundFX.playBatHit();
            }
            hasPlayedSoundRef.current = true;
          }

          const impactP = (t - 1.0) / 0.15;
          x = 0.32;
          y = 1.1;
          z = 9.2;

          // Luminous impact spark shockwave
          if (shockwave) {
            shockwave.position.set(x, y, z);
            shockwave.scale.setScalar(1 + impactP * 3);
            (shockwave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - impactP);
          }
          if (impactLight) {
            impactLight.position.set(x, y, z);
            impactLight.intensity = Math.max(0, 4.5 * (1 - impactP));
          }

          (impactRing.material as THREE.MeshBasicMaterial).opacity = 0;

        } else {
          // ── STAGE 6: SHOT EXECUTION, LAUNCH & POISED FOLLOW-THROUGH ────────
          if (actionStageRef.current !== 'followThrough') {
            actionStageRef.current = 'followThrough';
            setActionStage('followThrough');
            setBallPhase('hit');
          }
          const tauH = (t - 1.15) / 1.25; // 0 to 1

          if (shockwave) (shockwave.material as THREE.MeshBasicMaterial).opacity = 0;
          if (impactLight) impactLight.intensity = 0;

          if (shotType === 'coverDrive') {
            x = 0.32 + tauH * 26;
            y = Math.max(0.14, 1.1 + 8.8 * Math.sin(tauH * Math.PI * 0.85) - tauH * 1.5);
            z = 9.2 - tauH * 22;
          } else if (shotType === 'pullShot') {
            x = 0.32 - tauH * 30;
            y = Math.max(0.14, 1.1 + 7.5 * Math.sin(tauH * Math.PI * 0.88) - tauH * 1.4);
            z = 9.2 + tauH * 15;
          } else if (shotType === 'straightDrive') {
            x = 0;
            y = Math.max(0.14, 0.9 + 3.8 * Math.sin(tauH * Math.PI * 0.95) - tauH * 1.0);
            z = 9.2 - tauH * 36;
          } else if (shotType === 'upperCut') {
            x = 0.32 + tauH * 20;
            y = Math.max(0.14, 1.2 + 13.8 * Math.sin(tauH * Math.PI * 0.72) - tauH * 2.0);
            z = 9.2 + tauH * 20;
          } else {
            // Clean Bowled - Ball hits stumps & rolls
            x = 0.28;
            y = 0.24;
            z = 10.4 + tauH * 2.4;

            // Dismantle stumps & bails with angular physics
            if (wickets) {
              wickets.offStump.position.set(0.28, 0.36 + Math.sin(tauH * Math.PI) * 1.3, 10.06 + tauH * 8);
              wickets.offStump.rotation.set(-tauH * 7, 0, tauH * 4);

              wickets.bail1.position.set(0.14, Math.max(0.08, 0.74 + tauH * 3.5 - 5 * tauH * tauH), 10.06 + tauH * 5);
              wickets.bail1.rotation.x += delta * 15;

              wickets.bail2.position.set(-0.14, Math.max(0.08, 0.74 + tauH * 4.0 - 5 * tauH * tauH), 10.06 + tauH * 6);
              wickets.bail2.rotation.z += delta * 18;
            }
          }

          // Batsman Biomechanical Pose during follow-through
          if (batsman) {
            if (shotType === 'coverDrive') {
              batsman.root.rotation.y = Math.PI - 0.75;
              batsman.torso.rotation.set(0.35, 0.3, 0);
              batsman.leftShoulder.rotation.set(-1.25, 0, -0.85); // Classic high front elbow!
              batsman.leftKnee.rotation.x = 0.65; // Bent front knee
              batsman.batGroup.position.set(0.28, 0.45, 0.35);
              batsman.batGroup.rotation.set(0.45, 0, 1.15); // Upright high finish
            } else if (shotType === 'pullShot') {
              batsman.root.rotation.y = Math.PI + 1.25; // Swiveled into leg side
              batsman.torso.rotation.set(0.1, 0, 0);
              batsman.rightKnee.rotation.x = 0.55; // Back knee taking weight
              batsman.batGroup.position.set(-0.15, 0.5, 0.2);
              batsman.batGroup.rotation.set(-1.4, 0, 0.2); // Horizontal cross-bat wrapped around shoulder
            } else if (shotType === 'straightDrive') {
              batsman.root.rotation.y = Math.PI;
              batsman.torso.rotation.set(0.28, 0, 0);
              batsman.leftKnee.rotation.x = 0.5;
              batsman.batGroup.position.set(0.12, 0.6, 0.4);
              batsman.batGroup.rotation.set(1.4, 0, 0.05); // Vertical bat pointing down pitch
            } else if (shotType === 'upperCut') {
              batsman.root.rotation.y = Math.PI - 0.3;
              batsman.torso.rotation.set(-0.25, 0, 0); // Arched back
              batsman.batGroup.position.set(0.35, 0.7, 0.1);
              batsman.batGroup.rotation.set(-0.4, 0, 1.4); // High blade sliced over slips
            } else {
              // Wicket: Frozen beaten forward push with lowered head
              batsman.root.rotation.y = Math.PI;
              batsman.torso.rotation.set(0.42, 0, 0);
              batsman.batGroup.position.set(0.12, 0.15, 0.25);
              batsman.batGroup.rotation.set(0.2, 0, -0.2);
            }
          }

          // Wicketkeeper reaction
          if (wkGroup) {
            if (shotType === 'wicket') {
              wkGroup.position.y = Math.sin(tauH * Math.PI * 4) * 0.35; // Celebratory jumping
            } else {
              wkGroup.position.y = 0.2; // Upright stance
            }
          }

          setBallSpeed(
            shotType === 'coverDrive' ? 158 : shotType === 'pullShot' ? 152 :
            shotType === 'straightDrive' ? 164 : shotType === 'upperCut' ? 144 : 0
          );
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
        } else if (cameraView === 'ballFollow') {
          if (ballRef.current) {
            const bp = ballRef.current.position;
            const t = tRef.current;
            const bowler = bowlerRigRef.current;
            if (t < 0.48) {
              // Bowler Run-Up & Gather: Over-the-shoulder chase view tracking run-up
              const bz = bowler ? bowler.root.position.z : -16;
              const bx = bowler ? bowler.root.position.x : 0;
              cam.position.lerp(new THREE.Vector3(bx + 0.85, 2.5, bz - 3.4), 0.08);
              cam.lookAt(bp.x, bp.y + 0.25, bp.z + 10.0);
            } else if (t < 1.0) {
              // Dynamic ball flight chase camera trailing closely behind spinning seam
              const camZ = bp.z - 2.8;
              const camY = Math.max(0.65, bp.y + 0.55);
              const camX = bp.x * 0.45;
              cam.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.16);
              cam.lookAt(bp.x, bp.y, bp.z + 6.0);
            } else {
              // Post-contact ball trajectory tracking
              if (shotType === 'wicket') {
                // Focus on cartwheeling stumps & flying bails
                cam.position.lerp(new THREE.Vector3(1.4, 1.8, 13.5), 0.08);
                cam.lookAt(0, 0.75, 10.06);
              } else {
                // Follow the ball soaring towards boundary
                const dirX = Math.sign(bp.x) || 1;
                const camX = bp.x - dirX * 3.5;
                const camY = Math.max(1.8, bp.y + 2.2);
                const camZ = bp.z - 4.5;
                cam.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.09);
                cam.lookAt(bp.x, bp.y, bp.z);
              }
            }
          }
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
  }, [isPlaying, cameraView, bowlerType, shotType, timeOfDay, showTrajectory, crowdFlashes, show3dDiagram]);

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
              { key: 'ballFollow' as const, label: `${t('stadium.cam_ballfollow')} ⚡` },
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
          <div className="flex items-center gap-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono shadow-lg pointer-events-auto flex-wrap">
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
            {/* Live Action Stage Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-bold">
              <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className={`uppercase tracking-wide ${
                actionStage === 'runup' ? 'text-blue-400' :
                actionStage === 'gather' ? 'text-indigo-400' :
                actionStage === 'release' ? 'text-cyan-400' :
                actionStage === 'flight' ? 'text-amber-400' :
                actionStage === 'impact' ? 'text-pink-400 animate-bounce' :
                'text-emerald-400'
              }`}>
                {actionStage === 'runup' ? '🏃 18m Run-Up' :
                 actionStage === 'gather' ? '⚡ Gather & Bound' :
                 actionStage === 'release' ? '🎯 360° Release' :
                 actionStage === 'flight' ? '🚀 In Flight' :
                 actionStage === 'impact' ? '💥 Bat Impact' :
                 '🌟 Follow-Through'}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <span className={`font-bold ${
              ballPhase === 'bowled' ? 'text-cyan-400' : ballPhase === 'hit' ? 'text-pink-400' : 'text-slate-500'
            }`}>
              {ballPhase === 'bowled' ? t('stadium.in_flight') : ballPhase === 'hit' ? t('stadium.contact_made') : t('stadium.ready')}
            </span>
          </div>
        </div>

        {/* Floating 3D Vector Kinematics & Biomechanics Diagram HUD */}
        {show3dDiagram && (
          <div className="absolute top-18 left-4 p-3 rounded-2xl bg-[#0b061e]/90 border border-cyan-400/40 shadow-2xl backdrop-blur-xl text-xs font-mono max-w-sm space-y-2 pointer-events-auto">
            <div className="flex items-center justify-between text-cyan-300 border-b border-cyan-500/20 pb-1.5">
              <span className="font-bold flex items-center gap-1.5 text-[11px]">
                <Target className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                3D KINEMATICS & BIOMECHANICS
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">R³ VECTORS</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Bowler Biomechanics:</span>
                <span className="text-emerald-300 font-bold">
                  {actionStage === 'runup' ? '18m Stride (24 km/h)' :
                   actionStage === 'gather' ? 'Back-Foot Plant' :
                   actionStage === 'release' ? '360° Windmill (2.38m)' :
                   'Danger Crease Clearance'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Batter Stroke Dynamics:</span>
                <span className="text-pink-300 font-bold">
                  {actionStage === 'runup' || actionStage === 'gather' ? 'Crease Tap & Backlift' :
                   actionStage === 'flight' ? 'Stride to Pitch' :
                   shotType === 'coverDrive' ? 'High-Elbow Cover Drive' :
                   shotType === 'pullShot' ? 'Horizontal Swivel Pull' :
                   shotType === 'straightDrive' ? 'Vertical Straight Drive' :
                   shotType === 'upperCut' ? 'Arched Upper Cut' :
                   'Beaten Defense (Bowled)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Velocity Vector:</span>
                <span className="text-cyan-300 font-bold">
                  [{bowlerType === 'spin' ? '0.35' : '0.12'}, {-2.4}, {ballSpeed} km/h]
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Magnus Seam Drift:</span>
                <span className="text-pink-300 font-bold">Δx = +{bowlerType === 'spin' ? '1.82°' : '0.45°'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pitch Apex / Restitution:</span>
                <span className="text-amber-300 font-bold">h = 2.45m (e = 0.58)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active Camera Matrix:</span>
                <span className="text-purple-300 font-bold">{cameraView.toUpperCase()} (M_MVP)</span>
              </div>
            </div>
          </div>
        )}

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
                  hasPlayedSoundRef.current = false;
                  tRef.current = 0;
                  setBowlerType(d.key);
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
                  hasPlayedSoundRef.current = false;
                  tRef.current = 0;
                  setShotType(s.key);
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

          {/* 3D Diagram Mode Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              setShow3dDiagram(!show3dDiagram);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              show3dDiagram
                ? 'bg-pink-600/30 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                : 'bg-slate-950/85 border-slate-800 text-slate-500'
            } backdrop-blur-md`}
            title="Toggle 3D Vector & Kinematics Diagram"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3D Diagram</span>
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
