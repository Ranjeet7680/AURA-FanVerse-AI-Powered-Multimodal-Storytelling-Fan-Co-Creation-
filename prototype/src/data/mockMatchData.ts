export interface MicroReel {
  id: string;
  title: string;
  duration: string;
  player: string;
  role: string;
  matchContext: string;
  badge: string;
  videoThumb: string;
  caption: Record<string, string>;
  audioUrl?: string;
  metrics: {
    exitVelocity: string;
    launchAngle: string;
    distance: string;
    winProbChange: string;
  };
  tacticalInsight: string;
}

export interface TacticalQuery {
  id: string;
  question: string;
  answer: string;
  bowler: string;
  batter: string;
  fieldFocus: string;
  winProbability: {
    before: number;
    after: number;
    team: string;
  };
  recommendedFieldingPositions: {
    name: string;
    x: number; // percentage 0-100 from center
    y: number;
    highlight?: boolean;
    role: string;
  }[];
  wagonWheel: { angle: number; distance: number; runs: number }[];
}

export interface AthleteProfile {
  id: string;
  name: string;
  team: string;
  country: string;
  role: string;
  image: string;
  stats: {
    matches: number;
    strikeRate: number;
    economy?: number;
    wickets?: number;
    highScore?: string;
    fanTokensSupported: number;
  };
  journey: string;
  fundPurpose: string;
  targetFund: number;
  currentFund: number;
  badges: string[];
}

export const MOCK_REELS: MicroReel[] = [
  {
    id: "reel-1",
    title: "Smriti's Masterclass: Lofted Inside-Out Over Cover",
    duration: "0:24",
    player: "Smriti Mandhana",
    role: "Opening Batter (India)",
    matchContext: "IND-W vs AUS-W • Over 12.4 • Required RR: 8.2",
    badge: "Shot of the Day 🔥",
    videoThumb: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Smriti dances down against the off-spinner, opening the face with sublime timing for 6 over extra cover!",
      hi: "स्मृति मंधाना का जादुई शॉट! ऑफ-स्पिनर के खिलाफ आगे बढ़कर एक्स्ट्रा कवर के ऊपर से गगनचुंबी छक्का!",
      es: "¡Smriti Mandhana conecta un golpe sublime por encima de extra cover para un 6 memorable!",
      ar: "ضربة مذهلة من سمريتي ماندانا تتجاوز الحدود لست نقاط رائعة!",
      ta: "ஸ்மிருதி மந்தனாவின் அசாத்திய ஷாட்! எக்ஸ்ட்ரா கவர் மேல் அட்டகாசமான சிக்ஸர்!"
    },
    metrics: {
      exitVelocity: "128.4 km/h",
      launchAngle: "32°",
      distance: "74 meters",
      winProbChange: "+7.8% (IND)"
    },
    tacticalInsight: "Australia brought mid-off inside the circle to entice the lofted drive. Mandhana exploited the vacant deep extra cover quadrant."
  },
  {
    id: "reel-2",
    title: "Renuka's Seam Sorcery: Late Inswinger Cleans Up Stumps",
    duration: "0:18",
    player: "Renuka Singh Thakur",
    role: "Right-Arm Pacer (India)",
    matchContext: "IND-W vs AUS-W • Over 3.2 • Powerplay Breakthrough",
    badge: "Wicket Delivery ⚡",
    videoThumb: "https://images.unsplash.com/photo-1531415074868-836332ff4296?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Pitched on 5th stump line, nip-backer beats the forward defence to knock out the middle peg!",
      hi: "रेणुका सिंह की घातक इनस्विंगर! पांचवें स्टंप से गेंद अंदर आई और मिडिल स्टंप उखाड़ दिया!",
      es: "¡Una bola curva destructiva de Renuka vence la defensa y derriba el tocón!",
      ar: "كرة سريعة ودقيقة من رينوكا سينغ تقتلع القائم الأوسط بنجاح!",
      ta: "ரேணுகா சிங்கின் அசுர ஸ்விங் பந்துவீச்சு! மிடில் ஸ்டம்பை தகர்த்து அற்புதம்!"
    },
    metrics: {
      exitVelocity: "114.2 km/h",
      launchAngle: "-12°",
      distance: "Pitch length: 22 yds",
      winProbChange: "+11.4% (IND)"
    },
    tacticalInsight: "Consecutive outswingers setup the batter before delivering the scrambled seam nip-backer at 2.8° deviation."
  },
  {
    id: "reel-3",
    title: "Tahila McGrath's Clutch Death Overs Yorker Defense",
    duration: "0:21",
    player: "Tahlia McGrath",
    role: "All-Rounder (Australia)",
    matchContext: "AUS-W vs IND-W • Over 19.1 • Final Over Drama",
    badge: "Clutch Moment 🎯",
    videoThumb: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Pinpoint wide yorker executed under extreme pressure to deny the boundary in the penultimate over!",
      hi: "अंतिम ओवरों में ताहलिया का सटीक यॉर्कर! दबाव में सिर्फ 1 रन दिया!",
      es: "¡Yorker milimétrico en el momento cumbre para salvar el límite!",
      ar: "رمية ساحقة ودقيقة في اللحظات الأخيرة تنقذ الفريق!",
      ta: "கடைசி ஓவரில் தஹ்லியாவின் துல்லியமான யார்க்கர் பந்துவீச்சு!"
    },
    metrics: {
      exitVelocity: "119.8 km/h",
      launchAngle: "0°",
      distance: "Wide guide line",
      winProbChange: "+6.2% (AUS)"
    },
    tacticalInsight: "Executing at 8 inches outside off stump prevented the batter from generating horizontal bat leverage."
  }
];

