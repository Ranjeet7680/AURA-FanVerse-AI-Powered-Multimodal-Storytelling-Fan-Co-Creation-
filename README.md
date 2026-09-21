# AURA-FanVerse-AI-Powered-Multimodal-Storytelling-Fan-Co-Creation-

<p align="center">
  <img src="https://img.shields.io/badge/ICC_Global_Hackathon-Dubai_AI_Festival_2026-purple?style=for-the-badge&logo=cricket" alt="ICC Global Hackathon 2026" />
  <img src="https://img.shields.io/badge/Status-Pilot_Ready_Fullstack-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Security-Zero_Trust_HMAC_SHA256-red?style=for-the-badge&logo=security" alt="Cybersecurity" />
  <img src="https://img.shields.io/badge/AI_Engine-Deep_Learning_+_RL-blue?style=for-the-badge&logo=python" alt="AI Engine" />
  <img src="https://img.shields.io/badge/Architecture-12_System_Diagrams-emerald?style=for-the-badge" alt="Diagrams" />
</p>

> **AURA FanVerse** is an enterprise multimodal AI sports storytelling, conversational tactical co-piloting, and direct athlete micro-sponsorship ecosystem built for the **ICC Global Hackathon 2026 (Dubai AI Festival Showcase)**.
> 
> Targeting **Problem Statement 1 (Sport Visibility & Engagement)** and **Problem Statement 2 (Next-Gen Fan Experiences)** with a special mission to elevate **Women in Sport**.

---

# 📐 12 Comprehensive Architectural & Animated Flow Diagrams

---

### Diagram 1: High-Level 3D System Topology & Ingestion Pipeline
```mermaid
graph TD
    subgraph Stadium["🏟️ STADIUM EDGE LAYER (3D SENSING & BROADCAST)"]
        A1["📡 4K Ultra-HD 60FPS RTSP Broadcast Cam"]
        A2["⚡ Hawk-Eye 3D Trajectory & Seam Radar"]
        A3["🏏 Micro-Acoustic Stump Impact Sensors"]
    end

    subgraph SecurityGateway["🛡️ ZERO-TRUST SECURITY GATEWAY"]
        B1["🔐 HMAC-SHA256 Telemetry Anti-Tamper Shield"]
        B2["🛑 Adversarial LLM Prompt Injection WAF"]
        B3["📊 Real-Time SOC Incident Audit Ledger"]
    end

    subgraph CoreBackend["⚙️ FASTAPI ENTERPRISE CORE & AI/ML ENGINE"]
        C1["🧠 Deep Ball Trajectory Engine (PINN Physics Model)"]
        C2["🎯 3D Action Recognition Classifier (Sub-15ms Softmax)"]
        C3["🤖 Q-Learning Tactical Field Optimizer (MDP Agent)"]
        C4["🌐 Multimodal Neural Speech Synthesizer (12+ Dialects)"]
    end

    subgraph PresentationLayer["📱 REACT 19 + VITE ULTRA-MODERN CLIENT"]
        D1["📱 Vertical 9:16 Micro-Narrative Reel Player"]
        D2["🧭 Conversational Tactical Co-Pilot with 2D Pitch Radar"]
        D3["📈 Live Win-Probability & Momentum Swings (Recharts)"]
        D4["🎮 Interactive Reinforcement Learning Policy Sandbox"]
        D5["🛡️ Live Cybersecurity Defense Center & Testbed"]
        D6["💖 Athlete Digital Passport & Grassroots Future Stars Fund"]
    end

    Stadium -->|"Encrypted Streaming"| SecurityGateway
    SecurityGateway -->|"Sanitized Telemetry & Queries"| CoreBackend
    CoreBackend -->|"Real-time WebSocket & REST"| PresentationLayer
```

---

