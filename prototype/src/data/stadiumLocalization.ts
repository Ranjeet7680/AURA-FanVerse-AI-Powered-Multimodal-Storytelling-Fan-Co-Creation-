// Multilingual Data Dictionary for 3D Cricket Stadium Simulator
// Languages: English (en), Hindi (hi), Spanish (es), Arabic (ar), Tamil (ta)

export interface StadiumTranslations {
  headerTag: string;
  headerTitle: string;
  headerSubtitle: string;
  cameraLabel: string;
  deliveryLabel: string;
  shotLabel: string;
  timeLabel: string;
  trailLabel: string;
  pauseLabel: string;
  playLabel: string;
  resetLabel: string;
  liveTag: string;
  phaseBowling: string;
  phaseShot: string;
  phaseCatch: string;
  phaseIdle: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  card4Title: string;
  card4Desc: string;
  // Banner notifications
  bannerSix: string;
  bannerFour: string;
  bannerWicket: string;
  bannerCatch: string;
  bannerDefense: string;
}

export const STADIUM_TRANSLATIONS: Record<string, StadiumTranslations> = {
  en: {
    headerTag: "Interactive WebGL 3D Visualization",
    headerTitle: "3D Stadium • Dynamic Hawk-Eye & Ball Trajectory Engine",
    headerSubtitle: "Full-scene cricket stadium with city skyline, player models, realistic shot mechanics, dynamic catching animations, and aerodynamic seam physics at 60 FPS.",
    cameraLabel: "Camera View:",
    deliveryLabel: "Bowling Style:",
    shotLabel: "Shot & Action:",
    timeLabel: "Time of Day:",
    trailLabel: "Trajectory Trail",
    pauseLabel: "Pause",
    playLabel: "Play",
    resetLabel: "Reset",
    liveTag: "LIVE 3D",
    phaseBowling: "DELIVERY IN FLIGHT",
    phaseShot: "SHOT STRUCK",
    phaseCatch: "DIVING CATCH!",
    phaseIdle: "WAITING",
    card1Title: "Magnus Aerodynamic Arc",
    card1Desc: "Calculates seam drift vectors based on ball seam angle and Dubai stadium humidity.",
    card2Title: "Exit Velocity Modeling",
    card2Desc: "Real-time parabolic collision equations measuring bat sweet-spot impact force.",
    card3Title: "Sub-16ms WebGL Pipeline",
    card3Desc: "Direct GPU shader rendering with dynamic floodlights, boundary rings, and pitch strip coordinates.",
    card4Title: "Fielding & Catching Physics",
    card4Desc: "Dynamic fielder sprint, intercept vectors, and diving catch simulations.",
    bannerSix: "MAXIMUM! 6 RUNS! 🚀",
    bannerFour: "CRACKING FOUR! 4 RUNS! 🔥",
    bannerWicket: "TIMBER! WICKET DISMANTLED! ⚡",
    bannerCatch: "OUT! SPECTACULAR DIVING CATCH! 🧤",
    bannerDefense: "SOLID FORWARD DEFENSE! 🛡️"
  },
  hi: {
    headerTag: "इंटरएक्टिव WebGL 3D विज़ुअलाइज़ेशन",
    headerTitle: "3D स्टेडियम • हॉक-आई बॉल ट्रैजेक्टरी एवं कैचिंग सिम्युलेटर",
    headerSubtitle: "पूरी तरह से रेंडर किया गया क्रिकेट स्टेडियम - सिटी स्काईलाइन, यथार्थवादी शॉट मैकेनिक्स, शानदार फील्डर कैचिंग एनीमेशन और सीम मूवमेंट के साथ 60 FPS पर।",
    cameraLabel: "कैमरा व्यू:",
    deliveryLabel: "गेंदबाजी शैली:",
    shotLabel: "शॉट एवं फील्डिंग एक्शन:",
    timeLabel: "समय:",
    trailLabel: "ट्रैजेक्टरी रेखा",
    pauseLabel: "रोकें",
    playLabel: "शुरू करें",
    resetLabel: "रीसेट",
    liveTag: "लाइव 3D",
    phaseBowling: "गेंदबाजी प्रगति पर",
    phaseShot: "शॉट खेला गया",
    phaseCatch: "शानदार कैच!",
    phaseIdle: "प्रतीक्षारत",
    card1Title: "मैग्नस एयरोडायनामिक ड्रिफ्ट",
    card1Desc: "सीम कोण और दुबई स्टेडियम की हवा के आधार पर गेंद के हवा में लहराव की गणना करता है।",
    card2Title: "एग्जिट वेलोसिटी मॉडल",
    card2Desc: "बल्ले के स्वीट-स्पॉट पर संपर्क बल और गेंद की गति का वास्तविक समय समीकरण।",
    card3Title: "सब-16ms WebGL पाइपलाइन",
    card3Desc: "फ्लडलाइट्स, बाउंड्री रिंग्स और कैनोपी रूफ के साथ डायरेक्ट GPU शेडर रेंडरिंग।",
    card4Title: "फील्डिंग एवं कैचिंग सिमुलेशन",
    card4Desc: "फील्डर का गेंद की ओर दौड़ना, डाइव लगाना और अविश्वसनीय कैच पकड़ना।",
    bannerSix: "गगनचुंबी छक्का! 6 रन! 🚀",
    bannerFour: "शानदार चौका! 4 रन! 🔥",
    bannerWicket: "क्लीन बोल्ड! स्टंप उखड़े! ⚡",
    bannerCatch: "शानदार डाइविंग कैच! आउट! 🧤",
    bannerDefense: "मजबूत रक्षात्मक ब्लॉक! 🛡️"
  },
  es: {
    headerTag: "Visualización WebGL 3D Interactiva",
    headerTitle: "Estadio 3D • Motor Hawk-Eye y Trayectoria de Balón",
    headerSubtitle: "Estadio de cricket a escala completa con horizonte de ciudad, modelos de jugadores, mecánicas de tiro realistas, atrapadas y física aerodinámica a 60 FPS.",
    cameraLabel: "Vista de Cámara:",
    deliveryLabel: "Estilo de Lanzamiento:",
    shotLabel: "Tiro y Acción:",
    timeLabel: "Momento del Día:",
    trailLabel: "Rastro de Trayectoria",
    pauseLabel: "Pausar",
    playLabel: "Reproducir",
    resetLabel: "Reiniciar",
    liveTag: "EN VIVO 3D",
    phaseBowling: "LANZAMIENTO EN VUELO",
    phaseShot: "GOLPE CONECTADO",
    phaseCatch: "¡ATRAPADA INCREÍBLE!",
    phaseIdle: "ESPERANDO",
    card1Title: "Arco Aerodinámico Magnus",
    card1Desc: "Calcula los vectores de deriva lateral basados en el ángulo de costura y humedad.",
    card2Title: "Modelado de Velocidad de Salida",
    card2Desc: "Ecuaciones de colisión parabólica que miden el impacto en el punto dulce del bate.",
    card3Title: "Pipeline WebGL Sub-16ms",
    card3Desc: "Renderizado de GPU con iluminación dinámica, postes y techos de gradas.",
    card4Title: "Física de Fildeo y Atrapadas",
    card4Desc: "Sprint dinámico del fildeador, vectores de intercepción y atrapadas acrobáticas.",
    bannerSix: "¡MÁXIMO! ¡6 CARRERAS! 🚀",
    bannerFour: "¡LÍMITE! ¡4 CARRERAS! 🔥",
    bannerWicket: "¡TOCÓN DESTROZADO! ¡OUT! ⚡",
    bannerCatch: "¡ESPECTACULAR ATRAPADA EN EL LÍMITE! 🧤",
    bannerDefense: "¡BLOQUEO DEFENSIVO SÓLIDO! 🛡️"
  },
  ar: {
    headerTag: "محاكاة ثلاثية الأبعاد تفاعلية عبر WebGL",
    headerTitle: "استاد كريكيت ثلاثي الأبعاد • محرك مسار الكرة وعين الصقر",
    headerSubtitle: "استاد كريكيت متكامل مع أفق المدينة، ونماذج اللاعبين، وفيزياء التسديد، وحركات الإمساك الأكروباتية، وديناميكا الهواء بمعدل 60 إطاراً في الثانية.",
    cameraLabel: "زاوية الكاميرا:",
    deliveryLabel: "أسلوب الرمي:",
    shotLabel: "الضربة وحركة الدفاع:",
    timeLabel: "وقت اليوم:",
    trailLabel: "أثر مسار الكرة",
    pauseLabel: "إيقاف مؤقت",
    playLabel: "تشغيل",
    resetLabel: "إعادة ضبط",
    liveTag: "مباشر 3D",
    phaseBowling: "الكرة في الهواء",
    phaseShot: "تم تسديد الكرة",
    phaseCatch: "إمساك طائر ناجح!",
    phaseIdle: "في الانتظار",
    card1Title: "قوس ماغنوس الديناميكي الهوائي",
    card1Desc: "حساب انحراف مسار الكرة في الهواء بناءً على زاوية الدرزة والرطوبة الجوية.",
    card2Title: "نمذجة سرعة انطلاق الكرة",
    card2Desc: "معادلات الاصطدام المباشر لنقطة القوة في المضرب وسرعة خروج الكرة.",
    card3Title: "معالجة رسومية في أقل من 16 مللي ثانية",
    card3Desc: "عرض مسرّع عبر المعالج الرسومي مع أضواء كاشفة وظلال تفاعلية كاملة.",
    card4Title: "محاكاة حركات الدفاع والإمساك",
    card4Desc: "انقضاض المدافعين، وتحديد مسار الاعتراض، وقفزات الإمساك الأكروباتية.",
    bannerSix: "ست نقاط مذهلة! 6 RUNS! 🚀",
    bannerFour: "ضربة حدود نارية! 4 RUNS! 🔥",
    bannerWicket: "سقوط الويكيت بالكامل! ⚡",
    bannerCatch: "إمساك استعراضي رائع بالقفز! 🧤",
    bannerDefense: "دفاع أمامي محكم! 🛡️"
  },
  ta: {
    headerTag: "ஊடாடும் WebGL 3D காட்சிப்படுத்தல்",
    headerTitle: "3D ஸ்டேடியம் • ஹாக்-ஐ பந்து பாதை மற்றும் கேட்ச் சிமுலேட்டர்",
    headerSubtitle: "நகர பின்னணி, வீரர்களின் அசைவுகள், துல்லியமான ஷாட்கள், டைவிங் கேட்ச்கள் மற்றும் காற்றியக்க சுழற்சியுடன் கூடிய முழுமையான 3D கிரிக்கெட் மைதானம் (60 FPS).",
    cameraLabel: "கேமரா கோணம்:",
    deliveryLabel: "பந்துவீச்சு முறை:",
    shotLabel: "ஷாட் மற்றும் செயல்:",
    timeLabel: "நேரம்:",
    trailLabel: "பந்து பாதை கோடு",
    pauseLabel: "நிறுத்து",
    playLabel: "இயக்கு",
    resetLabel: "மீட்டமை",
    liveTag: "நேரலை 3D",
    phaseBowling: "பந்து வீசப்படுகிறது",
    phaseShot: "ஷாட் அடிக்கப்பட்டது",
    phaseCatch: "டைவிங் கேட்ச்!",
    phaseIdle: "காத்திருப்பு",
    card1Title: "மேக்னஸ் காற்றியக்க வளைவு",
    card1Desc: "பந்து சீம் கோணம் மற்றும் மைதான காற்றின் அடிப்படையில் பந்து காற்றில் வளையும் பாதையை கணக்கிடுகிறது.",
    card2Title: "வெளியேறும் வேக மாதிரி",
    card2Desc: "மட்டையின் ஸ்வீட்-ஸ்பாட்டில் படும் விசையை கணக்கிடும் நிகழ்நேர சமன்பாடுகள்.",
    card3Title: "அதிவேக WebGL கட்டமைப்பு",
    card3Desc: "ஃப்ளட்லைட்டுகள், பவுண்டரி வளையங்கள் மற்றும் அரங்க கூரைகளுடன் GPU இயக்கம்.",
    card4Title: "பீல்டிங் & கேட்ச் இயற்பியல்",
    card4Desc: "பீல்டர் பந்தை நோக்கி ஓடுவது, டைவ் அடிப்பது மற்றும் அசத்தலான கேட்ச் பிடிப்பது.",
    bannerSix: "பிரம்மாண்ட சிக்ஸர்! 6 ரன்கள்! 🚀",
    bannerFour: "அட்டகாசமான பவுண்டரி! 4 ரன்கள்! 🔥",
    bannerWicket: "கிளீன் போல்ட்! ஸ்டம்புகள் காலி! ⚡",
    bannerCatch: "அற்புதமான டைவிங் கேட்ச்! அவுட்! 🧤",
    bannerDefense: "நேர்த்தியான தற்காப்பு பிளாக்! 🛡️"
  }
};