export const MOCK_TACTICAL_QUERIES: TacticalQuery[] = [
  {
    id: "q-1",
    question: "Why did Harmanpreet set a deep backward square leg on ball 14.3?",
    answer: "Australia's batter Beth Mooney was consistently pre-meditating the lap sweep against the off-spin of Deepti Sharma. By dropping the short fine leg back to deep backward square leg (72m boundary edge), India closed the high-probability 4-run channel, forcing Mooney to hit into the wind or attempt riskier aerial cuts.",
    bowler: "Deepti Sharma (Off-Break)",
    batter: "Beth Mooney (LHB)",
    fieldFocus: "Deep Backward Square Leg & Wide Slip",
    winProbability: {
      before: 48,
      after: 56,
      team: "India"
    },
    recommendedFieldingPositions: [
      { name: "Wicketkeeper", x: 50, y: 72, role: "Keeper" },
      { name: "First Slip", x: 58, y: 74, role: "Catcher" },
      { name: "Backward Point", x: 74, y: 56, role: "Infielder" },
      { name: "Cover", x: 70, y: 40, role: "Ring" },
      { name: "Mid-Off", x: 58, y: 28, role: "Inner" },
      { name: "Mid-On", x: 42, y: 28, role: "Inner" },
      { name: "Mid-Wicket", x: 30, y: 42, role: "Ring" },
      { name: "Square Leg", x: 26, y: 55, role: "Ring" },
      { name: "Deep Backward Square", x: 18, y: 68, highlight: true, role: "Boundary Trap" },
      { name: "Long-On", x: 38, y: 14, role: "Boundary" },
      { name: "Bowler", x: 50, y: 35, role: "Bowler" }
    ],
    wagonWheel: [
      { angle: 30, distance: 60, runs: 1 },
      { angle: 45, distance: 75, runs: 4 },
      { angle: 120, distance: 40, runs: 0 },
      { angle: 150, distance: 82, runs: 6 },
      { angle: 220, distance: 55, runs: 2 },
      { angle: 300, distance: 48, runs: 1 },
      { angle: 340, distance: 70, runs: 4 }
    ]
  },
  {
    id: "q-2",
    question: "What is Renuka's tactical blueprint against Australia's top order?",
    answer: "Renuka bowls 78% of her powerplay deliveries on a fuller 5.5-meter length with 1.8° average seam wobble. Against right-handers, she attacks off-stump to induce defensive pushes to gully, while setting an umbrella ring with 3 catchers behind square.",
    bowler: "Renuka Singh (Pace)",
    batter: "Alyssa Healy (RHB)",
    fieldFocus: "Third Slip, Gully, Short Cover",
    winProbability: {
      before: 42,
      after: 51,
      team: "India"
    },
    recommendedFieldingPositions: [
      { name: "Wicketkeeper", x: 50, y: 76, role: "Keeper" },
      { name: "Slip 1", x: 56, y: 78, role: "Catcher" },
      { name: "Slip 2", x: 62, y: 76, highlight: true, role: "Catcher" },
      { name: "Gully", x: 72, y: 70, highlight: true, role: "Catcher" },
      { name: "Point", x: 78, y: 52, role: "Ring" },
      { name: "Cover", x: 68, y: 36, role: "Ring" },
      { name: "Mid-Off", x: 56, y: 25, role: "Inner" },
      { name: "Mid-On", x: 44, y: 25, role: "Inner" },
      { name: "Mid-Wicket", x: 32, y: 44, role: "Ring" },
      { name: "Fine Leg", x: 30, y: 80, role: "Boundary" },
      { name: "Bowler", x: 50, y: 32, role: "Bowler" }
    ],
    wagonWheel: [
      { angle: 15, distance: 50, runs: 1 },
      { angle: 60, distance: 68, runs: 4 },
      { angle: 80, distance: 35, runs: 0 },
      { angle: 190, distance: 40, runs: 1 },
      { angle: 260, distance: 30, runs: 0 },
      { angle: 310, distance: 75, runs: 4 }
    ]
  }
];