### Diagram 2: Multimodal Real-Time Play-by-Play Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Fan as 👤 Fan / Viewer
    participant UI as 📱 AURA FanVerse UI
    participant Gateway as 🛡️ Cyber Shield Gateway
    participant DL as 🧠 Deep Learning Vision Engine
    participant RL as 🤖 Q-Learning Tactical Agent
    participant TTS as 🗣️ Neural Voice Synthesizer

    Note over Fan,UI: Ball Bowled in Live ICC Match
    Gateway->>Gateway: Cryptographically Verify Stadium Packet (HMAC-SHA256)
    Gateway->>DL: Ingest 3D Video Frames & Ball Telemetry
    DL->>DL: Compute Seam Drift, Launch Angle & Exit Velocity
    DL->>DL: Classify Moment (Boundary Four / Wicket / Dot Ball)
    DL->>TTS: Generate 20-Sec Play-by-Play Narrative Script
    TTS-->>UI: Stream 9:16 Reel with Synthesized Commentary (English/Hindi/Spanish/Arabic/Tamil)
    
    Note over Fan,UI: Fan asks: "Why did the captain set a deep backward square leg?"
    UI->>Gateway: Submit Tactical Question
    Gateway->>Gateway: Adversarial Prompt Firewall Check (Jailbreak / Injection Scan)
    Gateway->>RL: Query Optimal Policy for Leg-Side Batter vs Off-Spin
    RL-->>UI: Return Converged Action + Dynamic 2D Pitch Coordinates + Win Swing Delta
    UI-->>Fan: Render Interactive 2D Pitch Oval & AI Tactical Analysis
```

---

### Diagram 3: Reinforcement Learning Bellman Optimization Loop
```mermaid
flowchart LR
    subgraph Environment["🏏 Cricket Field MDP Environment"]
        State["State (s):<br/>• Batter Tendency (Off/Leg/360)<br/>• Bowler Type (Pace/Spin)<br/>• Innings Phase (PP/Mid/Death)<br/>• Match Pressure (Run Rate)"]
    end

    subgraph Agent["🤖 Q-Learning Tactical Agent"]
        Policy["Q-Table / ε-Greedy Policy<br/>Q(s, a)"]
        Bellman["Bellman Equation Update:<br/>Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') - Q(s,a)]"]
    end

    subgraph ActionSpace["🎯 5 Strategic Field Coordinates"]
        A0["1. Slip Cordon"]
        A1["2. Deep Boundary Lock"]
        A2["3. Inner Ring Squeeze"]
        A3["4. Targeted Leg-Trap"]
        A4["5. Off-Side Wall"]
    end

    State --> Policy
    Policy --> ActionSpace
    ActionSpace -->|"Step & Evaluate Outcome"| Environment
    Environment -->|"Reward: +10 Wicket | +5 Dot | -6 Four | -12 Six"| Bellman
    Bellman --> Policy
```

---

### Diagram 4: Computer Vision Dynamic 9:16 Auto-Framing Pipeline
```mermaid
flowchart TD
    Video169["🎥 Raw 16:9 4K Broadcast Stream"] --> FrameSplit["Frame Splitter & Motion Saliency Grid"]
    FrameSplit --> PoseDetect["YOLO-Pose / BlazePose Athlete Landmark Tracker"]
    FrameSplit --> BallDetect["Deep Ball Trajectory & Seam Tracker"]
    
    PoseDetect --> SpatialFusion["Spatial Bounding Box Interpolator"]
    BallDetect --> SpatialFusion
    
    SpatialFusion --> SaliencyCenter["Dynamic Camera Focal Center Calculation"]
    SaliencyCenter --> CropEngine["9:16 Vertical Cropping & Horizon Stabilizer"]
    CropEngine --> TelemetryHUD["HUD Graphics Overlay (Exit Speed, Angle, Distance)"]
    TelemetryHUD --> PublishedReel["📱 9:16 Social Reel Published (<45s Latency)"]