// 10 Camera Views with multilingual labels
export interface CameraOption {
  key: string;
  labels: Record<string, string>;
  pos: [number, number, number];
  lookAt: [number, number, number];
  isDynamic?: boolean;
}

export const STADIUM_CAMERAS: CameraOption[] = [
  {
    key: "broadcast",
    labels: {
      en: "Broadcast Cam",
      hi: "ब्रॉडकास्ट कैम",
      es: "Transmisión TV",
      ar: "البث التلفزيوني",
      ta: "ஒளிபரப்பு கேமரா"
    },
    pos: [0, 26, 54],
    lookAt: [0, 2, 0]
  },
  {
    key: "batsman",
    labels: {
      en: "Batter POV",
      hi: "बल्लेबाज नजरिया",
      es: "Vista Bateador",
      ar: "منظور الضارب",
      ta: "பேட்டர் பார்வை"
    },
    pos: [1.2, 2.6, 12],
    lookAt: [0, 1.2, -8]
  },
  {
    key: "bowler",
    labels: {
      en: "Bowler Run-Up",
      hi: "गेंदबाज रन-अप",
      es: "Carrera Lanzador",
      ar: "ركضة الرامي",
      ta: "பவுலர் ரன்-அப்"
    },
    pos: [0, 3.2, -18],
    lookAt: [0, 1.2, 10]
  },
  {
    key: "umpire",
    labels: {
      en: "Umpire POV",
      hi: "अंपायर नजरिया",
      es: "Vista Árbitro",
      ar: "منظور الحكم",
      ta: "நடுவர் பார்வை"
    },
    pos: [-1.2, 2.8, -12],
    lookAt: [0, 1.2, 10]
  },
  {
    key: "hawkEye",
    labels: {
      en: "Hawk-Eye Side",
      hi: "हॉक-आई साइड",
      es: "Ojo de Halcón",
      ar: "عين الصقر الجانبي",
      ta: "ஹாக்-ஐ பக்கம்"
    },
    pos: [22, 14, 0],
    lookAt: [0, 1, 2]
  },
  {
    key: "topDown",
    labels: {
      en: "Top-Down Oval",
      hi: "टॉप-डाउन ओवल",
      es: "Vista Cenital",
      ar: "منظور علوي",
      ta: "மேல் பார்வை"
    },
    pos: [0, 74, 0.1],
    lookAt: [0, 0, 0]
  },
  {
    key: "stumpCam",
    labels: {
      en: "Stump Cam",
      hi: "स्टंप कैमरा",
      es: "Cámara de Tocón",
      ar: "كاميرا الويكيت",
      ta: "ஸ்டம்ப் கேமரா"
    },
    pos: [0, 0.45, 10.4],
    lookAt: [0, 1.5, -10]
  },
  {
    key: "slips",
    labels: {
      en: "Slip Cordon",
      hi: "स्लिप कॉर्डन",
      es: "Cordón de Slips",
      ar: "منطقة السليب",
      ta: "ஸ்லிப் பார்வை"
    },
    pos: [4.5, 2.2, 13],
    lookAt: [0.2, 1.2, 8]
  },
  {
    key: "boundaryCatch",
    labels: {
      en: "Boundary Catch Cam",
      hi: "बाउंड्री कैच कैम",
      es: "Cámara de Atrapada",
      ar: "كاميرا إمساك الحدود",
      ta: "எல்லை கேட்ச் கேமரா"
    },
    pos: [28, 4.5, 34],
    lookAt: [24, 2, 28]
  },
  {
    key: "drone",
    labels: {
      en: "Drone Orbit",
      hi: "ड्रोन ऑर्बिट",
      es: "Drone Orbital",
      ar: "طائرة مسيرة",
      ta: "ட்ரோன் சுழற்சி"
    },
    pos: [35, 30, 35],
    lookAt: [0, 0, 0],
    isDynamic: true
  }
];