export const MOCK_ATHLETES: AthleteProfile[] = [
  {
    id: "ath-1",
    name: "Shreyanka Patil",
    team: "Royal Challengers Bengaluru / India",
    country: "India",
    role: "Off-Spin All-Rounder",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    stats: {
      matches: 28,
      strikeRate: 138.4,
      wickets: 34,
      economy: 6.82,
      highScore: "46*",
      fanTokensSupported: 14250
    },
    journey: "From Bangalore club nets to purple cap contender in the WPL, Shreyanka epitomizes modern fearless spin bowling.",
    fundPurpose: "Sponsoring specialized spin kinematics training & GPS monitors for Karnataka Grassroots Girls Academy.",
    targetFund: 5000,
    currentFund: 3820,
    badges: ["Rising Icon 2026", "WPL Champion", "Grassroots Patron"]
  },
  {
    id: "ath-2",
    name: "Mahika Gaur",
    team: "Thunder / England",
    country: "England / UAE",
    role: "Left-Arm Fast Bowler",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
    stats: {
      matches: 19,
      strikeRate: 112.0,
      wickets: 23,
      economy: 6.15,
      highScore: "18*",
      fanTokensSupported: 9800
    },
    journey: "A towering 6'2\" left-arm quick who developed her skills in Dubai's ICC Academy before making her senior international debut.",
    fundPurpose: "Providing cricket protective equipment and footwear for junior female fast-bowlers in associate UAE clubs.",
    targetFund: 4000,
    currentFund: 2950,
    badges: ["Pace Prodigy", "Dubai Heritage", "Future Leader"]
  },
  {
    id: "ath-3",
    name: "Gaby Lewis",
    team: "Ireland",
    country: "Ireland",
    role: "Top-Order Batter",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    stats: {
      matches: 74,
      strikeRate: 122.5,
      highScore: "105*",
      fanTokensSupported: 11200
    },
    journey: "Pioneering Irish women's cricket on the global franchise circuit with over 2,000 T20I runs.",
    fundPurpose: "Funding travel and coaching clinic scholarships for rural girls in Leinster youth cricket.",
    targetFund: 6000,
    currentFund: 5120,
    badges: ["Centurion", "Associate Trailblazer", "Captains Guild"]
  }
];

export const LIVE_OVER_METRICS = [
  { over: "Ov 10", runs: 7, indProb: 44, ausProb: 56, runRate: 7.2, wickets: 0 },
  { over: "Ov 11", runs: 12, indProb: 50, ausProb: 50, runRate: 7.6, wickets: 0 },
  { over: "Ov 12", runs: 15, indProb: 58, ausProb: 42, runRate: 8.2, wickets: 0 },
  { over: "Ov 13", runs: 4, indProb: 52, ausProb: 48, runRate: 7.9, wickets: 1 },
  { over: "Ov 14", runs: 11, indProb: 59, ausProb: 41, runRate: 8.1, wickets: 0 },
  { over: "Ov 15", runs: 14, indProb: 67, ausProb: 33, runRate: 8.5, wickets: 0 },
  { over: "Ov 16", runs: 8, indProb: 69, ausProb: 31, runRate: 8.5, wickets: 0 }
];

export const SHOT_SCATTER_DATA = [
  { shot: "Cover Drive", runs: 34, balls: 18, controlPct: 88, zone: "Off-Side" },
  { shot: "Pull / Hook", runs: 28, balls: 12, controlPct: 75, zone: "Leg-Side" },
  { shot: "Sweep / Reverse", runs: 22, balls: 15, controlPct: 67, zone: "Square-Leg" },
  { shot: "Straight Loft", runs: 19, balls: 8, controlPct: 92, zone: "V-Arc" },
  { shot: "Cut / Late Cut", runs: 14, balls: 10, controlPct: 80, zone: "Third-Man" }
];