```

---

### Diagram 5: Zero-Trust Telemetry Anti-Tamper & Cryptographic Shield
```mermaid
flowchart LR
    subgraph StadiumNode["🏟️ Stadium Sensor Node"]
        RawData["Hawk-Eye Telemetry Packet<br/>{speed: 124.5, seam: 2.4, ...}"]
        SecretKey["Shared Secret Key (K)"]
        RawData --> HMACGen["HMAC-SHA256 Signer"]
        SecretKey --> HMACGen
        HMACGen --> SignedPacket["Signed Packet + Digest"]
    end

    SignedPacket --> InTransit["🌐 Edge Cloud Ingestion"]

    subgraph DefenseGateway["🛡️ AURA Security Gateway"]
        InTransit --> Verify["HMAC Verifier Digest Match"]
        SecretKey2["Shared Secret Key (K)"] --> Verify
        Verify -->|Valid Signature| Pass["✅ Ingest into ML Pipeline"]
        Verify -->|Tampered / Spoofed| Block["🚨 Drop Packet & Trigger SOC Incident"]
    end
```

---

### Diagram 6: Adversarial Prompt Injection & LLM Guardrail State Machine
```mermaid
stateDiagram-v2
    [*] --> FanPromptReceived: User types question in Tactical Chat
    FanPromptReceived --> RegexScan: Match Jailbreak Patterns (DAN, Ignore Instructions)
    
    RegexScan --> ThreatDetected: Malicious pattern matched
    RegexScan --> SemanticAnalysis: Clean from direct regex
    
    SemanticAnalysis --> ThreatDetected: High Risk Score (> 0.75)
    SemanticAnalysis --> PassedGuardrail: Low Risk Score (< 0.05)
    
    ThreatDetected --> LogSOC: Record IP, Timestamp & Payload
    LogSOC --> DropAndError: HTTP 400 Security Incident Rejection
    DropAndError --> [*]
    
    PassedGuardrail --> VectorRAG: Query Cricket Tactics Knowledgebase
    VectorRAG --> GenerateResponse: Multimodal LLM Reasoning
    GenerateResponse --> OutputToFan: Display Tactical Analysis & 2D Coordinates
    OutputToFan --> [*]
```

---

### Diagram 7: Micro-Sponsorship Token Economy & Grassroots Distribution
```mermaid
flowchart TD
    Fan["👤 Global Fan / Community Member"] --> BuyTokens["Acquires Fan Tokens ($USD / Local Currency)"]
    BuyTokens --> Pledge["Pledges 50 Tokens to Emerging Female Athlete"]
    
    Pledge --> Splitter["Smart Token Allocation Engine"]
    
    Splitter -->|85% Direct Grant| Athlete["🏅 Athlete Equipment & Travel Wallet"]
    Splitter -->|15% Ring-Fence| FutureStars["🌱 ICC Future Stars Grassroots Fund"]
    
    FutureStars --> AssociateClinics["🏏 Associate Nation Training Academies (UAE, THA, SCO, NED)"]
    
    Pledge --> Gamification["Collectible Badges & Leaderboard Rank"]
    Gamification --> Fan
```

---

### Diagram 8: 2D Dynamic Cricket Pitch & Fielder Positioning Coordinate Engine
```mermaid
flowchart TD
    subgraph InputParameters["Live Match State"]
        Bowler["Bowler Action: Right-Arm Off-Spin"]
        Batter["Batter Weakness: Lap Sweep in Air"]
        Over["Match Phase: Death Overs (18.4)"]
    end

    InputParameters --> CoordinateEngine["Polar-to-Cartesian Field Coordinate Calculator"]
    
    CoordinateEngine --> CircleBoundary["Inner 30-Yard Ring Enforcement (Max 4/5 Outside)"]
    CoordinateEngine --> AngleCalc["Boundary Edge Angle Optimization (72m Boundary)"]
    
    AngleCalc --> VisualizerNode["Interactive 2D Pitch Oval Renderer"]
    VisualizerNode --> Fielder1["Fielder 1: Deep Backward Square Leg (Highlight Trap)"]
    VisualizerNode --> Fielder2["Fielder 2: Long-On"]
    VisualizerNode --> Fielder3["Fielder 3: Slip Cordon"]
    VisualizerNode --> FielderOther["Remaining 8 Infielders"]