// 7 Bowling Styles with speed and labels
export interface BowlingOption {
  key: string;
  speed: number;
  labels: Record<string, string>;
  type: 'pace' | 'spin' | 'special';
}

export const STADIUM_BOWLING_STYLES: BowlingOption[] = [
  {
    key: "outswinger",
    speed: 145,
    type: "pace",
    labels: {
      en: "145 km/h Outswinger",
      hi: "145 km/h आउटस्विंगर",
      es: "145 km/h Outswing",
      ar: "145 كم/س آوت سوينغ",
      ta: "145 km/h அவுட்ஸ்விங்"
    }
  },
  {
    key: "inswinger",
    speed: 142,
    type: "pace",
    labels: {
      en: "142 km/h Inswinger",
      hi: "142 km/h इनस्विंगर",
      es: "142 km/h Inswing",
      ar: "142 كم/س إن سوينغ",
      ta: "142 km/h இன்ஸ்விங்"
    }
  },
  {
    key: "yorker",
    speed: 148,
    type: "pace",
    labels: {
      en: "148 km/h Toe-Crusher Yorker",
      hi: "148 km/h टो-क्रशर यॉर्कर",
      es: "148 km/h Yorker al Pie",
      ar: "148 كم/س يوركر ساحق",
      ta: "148 km/h டோ-கிரஷர் யார்க்கர்"
    }
  },
  {
    key: "bouncer",
    speed: 140,
    type: "pace",
    labels: {
      en: "140 km/h Sharp Bouncer",
      hi: "140 km/h तेज बाउंसर",
      es: "140 km/h Bouncer Rápido",
      ar: "140 كم/س باونسر حاد",
      ta: "140 km/h வேக பவுன்சர்"
    }
  },
  {
    key: "legspin",
    speed: 84,
    type: "spin",
    labels: {
      en: "84 km/h Leg-Break Drift",
      hi: "84 km/h लेग-स्पिन ड्रिफ्ट",
      es: "84 km/h Giro de Pierna",
      ar: "84 كم/س دوران ليغ سبين",
      ta: "84 km/h லெக்-ஸ்பின் சுழல்"
    }
  },
  {
    key: "carrom",
    speed: 88,
    type: "spin",
    labels: {
      en: "88 km/h Carrom Mystery Ball",
      hi: "88 km/h कैरम मिस्ट्री बॉल",
      es: "88 km/h Bola Carrom",
      ar: "88 كم/س كاروم خادعة",
      ta: "88 km/h கேரம் மிஸ்ட்ரி பால்"
    }
  },
  {
    key: "knuckle",
    speed: 112,
    type: "special",
    labels: {
      en: "112 km/h Slower Knuckle Ball",
      hi: "112 km/h स्लोअर नकल बॉल",
      es: "112 km/h Bola Lenta Nudillos",
      ar: "112 كم/س كرة ناكل بطيئة",
      ta: "112 km/h நக்கிள் மெதுவான பந்து"
    }
  }
];

