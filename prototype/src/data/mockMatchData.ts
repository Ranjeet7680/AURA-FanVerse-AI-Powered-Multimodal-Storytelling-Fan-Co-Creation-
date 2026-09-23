export interface MicroReel {
  id: string;
  title: string;
  duration: string;
  player: string;
  role: string;
  matchContext: string;
  badge: string;
  videoThumb: string;
  youtubeId: string;
  category?: string;
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
    youtubeId: "5rVTbQxIczU",
    category: "Masterclass",
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
      te: "స్మృతి మంధాన అద్భుతమైన షాట్! ఆఫ్-స్పిన్నర్‌పై ముందుకు వచ్చి ఎక్స్‌ట్రా కవర్ మీదుగా భారీ సిక్సర్!",
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
    youtubeId: "Zv2UI9OdDqI",
    category: "Pace Attack",
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
      te: "రేణుకా సింగ్ అద్భుతమైన ఇన్‌స్వింగర్! ఐదో స్టంప్ లైన్ నుండి దూసుకొచ్చి మిడిల్ స్టంప్‌ను ఎగురగొట్టింది!",
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
    youtubeId: "vFICXUQZ5yg",
    category: "Clutch Defense",
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
      te: "చివరి ఓవర్లలో తాహిలా మెక్‌గ్రాత్ ఖచ్చితమైన యార్కర్ రక్షణ! అత్యంత ఒత్తిడిలో బౌండరీని అడ్డుకుంది!",
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
  },
  {
    id: "reel-4",
    youtubeId: "UK1QHWprmno",
    category: "Captaincy",
    title: "Harmanpreet Kaur's Fierce Sweep Against World #1 Spinner",
    duration: "0:28",
    player: "Harmanpreet Kaur",
    role: "Captain & Middle-Order (India)",
    matchContext: "IND-W vs ENG-W • Over 15.3 • Chase Accelerating",
    badge: "Captain's Knock 👑",
    videoThumb: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Harmanpreet gets down low on one knee, dispatching the left-arm spin over deep backward square leg!",
      hi: "हरमनप्रीत का तूफानी स्वीप शॉट! विश्व नंबर 1 स्पिनर के खिलाफ डीप बैकवर्ड स्क्वायर लेग पर चौका!",
      te: "హర్మన్‌ప్రీత్ కౌర్ విధ్వంసకర స్వీప్ షాట్! ప్రపంచ నంబర్ 1 స్పిన్నర్‌పై డీప్ బ్యాక్‌వర్డ్ స్క్వేర్ లెగ్‌కు బౌండరీ!",
      es: "¡Harmanpreet se arrodilla y conecta un barrido demoledor sobre square leg!",
      ar: "ضربة قوية ودقيقة من القائدة هارمانبريت تتجاوز الميدان ببراعة!",
      ta: "ஹர்மன்பிரீத் கவுரின் அபாரமான ஸ்வீப் ஷாட் பவுண்டரிக்கு விரண்டது!"
    },
    metrics: {
      exitVelocity: "122.1 km/h",
      launchAngle: "28°",
      distance: "68 meters",
      winProbChange: "+9.1% (IND)"
    },
    tacticalInsight: "Read the flight early and pre-empted the full length to generate maximum bottom-hand wrist roll."
  },
  {
    id: "reel-5",
    youtubeId: "AlLD0VTUjYI",
    category: "Fielding",
    title: "Jemimah Rodrigues Boundary Dive: 5 Runs Saved",
    duration: "0:19",
    player: "Jemimah Rodrigues",
    role: "Top-Order & Gun Fielder (India)",
    matchContext: "IND-W vs NZ-W • Over 17.5 • Boundary Save",
    badge: "Acrobatic Save 🧤",
    videoThumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Full-length horizontal airborne slide at deep extra cover to flick the ball back inches before ropes!",
      hi: "जेमिमा रोड्रिग्स की अविश्वसनीय डाइव! बाउंड्री रस्सी से ठीक पहले गेंद रोककर टीम के लिए रन बचाए!",
      te: "జెమిమా రోడ్రిగ్స్ నమ్మశక్యం కాని డైవ్! బౌండరీ లైన్ కంటే ముందే బంతిని ఆపి పరుగులను ఆదా చేసింది!",
      es: "¡Increíble salvada acrobática en el límite por Jemimah!",
      ar: "إنقاذ إعجازي من خيميمة على خط التماس ينقذ النقاط الحيوية!",
      ta: "ஜெமிமாவின் கண்கவர் பவுண்டரி தடுப்பு! அசாத்திய சுறுசுறுப்பு!"
    },
    metrics: {
      exitVelocity: "Sprint: 27.8 km/h",
      launchAngle: "Dive span: 2.3m",
      distance: "Flick back: 0.15m from rope",
      winProbChange: "+4.5% (IND)"
    },
    tacticalInsight: "Reaction time measured at 180ms from bat contact, enabling optimal trajectory anticipation."
  },
  {
    id: "reel-6",
    youtubeId: "c_yuQlq3l5M",
    category: "Spin Magic",
    title: "Deepti Sharma's Carrom Ball Trap: Clean Bowled",
    duration: "0:22",
    player: "Deepti Sharma",
    role: "Off-Spin All-Rounder (India)",
    matchContext: "IND-W vs SA-W • Over 9.4 • Middle Overs Choke",
    badge: "Spin Wizardry 🌀",
    videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Flicked with the middle finger, drifting into the right-hander before spinning away sharply to clip off peg!",
      hi: "दीप्ति शर्मा की कैरम बॉल का जादू! बल्लेबाज चकमा खा गई और गिल्लियां बिखर गईं!",
      te: "దీప్తి శర్మ క్యారమ్ బాల్ మాయాజాలం! బ్యాటర్‌ను బోల్తా కొట్టించి క్లీన్ బౌల్డ్ చేసింది!",
      es: "¡La carrom ball de Deepti desconcierta por completo a la bateadora y derriba los tocones!",
      ar: "دوران سحري ودقة خارقة من ديبتي شارما تخدع المدافعة!",
      ta: "தீப்தி சர்மாவின் கேரம் பால் மாயாஜாலம்! ஸ்டம்ப் தகர்ந்தது!"
    },
    metrics: {
      exitVelocity: "79.3 km/h",
      launchAngle: "Turn: 4.8°",
      distance: "Revs: 2150 RPM",
      winProbChange: "+8.9% (IND)"
    },
    tacticalInsight: "Hidden release masked by high-arm action; 4.8 degrees of late deviation against the forward push."
  },
  {
    id: "reel-7",
    youtubeId: "jFqLpe0rNTA",
    category: "Power Hitting",
    title: "Shafali Verma's No-Look Pull: Flat Over Square Leg",
    duration: "0:25",
    player: "Shafali Verma",
    role: "Explosive Opener (India)",
    matchContext: "IND-W vs SL-W • Over 1.4 • Powerplay Blitz",
    badge: "Maximum Force 💥",
    videoThumb: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Shafali picks the bouncer in a split second, muscling a devastating flat pull six over square leg!",
      hi: "शेफाली वर्मा का प्रचंड पुल शॉट! बाउंसर को खींचकर मारा फ्लैट छक्का!",
      te: "షఫాలీ వర్మ భారీ పుల్ షాట్! బౌన్సర్‌ను ఎదుర్కొని స్క్వేర్ లెగ్ మీదుగా ఫ్లాట్ సిక్సర్ కొట్టింది!",
      es: "¡Poder absoluto de Shafali con un golpe plano sobre square leg para 6!",
      ar: "قوة هائلة وضربة قاضية من شافالي فارما تهز الشباك!",
      ta: "ஷஃபாலி வர்மாவின் அசுர பலம் வாய்ந்த சிக்ஸர்! பவுண்டரிக்கு அப்பால் பறந்தது!"
    },
    metrics: {
      exitVelocity: "134.2 km/h",
      launchAngle: "19°",
      distance: "81 meters",
      winProbChange: "+12.1% (IND)"
    },
    tacticalInsight: "Short ball punished with extreme bat speed (94 km/h bat head velocity at impact)."
  },
  {
    id: "reel-8",
    youtubeId: "dCxLKsa7Qp4",
    category: "Death Bowling",
    title: "Shreyanka Patil: 3 Wickets in the 20th Over Climax",
    duration: "0:30",
    player: "Shreyanka Patil",
    role: "Off-Spinner / Death Specialist (India)",
    matchContext: "IND-W vs BAN-W • Over 20.0 • Match Decider",
    badge: "Hat-trick Hunt 🎩",
    videoThumb: "https://images.unsplash.com/photo-1531415074868-836332ff4296?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Cold-blooded courage under pressure: flighting the ball to pick 3 wickets in 4 balls and seal the win!",
      hi: "श्रेयंका पाटिल का 20वें ओवर में कहर! अंतिम 4 गेंदों में 3 विकेट चटकाकर मैच जिताया!",
      te: "శ్రేయంక పాటిల్ 20వ ఓవర్ క్లైమాక్స్! చివరి 4 బంతుల్లో 3 వికెట్లు పడగొట్టి విజయాన్ని ఖాయం చేసింది!",
      es: "¡Fría como el hielo! Shreyanka toma 3 wickets en el último over para sellar la victoria!",
      ar: "شجاعة استثنائية وثلاث إقصاءات في الشوط الحاسم من شريانكا!",
      ta: "ஷ்ரேயங்கா பாட்டீலின் கடைசி ஓவர் ருத்ரதாண்டவம்! 3 விக்கெட்டுகள் எடுத்து வெற்றி!"
    },
    metrics: {
      exitVelocity: "Dot balls: 4",
      launchAngle: "Economy in 20th: 3.0",
      distance: "Stump hits: 2",
      winProbChange: "+38.4% (IND)"
    },
    tacticalInsight: "Varying pace between 68 km/h and 84 km/h broke the batters' lunging sweep rhythm."
  },
  {
    id: "reel-9",
    youtubeId: "rfVR0cneCYg",
    category: "Grassroots Talent",
    title: "Puja Mahato's Inswinging Thunderbolts from Nepal",
    duration: "0:23",
    player: "Puja Mahato",
    role: "Fast Bowler (Nepal U-19)",
    matchContext: "ICC U-19 World Cup Qualifier • Over 4.1",
    badge: "Future Star 🌟",
    videoThumb: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "From Kathmandu to world stage: late banana swing breaching defense at 116 km/h!",
      hi: "नेपाल की सनसनी पूजा महतो! स्विंग होती गेंद ने बल्लेबाज को चारों खाने चित किया!",
      te: "నేపాల్ సంచలనం పూజా మహతో! 116 కిమీ/గం వేగంతో లేట్ అరటి స్వింగ్ బంతితో డిఫెన్స్‌ను ఛేదించింది!",
      es: "¡El talento emergente de Nepal sorprende con un swing imparable a 116 km/h!",
      ar: "الموهبة الصاعدة من نيبال بوجا ماهاتو تخطف الأنظار برميها المتقن!",
      ta: "நேபாளத்தின் இளம் புயல் பூஜா மஹதோவின் அற்புதமான ஸ்விங் பந்துவீச்சு!"
    },
    metrics: {
      exitVelocity: "116.4 km/h",
      launchAngle: "Swing: 3.4°",
      distance: "Target: Top of off",
      winProbChange: "+14.0% (NEP)"
    },
    tacticalInsight: "Upright seam position maintained with high wrist cock delivers persistent late aerodynamic deviation."
  },
  {
    id: "reel-10",
    youtubeId: "WHmWV7PdrgU",
    category: "Wicketkeeping",
    title: "Richa Ghosh Lightning 0.12s Stumping Dismissal",
    duration: "0:17",
    player: "Richa Ghosh",
    role: "Wicketkeeper-Batter (India)",
    matchContext: "IND-W vs WI-W • Over 11.2 • Flash Stumping",
    badge: "Lightning Reflexes ⚡",
    videoThumb: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Blink and you miss it: Richa whips the bails off in just 0.12s as batter's back foot lifts a millimeter!",
      hi: "ऋचा घोष की पलक झपकते स्टंपिंग! मात्र 0.12 सेकंड में गिल्लियां बिखेर दीं!",
      te: "రిచా ఘోష్ మెరుపు వేగపు స్టంపింగ్! కేవలం 0.12 సెకన్లలోనే బెయిల్స్‌ను గాల్లోకి లేపింది!",
      es: "¡Velocidad sobrehumana! Richa derriba los tocones en 0.12 segundos!",
      ar: "سرعة خارقة من ريتشا غوش في كسر الأخشاب في جزء من الثانية!",
      ta: "ரிச்சா கோஷின் மின்னல் வேக ஸ்டம்பிங்! 0.12 வினாடியில் விக்கெட் காலி!"
    },
    metrics: {
      exitVelocity: "Glove Speed: 0.12s",
      launchAngle: "Foot drag: 1.2 cm",
      distance: "Bail travel: 12 yds",
      winProbChange: "+8.5% (IND)"
    },
    tacticalInsight: "Kept hands soft and gathered right behind the off stump without gathering backwards, shaving 100ms off standard time."
  },
  {
    id: "reel-11",
    youtubeId: "sKfaxShVIKg",
    category: "Final Moments",
    title: "Championship Climax: The Final Ball Winning Moment",
    duration: "0:32",
    player: "Team India & Australia",
    role: "Championship Final",
    matchContext: "ICC Women's T20 World Cup Final • Over 20.0 • Dubai",
    badge: "Trophy Moment 🏆",
    videoThumb: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    caption: {
      en: "Dot ball on the final delivery triggers euphoria across 8.4 million fans synced live in the stadium & FanVerse!",
      hi: "अंतिम गेंद पर रोमांच की पराकाष्ठा! वर्ल्ड कप फाइनल का ऐतिहासिक विजयी क्षण!",
      te: "ప్రపంచ కప్ ఫైనల్ చారిత్రక విజయం! చివరి బంతి డాట్ కావడంతో 8.4 మిలియన్ల అభిమానుల సంబరాలు!",
      es: "¡El momento culminante del campeonato mundial celebrado por millones!",
      ar: "لحظة التتويج التاريخية بنهائي كأس العالم بحضور جماهيري ضخم!",
      ta: "உலகக் கோப்பை இறுதிப் போட்டியின் மறக்க முடியாத வரலாற்று வெற்றித் தருணம்!"
    },
    metrics: {
      exitVelocity: "Stadium Decibels: 114 dB",
      launchAngle: "Dot Ball",
      distance: "Trophy Securing",
      winProbChange: "+100% (WIN)"
    },
    tacticalInsight: "Flawless defensive field ring execution with 5 fielders boundary-riding prevented boundary opportunities."
  }
];