```

---

### Diagram 9: Multilingual Neural Speech & Dialect Synthesis Pipeline
```mermaid
sequenceDiagram
    participant Telemetry as 📊 Match Telemetry
    participant LLM as 🧠 Multimodal LLM Scriptwriter
    participant LangSelect as 🌐 Language Dispatcher
    participant NeuralTTS as 🗣️ Neural Voice Synthesizer
    participant AudioStream as 🔊 Web Audio Streamer

    Telemetry->>LLM: Ingest exit velocity (128.4 km/h), player (Smriti Mandhana)
    LLM->>LLM: Compose high-energy 20-second dramatic script
    LLM->>LangSelect: Forward base script
    
    par English Synthesis
        LangSelect->>NeuralTTS: Synthesize English (en-US / en-IN)
    and Hindi Synthesis
        LangSelect->>NeuralTTS: Synthesize Hindi (hi-IN)
    and Spanish Synthesis
        LangSelect->>NeuralTTS: Synthesize Español (es-ES)
    and Arabic Synthesis
        LangSelect->>NeuralTTS: Synthesize العربية (ar-SA)
    and Tamil Synthesis
        LangSelect->>NeuralTTS: Synthesize தமிழ் (ta-IN)
    end
    
    NeuralTTS-->>AudioStream: Synchronize with 9:16 Video Millisecond Timestamps
```

---

### Diagram 10: Win-Probability & Momentum Neural Network Architecture
```mermaid
graph LR
    subgraph FeatureInputs["Input Feature Vector (X)"]
        F1["Current Score / Wickets"]
        F2["Balls Remaining"]
        F3["Required Run Rate"]
        F4["Historical Venue Pitch Par Score"]
        F5["Current Bowler vs Batter Head-to-Head"]
    end

    subgraph DeepLayers["Multi-Layer Perceptron (MLP) + LSTM"]
        L1["Dense Layer (128 Neurons, ReLU)"]
        L2["LSTM Temporal Over Memory (64 Hidden Units)"]
        L3["Dropout (0.2 Regularization)"]
        L4["Softmax Output Layer"]
    end

    subgraph Prediction["Real-Time Live Probabilities"]
        P1["Team A Win Probability (%)"]
        P2["Team B Win Probability (%)"]
        P3["Expected Boundary Risk Index"]
    end

    F1 & F2 & F3 & F4 & F5 --> L1
    L1 --> L2 --> L3 --> L4
    L4 --> P1 & P2 & P3
```

---

### Diagram 11: Microservice Container & Cloud Infrastructure Architecture
```mermaid
flowchart TD
    subgraph EdgeIngest["Edge CDN & Ingestion Nodes"]
        Cloudflare["Cloudflare Edge Workers (DDoS & TLS 1.3 Termination)"]
        VideoCDN["HLS / DASH Video Chunking CDN"]
    end

    subgraph KubernetesCluster["Scalable Container Pods (GCP / AWS)"]
        FastAPI_Pod1["FastAPI Core Pod 1"]
        FastAPI_Pod2["FastAPI Core Pod 2"]
        AIML_Worker["PyTorch & Deep Learning GPU Pod (T4 / A10G)"]
        RL_Worker["Q-Learning Tactical Inference Worker"]
        RedisCache["Redis In-Memory State & PubSub (<5ms)"]
    end

    subgraph StorageLayer["Data & Persistence Layer"]
        Postgres["PostgreSQL (Athlete Profiles & Fan Passports)"]
        VectorDB["Qdrant / ChromaDB (Cricket Tactical Embeddings)"]
        ObjectStore["S3 / GCS (Rendered 9:16 Highlight MP4s)"]
    end

    Cloudflare --> FastAPI_Pod1 & FastAPI_Pod2
    FastAPI_Pod1 & FastAPI_Pod2 <--> RedisCache
    FastAPI_Pod1 & FastAPI_Pod2 --> AIML_Worker & RL_Worker
    FastAPI_Pod1 --> Postgres & VectorDB & ObjectStore
    ObjectStore --> VideoCDN