// 10 Cricket Shots & Actions
export interface ShotOption {
  key: string;
  speed: number;
  actionType: 'six' | 'four' | 'catch' | 'wicket' | 'defense';
  labels: Record<string, string>;
}

export const STADIUM_SHOTS: ShotOption[] = [
  {
    key: "coverDrive",
    speed: 156,
    actionType: "six",
    labels: {
      en: "Lofted Cover Drive (6)",
      hi: "लॉफ्टेड कवर ड्राइव (6)",
      es: "Cover Drive Elevado (6)",
      ar: "ضربة كوفر هوائية (6)",
      ta: "லாஃப்டட் கவர் டிரைவ் (6)"
    }
  },
  {
    key: "pullShot",
    speed: 148,
    actionType: "four",
    labels: {
      en: "Deep Pull Shot (4)",
      hi: "डीप पुल शॉट (4)",
      es: "Pull Shot Profundo (4)",
      ar: "ضربة بول قوية (4)",
      ta: "டீப் புல் ஷாட் (4)"
    }
  },
  {
    key: "straightDrive",
    speed: 162,
    actionType: "four",
    labels: {
      en: "Bullet Straight Drive (4)",
      hi: "बुलेट स्ट्रेट ड्राइव (4)",
      es: "Straight Drive Bala (4)",
      ar: "ضربة مستقيمة صاروخية (4)",
      ta: "புல்லட் ஸ்ட்ரெய்ட் டிரைவ் (4)"
    }
  },
  {
    key: "upperCut",
    speed: 140,
    actionType: "six",
    labels: {
      en: "Upper Cut Over Slips (6)",
      hi: "अपर कट स्लिप्स के ऊपर (6)",
      es: "Upper Cut Sobre Slips (6)",
      ar: "ضربة علوية فوق السليب (6)",
      ta: "அப்பர் கட் சிக்ஸர் (6)"
    }
  },
  {
    key: "helicopter",
    speed: 165,
    actionType: "six",
    labels: {
      en: "Helicopter Wrist Whip (6)",
      hi: "धोनी हेलिकॉप्टर शॉट (6)",
      es: "Golpe Helicóptero (6)",
      ar: "ضربة الهليكوبتر الشهيرة (6)",
      ta: "ஹெலிகாப்டர் ஷாட் (6)"
    }
  },
  {
    key: "reverseSweep",
    speed: 135,
    actionType: "four",
    labels: {
      en: "Deft Reverse Sweep (4)",
      hi: "रिवर्स स्वीप बाउंड्री (4)",
      es: "Reverse Sweep Hábil (4)",
      ar: "سويب عكسي سريع (4)",
      ta: "ரிவர்ஸ் ஸ்வீப் (4)"
    }
  },
  {
    key: "scoop",
    speed: 142,
    actionType: "six",
    labels: {
      en: "Dilscoop Ramp Over Keeper (6)",
      hi: "दिलस्कूप ओवर कीपर (6)",
      es: "Dilscoop Sobre Guardián (6)",
      ar: "ضربة سكوب فوق الحارس (6)",
      ta: "தில்ஸ்கூப் சிக்ஸர் (6)"
    }
  },
  {
    key: "defense",
    speed: 15,
    actionType: "defense",
    labels: {
      en: "Solid Forward Defense (0)",
      hi: "सॉलिड फॉरवर्ड डिफेंस (0)",
      es: "Defensa Sólida Delantera (0)",
      ar: "دفاع أمامي كلاسيكي (0)",
      ta: "தற்காப்பு பிளாக் (0)"
    }
  },
  {
    key: "boundaryCatch",
    speed: 138,
    actionType: "catch",
    labels: {
      en: "Diving Boundary Catch! 🧤",
      hi: "शानदार बाउंड्री डाइविंग कैच! 🧤",
      es: "¡Atrapada Lanzándose al Límite! 🧤",
      ar: "إمساك طائر على الحدود! 🧤",
      ta: "அற்புதமான டைவிங் கேட்ச்! 🧤"
    }
  },
  {
    key: "wicket",
    speed: 0,
    actionType: "wicket",
    labels: {
      en: "Wicket Dismantled! ⚡",
      hi: "स्टंप उखड़े - बोल्ड! ⚡",
      es: "¡Tocón Destrozado! ⚡",
      ar: "سقوط الويكيت بالكامل! ⚡",
      ta: "விக்கெட் தூள் தூள்! ⚡"
    }
  }
];