export interface LongMatchVideo {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  channel: string;
  category: string;
  matchContext: string;
  views: string;
  badge: string;
  thumbnail: string;
  description: string;
  tacticalAnalysis: string;
  keyMoments: { timestamp: string; title: string; over: string }[];
}

export const MOCK_LONG_VIDEOS: LongMatchVideo[] = [
  {
    id: "long-1",
    youtubeId: "-KPPUaUxlpo",
    title: "Full Match Masterclass: IND-W vs AUS-W Extended Tactical Breakdown",
    duration: "14:28",
    channel: "AURA Multimodal Telemetry Lab",
    category: "Full Analysis",
    matchContext: "ICC Women's T20 World Cup Final • Dubai Arena",
    views: "348K",
    badge: "Featured Breakdown 🌟",
    thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    description: "Comprehensive 16:9 tactical analysis dissecting the field placement chess match between Harmanpreet Kaur and Alyssa Healy across both innings.",
    tacticalAnalysis: "Pinpoints the exact inflection point in Over 14 when Australia's off-side squeeze failed against Mandhana's late-cut variations.",
    keyMoments: [
      { timestamp: "01:15", title: "Powerplay Field Ring Geometry", over: "Over 1-6" },
      { timestamp: "05:40", title: "Middle Overs Spin Web Choke", over: "Over 7-14" },
      { timestamp: "10:12", title: "Death Overs Yorker Defensive Trap", over: "Over 18-20" }
    ]
  },
  {
    id: "long-2",
    youtubeId: "UhmSfJ5QfB0",
    title: "The Multiverse Inning: Deep Q-Learning Replay & Alternative Outcomes",
    duration: "18:45",
    channel: "ICC Tech & Analytics Hub",
    category: "Multiverse Sim",
    matchContext: "World Cup Finals • Autonomous Physics Engine",
    views: "219K",
    badge: "AI Deep Dive 🧠",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    description: "What if Devine opened with spin? Deep reinforcement learning models simulate alternative trajectory branches with physics-based pitch responses.",
    tacticalAnalysis: "RL agent Q-values reveal that retaining the sweeper cover yielded a +14.2% higher victory probability than an attacking slip cordon.",
    keyMoments: [
      { timestamp: "02:20", title: "Standard Reality Telemetry Feed", over: "Match Feed" },
      { timestamp: "08:15", title: "RL Simulated Spin Alternate Arc", over: "Branch #14" },
      { timestamp: "14:30", title: "Win Probability Inversion Model", over: "Predictive HUD" }
    ]
  },
  {
    id: "long-3",
    youtubeId: "-2ovLs9xiNY",
    title: "Grassroots Revolution: How Associate Nations Are Changing Women's Cricket",
    duration: "12:15",
    channel: "AURA Future Stars Documentaries",
    category: "Documentary",
    matchContext: "Nepal, Thailand, Scotland & UAE Emergence",
    views: "182K",
    badge: "Grassroots Impact 💖",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    description: "Inspiring long-form story tracing grassroots stars from Kathmandu to Lord's, powered by fan micro-patronage and digital passports.",
    tacticalAnalysis: "Examines training biomechanics and ball release angles of associate nation fast bowlers developing international-caliber swing.",
    keyMoments: [
      { timestamp: "00:45", title: "Nepal U-19 World Stage Qualifier", over: "Kathmandu" },
      { timestamp: "04:30", title: "Biomechanics & High-Speed Seam Tracking", over: "Lab Telemetry" },
      { timestamp: "09:10", title: "Direct Fan Token Micro-Grants", over: "Passport Fund" }
    ]
  },
  {
    id: "long-4",
    youtubeId: "zQfg-e3QORc",
    title: "Broadcast Evolution: Behind the AI Multimodal Highlight Pipeline",
    duration: "16:04",
    channel: "Google DeepMind & ICC Innovation",
    category: "Tech Behind The Scenes",
    matchContext: "Dubai AI Festival Flagship Architecture",
    views: "295K",
    badge: "Architecture ⚡",
    thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    description: "Technical engineering documentary walking through sub-45s vertical reel generation, Three.js WebGL rendering, and zero-trust WAF shielding.",
    tacticalAnalysis: "Demonstrates edge video slicing algorithms and low-latency ElevenLabs neural multilingual voice synthesis pipelines.",
    keyMoments: [
      { timestamp: "01:50", title: "Edge Video Ingestion & Reframing", over: "Slicing Model" },
      { timestamp: "07:20", title: "Multi-Language Voice Synthesis in 280ms", over: "12 Dialects" },
      { timestamp: "12:40", title: "Zero-Trust Guard & Cyber Shield Defense", over: "HMAC Security" }
    ]
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
  },
  {
    id: "q-3",
    question: "Why drop the mid-off inside the circle against Sophie Devine on ball 18.2?",
    answer: "Australia's captain intentionally vacated long-off to bait Devine into hitting against the 18 km/h cross-breeze. By placing a deep cover sweeper and deep mid-wicket, the bowling side protected the wind-assisted boundary quadrants while dangling the aerial bait.",
    bowler: "Tahlia McGrath (Pace)",
    batter: "Sophie Devine (RHB)",
    fieldFocus: "Bait Mid-Off In / Deep Cover Sweeper",
    winProbability: {
      before: 55,
      after: 64,
      team: "Australia"
    },
    recommendedFieldingPositions: [
      { name: "Wicketkeeper", x: 50, y: 74, role: "Keeper" },
      { name: "Short Third", x: 65, y: 65, role: "Ring" },
      { name: "Point", x: 75, y: 50, role: "Ring" },
      { name: "Deep Cover Sweeper", x: 84, y: 35, highlight: true, role: "Boundary Shield" },
      { name: "Short Mid-Off", x: 58, y: 32, highlight: true, role: "Infield Bait" },
      { name: "Long-On", x: 38, y: 15, role: "Boundary" },
      { name: "Deep Mid-Wicket", x: 22, y: 38, highlight: true, role: "Boundary Shield" },
      { name: "Mid-Wicket", x: 32, y: 48, role: "Ring" },
      { name: "Deep Square Leg", x: 20, y: 64, role: "Boundary" },
      { name: "Fine Leg", x: 35, y: 80, role: "Boundary" },
      { name: "Bowler", x: 50, y: 35, role: "Bowler" }
    ],
    wagonWheel: [
      { angle: 45, distance: 60, runs: 1 },
      { angle: 110, distance: 45, runs: 0 },
      { angle: 160, distance: 78, runs: 4 },
      { angle: 280, distance: 50, runs: 1 }
    ]
  },
  {
    id: "q-4",
    question: "How does Deepti Sharma's carrom ball trick the left-handed batter?",
    answer: "Deepti changes her seam release from standard 11 o'clock scramble to a 1 o'clock thumb-flick. The aerodynamic Magnus effect causes 4.8° of late away-drift before pitching, then cuts sharply into the left-hander's off-stump corridor.",
    bowler: "Deepti Sharma (Off-Break)",
    batter: "Smriti Mandhana (LHB)",
    fieldFocus: "Leg Slip, Silly Point & Backward Square",
    winProbability: {
      before: 50,
      after: 61,
      team: "India"
    },
    recommendedFieldingPositions: [
      { name: "Wicketkeeper", x: 50, y: 72, role: "Keeper" },
      { name: "Leg Slip", x: 42, y: 74, highlight: true, role: "Trap Catcher" },
      { name: "Silly Point", x: 62, y: 58, highlight: true, role: "Close Infield" },
      { name: "Backward Point", x: 75, y: 55, role: "Ring" },
      { name: "Cover", x: 70, y: 38, role: "Ring" },
      { name: "Mid-Off", x: 58, y: 26, role: "Inner" },
      { name: "Long-On", x: 40, y: 15, role: "Boundary" },
      { name: "Deep Square Leg", x: 20, y: 60, role: "Boundary" },
      { name: "Short Fine Leg", x: 34, y: 76, role: "Ring" },
      { name: "Deep Mid-Wicket", x: 25, y: 40, role: "Boundary" },
      { name: "Bowler", x: 50, y: 35, role: "Bowler" }
    ],
    wagonWheel: [
      { angle: 25, distance: 40, runs: 0 },
      { angle: 80, distance: 30, runs: 0 },
      { angle: 210, distance: 65, runs: 2 }
    ]
  },
  {
    id: "q-5",
    question: "What is the optimal field setup against Shafali Verma in powerplay overs?",
    answer: "Data proves Shafali clears the inner ring over extra cover on 42% of powerplay balls. The optimal counter-strategy brings third man and fine leg up into the circle to post both deep point and deep extra cover on the boundary rope.",
    bowler: "Megan Schutt (In-Swing)",
    batter: "Shafali Verma (RHB)",
    fieldFocus: "Deep Extra Cover & Deep Point Boundary Rope",
    winProbability: {
      before: 46,
      after: 54,
      team: "Australia"
    },
    recommendedFieldingPositions: [
      { name: "Wicketkeeper", x: 50, y: 75, role: "Keeper" },
      { name: "First Slip", x: 57, y: 76, role: "Catcher" },
      { name: "Short Third Man", x: 66, y: 70, role: "Inner" },
      { name: "Deep Point", x: 82, y: 55, highlight: true, role: "Boundary Rope" },
      { name: "Deep Extra Cover", x: 78, y: 35, highlight: true, role: "Boundary Rope" },
      { name: "Mid-Off", x: 58, y: 28, role: "Inner" },
      { name: "Mid-On", x: 42, y: 28, role: "Inner" },
      { name: "Mid-Wicket", x: 30, y: 42, role: "Ring" },
      { name: "Short Square Leg", x: 32, y: 60, role: "Inner" },
      { name: "Short Fine Leg", x: 38, y: 75, role: "Inner" },
      { name: "Bowler", x: 50, y: 34, role: "Bowler" }
    ],
    wagonWheel: [
      { angle: 40, distance: 75, runs: 4 },
      { angle: 90, distance: 35, runs: 0 },
      { angle: 150, distance: 85, runs: 6 }
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

