# AURA FanVerse: Fullstack Enterprise Architecture & Guide
**Challenge:** ICC Global Hackathon 2026 (Dubai AI Festival Showcase)  
**System Scope:** Frontend + FastAPI Backend + AI/ML Deep Learning + Reinforcement Learning + Zero-Trust Cybersecurity

---

## 🏗️ 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VITE + REACT 19 FRONTEND (Tailwind CSS)                  │
│  - Micro-Narratives Player (Autonomous 9:16 Video + Multilingual Voice TTS) │
│  - Tactical Co-Pilot (Interactive 2D Cricket Pitch Radar & AI Reasoning)   │
│  - Match Analytics & Win Probability Swings (Recharts Gradient Graphs)      │
│  - Q-Learning Tactical Field Optimizer Sandbox (Interactive MDP Policy)    │
│  - Cybersecurity Defense Center & SOC Real-time Audit Ledger               │
│  - Athlete Digital Passport & Grassroots Future Stars Fund                  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST / WebSocket
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                  FASTAPI ENTERPRISE CORE & SECURITY GATEWAY                 │
│                      (`server/main.py` • Port 8000)                         │
└──────────────────┬───────────────────┬───────────────────┬──────────────────┘
                   │                   │                   │
┌──────────────────▼──────┐ ┌──────────▼──────────┐ ┌──────▼──────────────────┐
│   AI/ML & DEEP LEARNING │ │   REINFORCEMENT     │ │     CYBERSECURITY       │
│  (`server/aiml/`        │ │  LEARNING AGENT     │ │    DEFENSE SHIELD       │
│   `deep_learning.py`)   │ │  (`server/aiml/`    │ │  (`server/security/`    │
│                         │ │   `rl_agent.py`)    │ │   `cyber_shield.py`)    │
│  - Deep Ball Trajectory │ │                     │ │                         │
│    PINN Physics Net     │ │  - Q-Learning Policy│ │  - HMAC-SHA256 Anti-    │
│  - 3D Action Classifier │ │    Iteration (MDP)  │ │    Tamper Telemetry     │
│    (Boundary/Wicket/    │ │  - Bellman Equation │ │  - Adversarial Prompt   │
│    Dot-Ball Softmax)    │ │    Reward Loop      │ │    Injection Firewall   │
│  - Multimodal Scripting │ │  - Policy Confidence│ │  - Real-time SOC Ledger │
│    & Speech Synthesis   │ │    & Convergence    │ │    & Intrusion Audits   │
└─────────────────────────┘ └─────────────────────┘ └─────────────────────────┘
```

---

## 🧠 2. Deep Learning & AI/ML Layer (`server/aiml/deep_learning.py`)

1. **Deep Trajectory Prediction Engine (`DeepTrajectoryEngine`)**:
   - Simulates a physics-informed neural network (PINN) taking release velocity, angle, and bowler type.
   - Computes real-time aerodynamic drag, seam deviation wobble, and pitch contact restitution across the 22-yard strip.
2. **Action Recognition Classifier (`ActionRecognitionClassifier`)**:
   - Softmax multi-class classifier predicting whether a moment is a `BOUNDARY_FOUR`, `BOUNDARY_SIX`, `WICKET_CAUGHT`, `WICKET_BOWLED`, or `DEFENSIVE_DOT` in sub-15ms inference time.

---

## 🤖 3. Reinforcement Learning Tactical Agent (`server/aiml/rl_agent.py`)

1. **Markov Decision Process (MDP) State Space:**
   - Batter Tendency (Off-side, Leg-side, 360° all-round)
   - Bowler Attack (Pace, Off-spin, Leg-spin)
   - Innings Phase (Powerplay, Middle overs, Death overs)
   - Match Pressure (Required run rate delta)
2. **Action Space:**
   - 5 Discrete Field Coordinates Formations: Slip Cordon, Deep Boundary Lock, Inner Ring Squeeze, Targeted Leg-Trap, Off-Side Cover Wall.
3. **Bellman Q-Learning Convergence:**
   - Rewards: $+10$ Wicket, $+5$ Dot-ball, $-6$ Boundary Four, $-12$ Boundary Six.
   - Interactive training runs step-by-step episodes live from the frontend interface.

---

## 🛡️ 4. Cybersecurity Defense Shield (`server/security/cyber_shield.py`)

1. **HMAC-SHA256 Anti-Tamper Telemetry Shield (`TelemetrySecurityShield`)**:
   - Cryptographically verifies incoming Hawk-Eye and stadium IoT ball telemetry packets.
   - Any packet modification in-flight immediately fails cryptographic validation and triggers an alert.
2. **Adversarial Prompt Injection & Jailbreak Firewall (`PromptInjectionFirewall`)**:
   - Guardrails the Tactical Co-Pilot chat against system prompt exfiltration, role hijacking, XSS, and SQL injection payloads.
3. **Security Operations Center (SOC) (`SecurityOpsCenter`)**:
   - Maintains an in-memory threat audit log with severity scores and request sanitization metrics.

---

## 💻 5. How to Run the Complete Stack

### Step 1: Launch FastAPI Backend Server
In PowerShell:
```powershell
cd server
python main.py
```
*API will run at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).*

### Step 2: Launch Frontend App
In a second PowerShell window:
```powershell
cd prototype
npm run dev
```
*Frontend will run at `http://localhost:5173`.*