```

---

### Diagram 12: End-to-End Fan Journey State Progression
```mermaid
stateDiagram-v2
    [*] --> Discover: Fan opens mobile web or ICC App
    Discover --> WatchMicroReel: Watches autonomous 9:16 vertical story
    WatchMicroReel --> SwitchLanguage: Changes audio to Hindi/Arabic/Spanish/Tamil
    
    WatchMicroReel --> TacticalCuriosity: Wondering why field was placed
    TacticalCuriosity --> AskCoPilot: Submits tactical question to AI
    AskCoPilot --> Explore2DRadar: Interacts with 2D pitch oval & boundary traps
    
    Explore2DRadar --> SupportAthlete: Discovers grassroots female athlete
    SupportAthlete --> MicroPledge: Pledges 50 tokens with celebratory confetti
    MicroPledge --> UnlockBadge: Receives digital badge & Future Stars impact proof
    UnlockBadge --> [*]
```

---

## 🌟 Key Pillars & Features

| Module | Technologies | What It Does |
|---|---|---|
| **📱 Micro-Narratives Hub** | Multimodal AI, React, Web Speech API | Autonomous 9:16 vertical highlights in <45s with real-time HUD telemetry and voice commentary in 5 languages. |
| **🧭 Tactical Co-Pilot** | Vector RAG, Coordinate Geometry, React | Natural-language conversational strategy companion with dynamic 2D field radar and win-probability delta metrics. |
| **📊 Match Analytics Radar** | Recharts, Area/Bar/Radar Visualizers | Dynamic win probability area charts, head-to-head tactical balance radars, and pitch quadrant scoring efficiency. |
| **🤖 RL Tactical Optimizer** | Python, NumPy, Q-Learning, MDP | Autonomous reinforcement learning agent training optimal 11-player field configurations against batter shot distributions. |
| **🛡️ Cybersecurity SOC** | HMAC-SHA256, Regex Firewall, Token Bucket | Anti-tamper telemetry packet signing, adversarial prompt injection shield, and real-time SOC incident ledger. |
| **💖 Athlete Digital Passport** | Canvas Confetti, Gamification | Grassroots micro-sponsorship hub backing women cricketers with 15% dedicated to the ICC Future Stars Fund. |

---

## 📂 Repository Contents

* 📊 **[15-Slide Master Pitch Deck (PPTX)](docs/AURA_FanVerse_Pitch_Deck.pptx):** Professionally styled 16:9 presentation.
* 📑 **[15-Slide Presentation Reference (Markdown)](docs/PITCH_DECK_15_SLIDES.md)**
* 📝 **[2-Page Executive Summary Paper](docs/EXECUTIVE_SUMMARY.md)**
* 🎬 **[3-Minute Demo Video Pitch Script](docs/DEMO_VIDEO_SCRIPT.md)**
* 🏛️ **[Fullstack Technical Architecture Doc](docs/FULLSTACK_ARCHITECTURE.md)**
* ⚡ **`server/`:** FastAPI backend with deep learning trajectory engine, RL agent, and cybersecurity shield.
* 💻 **`prototype/`:** React 19 + TypeScript + Vite frontend with Tailwind CSS and Recharts.

---

## 🚀 Quickstart Guide

### 1. Launch FastAPI Backend
```bash
cd server
python main.py
```
*API runs at `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).*

### 2. Launch Interactive Frontend
```bash
cd prototype
npm install
npm run dev
```
*Frontend opens at `http://localhost:5173`.*

---

## 👥 Built for ICC Global Hackathon 2026
*Showcase Destination: **Dubai AI Festival (October 2026)** at the Ignyte Innovation Hub.*
