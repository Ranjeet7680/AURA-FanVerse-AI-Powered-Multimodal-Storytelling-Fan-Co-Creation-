// Multilingual Tactical Knowledge Base & Localization for AURA FanVerse Tactical Co-Pilot
// Supported Languages: English (en), Hindi (hi), Spanish (es), Arabic (ar), Tamil (ta)

export interface LanguageConfig {
  code: 'en' | 'hi' | 'es' | 'ar' | 'ta';
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
  dir: 'ltr' | 'rtl';
  voiceLangHints: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    bcp47: 'en-US',
    dir: 'ltr',
    voiceLangHints: ['en-US', 'en-GB', 'en-IN', 'en']
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
    bcp47: 'hi-IN',
    dir: 'ltr',
    voiceLangHints: ['hi-IN', 'hi']
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    bcp47: 'es-ES',
    dir: 'ltr',
    voiceLangHints: ['es-ES', 'es-MX', 'es']
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    bcp47: 'ar-SA',
    dir: 'rtl',
    voiceLangHints: ['ar-SA', 'ar-AE', 'ar-EG', 'ar']
  },
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    bcp47: 'ta-IN',
    dir: 'ltr',
    voiceLangHints: ['ta-IN', 'ta-LK', 'ta']
  }
};

export interface LocalizedTacticalQuery {
  id: string;
  category: 'Captaincy' | 'Spin' | 'Powerplay';
  bowler: string;
  batter: string;
  fieldFocus: Record<string, string>;
  question: Record<string, string>;
  answer: Record<string, string>;
  winProbability: {
    before: number;
    after: number;
    team: Record<string, string>;
  };
  recommendedFieldingPositions: {
    name: Record<string, string>;
    x: number;
    y: number;
    highlight?: boolean;
    role: Record<string, string>;
  }[];
}

export const LOCALIZED_TACTICAL_QUERIES: LocalizedTacticalQuery[] = [
  {
    id: "q-1",
    category: "Captaincy",
    bowler: "Deepti Sharma (Off-Break)",
    batter: "Beth Mooney (LHB)",
    fieldFocus: {
      en: "Deep Backward Square Leg & Wide Slip",
      hi: "डीप बैकवर्ड स्क्वायर लेग और वाइड स्लिप",
      es: "Deep Backward Square Leg y Slip Amplio",
      ar: "لاعب deep backward square leg و slip عريض",
      ta: "டீப் பேக்வர்ட் ஸ்கொயர் லெக் & வைட் ஸ்லிப்"
    },
    question: {
      en: "Why did Harmanpreet set a deep backward square leg on ball 14.3?",
      hi: "हरमनप्रीत कौर ने 14.3 ओवर पर डीप बैकवर्ड स्क्वायर लेग क्यों लगाया?",
      es: "¿Por qué Harmanpreet colocó un deep backward square leg en la bola 14.3?",
      ar: "لماذا وضعت هارمانبريت كاور لاعب deep backward square leg في الكرة 14.3؟",
      ta: "14.3 பந்தில் ஹர்மன்பிரீத் டீப் பேக்வர்ட் ஸ்கொயர் லெக் பீல்டரை ஏன் வைத்தார்?"
    },
    answer: {
      en: "Australia's batter Beth Mooney was consistently pre-meditating the lap sweep against Deepti Sharma's off-spin. By dropping short fine leg back to deep backward square leg (72m boundary edge), India closed the high-probability 4-run channel, forcing Mooney to hit into the wind or attempt riskier aerial cuts.",
      hi: "ऑस्ट्रेलियाई बल्लेबाज बेथ मूनी दीप्ति शर्मा की ऑफ-स्पिन पर लगातार लैप स्वीप खेलने की योजना बना रही थीं। शॉर्ट फाइन लेग को 72 मीटर की बाउंड्री पर डीप बैकवर्ड स्क्वायर लेग में तब्दील करके, भारत ने 4 रनों के आसान चैनल को अवरुद्ध कर दिया और मूनी को हवा के विपरीत जोखिम भरा शॉट खेलने पर मजबूर किया।",
      es: "La bateadora australiana Beth Mooney estaba premeditando el barrido lap sweep contra el off-spin de Deepti Sharma. Al retroceder short fine leg hacia deep backward square leg (a 72 metros en el límite), India cerró el canal de 4 carreras de alta probabilidad, forzando a Mooney a jugar con mayor riesgo.",
      ar: "كانت الضاربة الأسترالية بيث موني تخطط مسبقاً لضربة lap sweep ضد كرات ديبتي شارما الدوارة. ومن خلال إرجاع لاعب short fine leg إلى deep backward square leg على بعد 72 متراً، أغلقت الهند زاوية النقاط الأربع عالية الاحتمالية، مما أجبر موني على المخاطرة بتسديدات هوائية صعبة.",
      ta: "ஆஸ்திரேலிய பேட்டர் பெத் மூனி, தீப்தி சர்மாவின் ஆஃப்-ஸ்பின்னுக்கு எதிராக லேப் ஸ்வீப் ஷாட்டை திட்டமிட்டு அடித்து வந்தார். ஷார்ட் பைன் லெக் பீல்டரை 72 மீட்டர் தூரமுள்ள டீப் பேக்வர்ட் ஸ்கொயர் லெக்கிற்கு நகர்த்தியதன் மூலம், இந்தியா 4 ரன்கள் செல்லும் பாதையை அடைத்து மூனியை அதிக ஆபத்துள்ள ஷாட் அடிக்க வைத்தது."
    },
    winProbability: {
      before: 48,
      after: 56,
      team: { en: "India", hi: "भारत", es: "India", ar: "الهند", ta: "இந்தியா" }
    },
    recommendedFieldingPositions: [
      { name: { en: "Wicketkeeper", hi: "विकेटकीपर", es: "Guardián", ar: "حارس الويكيت", ta: "விக்கெட் கீப்பர்" }, x: 50, y: 72, role: { en: "Keeper", hi: "कीपर", es: "Keeper", ar: "حارس", ta: "கீப்பர்" } },
      { name: { en: "First Slip", hi: "फर्स्ट स्लिप", es: "Primer Slip", ar: "سليب أول", ta: "முதல் ஸ்லிப்" }, x: 58, y: 74, role: { en: "Catcher", hi: "कैचर", es: "Catcher", ar: "صياد", ta: "பிடிப்பவர்" } },
      { name: { en: "Backward Point", hi: "बैकवर्ड पॉइंट", es: "Backward Point", ar: "باكورد بوينت", ta: "பேக்வர்ட் பாயிண்ட்" }, x: 74, y: 56, role: { en: "Infielder", hi: "इनफील्डर", es: "Infielder", ar: "مدافع داخلي", ta: "உள் பீல்டர்" } },
      { name: { en: "Cover", hi: "कवर", es: "Cover", ar: "كوفر", ta: "கவர்" }, x: 70, y: 40, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Mid-Off", hi: "मिड-ऑफ", es: "Mid-Off", ar: "ميد أوف", ta: "மிட்-ஆஃப்" }, x: 58, y: 28, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-On", hi: "मिड-ऑन", es: "Mid-On", ar: "ميد أون", ta: "மிட்-ஆன்" }, x: 42, y: 28, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-Wicket", hi: "मिड-विकेट", es: "Mid-Wicket", ar: "ميد ويكيت", ta: "மிட்-விக்கெட்" }, x: 30, y: 42, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Square Leg", hi: "स्क्वायर लेग", es: "Square Leg", ar: "سكوير ليغ", ta: "ஸ்கொயர் லெக்" }, x: 26, y: 55, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Deep Backward Square", hi: "डीप बैकवर्ड स्क्वायर", es: "Deep Backward Square", ar: "ديب باكورد سكوير", ta: "டீப் பேக்வர்ட் ஸ்கொயர்" }, x: 18, y: 68, highlight: true, role: { en: "Boundary Trap", hi: "बाउंड्री ट्रैप", es: "Trampa Límite", ar: "فخ الحدود", ta: "எல்லை பொறி" } },
      { name: { en: "Long-On", hi: "लॉन्ग-ऑन", es: "Long-On", ar: "لونغ أون", ta: "லாங்-ஆன்" }, x: 38, y: 14, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Bowler", hi: "गेंदबाज", es: "Lanzador", ar: "الرامي", ta: "பந்துவீச்சாளர்" }, x: 50, y: 35, role: { en: "Bowler", hi: "बॉलर", es: "Bowler", ar: "رامي", ta: "பவுலர்" } }
    ]
  },
  {
    id: "q-2",
    category: "Powerplay",
    bowler: "Renuka Singh (Pace)",
    batter: "Alyssa Healy (RHB)",
    fieldFocus: {
      en: "Third Slip, Gully, Short Cover",
      hi: "थर्ड स्लिप, गली, शॉर्ट कवर",
      es: "Tercer Slip, Gully, Short Cover",
      ar: "سليب ثالث، غالي، شورت كوفر",
      ta: "மூன்றாம் ஸ்லிப், கல்லி, ஷார்ட் கவர்"
    },
    question: {
      en: "What is Renuka's tactical blueprint against Australia's top order?",
      hi: "ऑस्ट्रेलिया के शीर्ष क्रम के खिलाफ रेणुका सिंह का सामरिक ब्लूप्रिंट क्या है?",
      es: "¿Cuál es el plan táctico de Renuka contra el orden superior de Australia?",
      ar: "ما هي الخطة التكتيكية لرينوكا ضد الترتيب الأول للمنتخب الأسترالي؟",
      ta: "ஆஸ்திரேலியாவின் டாப் ஆர்டருக்கு எதிராக ரேணுகா சிங்கின் தந்திரோபாய திட்டம் என்ன?"
    },
    answer: {
      en: "Renuka delivers 78% of powerplay balls on a fuller 5.5-meter length with 1.8° average seam wobble. Against right-handers, she attacks off-stump to induce defensive pushes to gully, while setting an umbrella ring with 3 catchers behind square.",
      hi: "रेणुका पावरप्ले की 78% गेंदें 5.5 मीटर की फुल लेंथ पर फेंकती हैं, जिसमें 1.8° का प्राकृतिक सीम मूवमेंट होता है। दाएं हाथ की बल्लेबाजों के खिलाफ वह ऑफ-स्टंप कॉरिडोर को निशाना बनाकर गली में कैच का जाल बुनती हैं और 3 कैचर्स का छाता जैसा घेरा बनाती हैं।",
      es: "Renuka lanza el 78% de sus balones en powerplay a una longitud llena de 5.5 metros con 1.8° de oscilación de costura. Contra diestras, ataca el off-stump para inducir toques defensivos hacia gully con un cordón de 3 receptores.",
      ar: "تلقي رينوكا 78٪ من كرات الباوربلاي بطول 5.5 أمتار مع حركة انحراف درزية بمقدار 1.8 درجة. وضد الضاربات اللواتي يستخدمن اليد اليمنى، تهاجم خارج عمود الويكيت لخلق فرص الإمساك في منطقة gully مع 3 صيادين خلف الخط.",
      ta: "ரேணுகா பவர்பிளே பந்துகளில் 78% பந்துகளை 5.5 மீட்டர் முழு நீளத்தில் 1.8° சீம் மூவ்மெண்டுடன் வீசுகிறார். வலது கை பேட்டர்களுக்கு எதிராக ஆஃப்-ஸ்டம்ப் பாதையில் வீசி, கல்லியில் கேட்ச் பிடிக்க 3 பீல்டர்களை நிறுத்தி நெருக்கடி தருகிறார்."
    },
    winProbability: {
      before: 42,
      after: 51,
      team: { en: "India", hi: "भारत", es: "India", ar: "الهند", ta: "இந்தியா" }
    },
    recommendedFieldingPositions: [
      { name: { en: "Wicketkeeper", hi: "विकेटकीपर", es: "Guardián", ar: "حارس الويكيت", ta: "விக்கெட் கீப்பர்" }, x: 50, y: 76, role: { en: "Keeper", hi: "कीपर", es: "Keeper", ar: "حارس", ta: "கீப்பர்" } },
      { name: { en: "Slip 1", hi: "स्लिप 1", es: "Slip 1", ar: "سليب 1", ta: "ஸ்லிப் 1" }, x: 56, y: 78, role: { en: "Catcher", hi: "कैचर", es: "Catcher", ar: "صياد", ta: "பிடிப்பவர்" } },
      { name: { en: "Slip 2", hi: "स्लिप 2", es: "Slip 2", ar: "سليب 2", ta: "ஸ்லிப் 2" }, x: 62, y: 76, highlight: true, role: { en: "Catcher", hi: "कैचर", es: "Catcher", ar: "صياد", ta: "பிடிப்பவர்" } },
      { name: { en: "Gully", hi: "गली", es: "Gully", ar: "غالي", ta: "கல்லி" }, x: 72, y: 70, highlight: true, role: { en: "Catcher", hi: "कैचर", es: "Catcher", ar: "صياد", ta: "பிடிப்பவர்" } },
      { name: { en: "Point", hi: "पॉइंट", es: "Point", ar: "بوينت", ta: "பாயிண்ட்" }, x: 78, y: 52, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Cover", hi: "कवर", es: "Cover", ar: "كوفر", ta: "கவர்" }, x: 68, y: 36, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Mid-Off", hi: "मिड-ऑफ", es: "Mid-Off", ar: "ميد أوف", ta: "மிட்-ஆஃப்" }, x: 56, y: 25, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-On", hi: "मिड-ऑन", es: "Mid-On", ar: "ميد أون", ta: "மிட்-ஆன்" }, x: 44, y: 25, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-Wicket", hi: "मिड-विकेट", es: "Mid-Wicket", ar: "ميد ويكيت", ta: "மிட்-விக்கெட்" }, x: 32, y: 44, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Fine Leg", hi: "फाइन लेग", es: "Fine Leg", ar: "فاين ليغ", ta: "பைன் லெக்" }, x: 30, y: 80, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Bowler", hi: "गेंदबाज", es: "Lanzador", ar: "الرامي", ta: "பந்துவீச்சாளர்" }, x: 50, y: 32, role: { en: "Bowler", hi: "बॉलर", es: "Bowler", ar: "رامي", ta: "பவுலர்" } }
    ]
  },
  {
    id: "q-3",
    category: "Captaincy",
    bowler: "Tahlia McGrath (Pace)",
    batter: "Sophie Devine (RHB)",
    fieldFocus: {
      en: "Bait Mid-Off In / Deep Cover Sweeper",
      hi: "मिड-ऑफ को अंदर बुलाना / डीप कवर स्वीपर",
      es: "Cebo Mid-Off Adentro / Deep Cover Sweeper",
      ar: "طُعم ميد أوف في الداخل / ديب كوفر",
      ta: "மிட்-ஆஃப் உள்ளே / டீப் கவர் ஸ்வீப்பர்"
    },
    question: {
      en: "Why drop the mid-off inside the circle against Sophie Devine on ball 18.2?",
      hi: "18.2 गेंद पर सोफी डिवाइन के खिलाफ मिड-ऑफ को सर्कल के अंदर क्यों बुलाया गया?",
      es: "¿Por qué adelantar el mid-off dentro del círculo contra Sophie Devine en la bola 18.2?",
      ar: "لماذا تم تقريب لاعب mid-off داخل الدائرة ضد صوفي ديفاين في الكرة 18.2؟",
      ta: "18.2 பந்தில் Sophie Devine-க்கு எதிராக மிட் ஆஃப் ஏன் வட்டத்திற்குள் வைக்கப்பட்டது?"
    },
    answer: {
      en: "Australia's captain intentionally vacated long-off to bait Devine into hitting against the 18 km/h cross-breeze. By placing a deep cover sweeper and deep mid-wicket, the bowling side protected the wind-assisted boundary quadrants while dangling the aerial bait.",
      hi: "ऑस्ट्रेलियाई कप्तान ने जानबूझकर लॉन्ग-ऑफ को खाली रखा ताकि डिवाइन 18 किमी/घंटा की हवा के विपरीत ऊंचा शॉट खेलें। डीप कवर स्वीपर और डीप मिड-विकेट रखकर गेंदबाजी टीम ने हवा की दिशा में बाउंड्री सुरक्षित की और हवा में कैच का लालच दिया।",
      es: "La capitana australiana desocupó intencionalmente long-off para tentar a Devine a golpear contra la brisa cruzada de 18 km/h. Colocando deep cover sweeper y deep mid-wicket, el equipo protegió los cuadrantes ayudados por el viento tendiendo una trampa aérea.",
      ar: "أفرغ قائد أستراليا منطقة long-off عمداً لإغراء ديفاين بالتسديد ضد الرياح الجانبية بسرعة 18 كم/ساعة. مع وجود لاعبي deep cover و deep mid-wicket، حمى الفريق حدود الملعب مستغلاً الرياح كفخ جوي.",
      ta: "ஆஸ்திரேலிய கேப்டன் 18 கிமீ/மணி வேகத்தில் வீசும் காற்றுக்கு எதிராக டிவைனை அடிக்க வைக்க லாங்-ஆஃப் இடத்தை காலியாக வைத்தார். டீப் கவர் ஸ்வீப்பர் மற்றும் டீப் மிட்-விக்கெட்டை நிறுத்தி எல்லைகளை பாதுகாத்து கேட்ச் பொறியை அமைத்தனர்."
    },
    winProbability: {
      before: 55,
      after: 64,
      team: { en: "Australia", hi: "ऑस्ट्रेलिया", es: "Australia", ar: "أستراليا", ta: "ஆஸ்திரேலியா" }
    },
    recommendedFieldingPositions: [
      { name: { en: "Wicketkeeper", hi: "विकेटकीपर", es: "Guardián", ar: "حارس الويكيت", ta: "விக்கெட் கீப்பர்" }, x: 50, y: 74, role: { en: "Keeper", hi: "कीपर", es: "Keeper", ar: "حارس", ta: "கீப்பர்" } },
      { name: { en: "Short Third", hi: "शॉर्ट थर्ड", es: "Short Third", ar: "شورت ثيرد", ta: "ஷார்ட் தர்ட்" }, x: 65, y: 65, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Point", hi: "पॉइंट", es: "Point", ar: "بوينت", ta: "பாயிண்ட்" }, x: 75, y: 50, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Deep Cover Sweeper", hi: "डीप कवर स्वीपर", es: "Deep Cover", ar: "ديب كوفر", ta: "டீப் கவர்" }, x: 84, y: 35, highlight: true, role: { en: "Boundary Shield", hi: "बाउंड्री शील्ड", es: "Escudo Límite", ar: "درع الحدود", ta: "எல்லை கவசம்" } },
      { name: { en: "Short Mid-Off", hi: "शॉर्ट मिड-ऑफ", es: "Short Mid-Off", ar: "شورت ميد أوف", ta: "ஷார்ட் மிட்-ஆஃப்" }, x: 58, y: 32, highlight: true, role: { en: "Infield Bait", hi: "इनफील्ड चारा", es: "Cebo Infield", ar: "طُعم داخلي", ta: "பொறி" } },
      { name: { en: "Long-On", hi: "लॉन्ग-ऑन", es: "Long-On", ar: "لونغ أون", ta: "லாங்-ஆன்" }, x: 38, y: 15, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Deep Mid-Wicket", hi: "डीप मिड-विकेट", es: "Deep Mid-Wicket", ar: "ديب ميد ويكيت", ta: "டீப் மிட்-விக்கெட்" }, x: 22, y: 38, highlight: true, role: { en: "Boundary Shield", hi: "बाउंड्री शील्ड", es: "Escudo Límite", ar: "درع الحدود", ta: "எல்லை கவசம்" } },
      { name: { en: "Mid-Wicket", hi: "मिड-विकेट", es: "Mid-Wicket", ar: "ميد ويكيت", ta: "மிட்-விக்கெட்" }, x: 32, y: 48, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Deep Square Leg", hi: "डीप स्क्वायर लेग", es: "Deep Square Leg", ar: "ديب سكوير ليغ", ta: "டீப் ஸ்கொயர் லெக்" }, x: 20, y: 64, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Fine Leg", hi: "फाइन लेग", es: "Fine Leg", ar: "فاين ليغ", ta: "பைன் லெக்" }, x: 35, y: 80, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Bowler", hi: "गेंदबाज", es: "Lanzador", ar: "الرامي", ta: "பந்துவீச்சாளர்" }, x: 50, y: 35, role: { en: "Bowler", hi: "बॉलर", es: "Bowler", ar: "رامي", ta: "பவுலர்" } }
    ]
  },
  {
    id: "q-4",
    category: "Spin",
    bowler: "Deepti Sharma (Off-Break)",
    batter: "Smriti Mandhana (LHB)",
    fieldFocus: {
      en: "Leg Slip, Silly Point & Backward Square",
      hi: "लेग स्लिप, सिली पॉइंट और बैकवर्ड स्क्वायर",
      es: "Leg Slip, Silly Point y Backward Square",
      ar: "ليغ سليب، سيلي بوينت، باكورد سكوير",
      ta: "லெக் ஸ்லிப், சில்லி பாயிண்ட் & பேக்வர்ட் ஸ்கொயர்"
    },
    question: {
      en: "How does Deepti Sharma's carrom ball trick the left-handed batter?",
      hi: "दीप्ति शर्मा की कैरम बॉल बाएं हाथ की बल्लेबाज को कैसे चकमा देती है?",
      es: "¿Cómo engaña la carrom ball de Deepti Sharma a la bateadora zurda?",
      ar: "كيف تخدع كرة carrom ball من ديبتي شارما اللاعبة العسراء؟",
      ta: "தீப்தி சர்மாவின் கேரம் பால் இடது கை பேட்டரை எப்படி ஏமாற்றுகிறது?"
    },
    answer: {
      en: "Deepti changes her seam release from standard 11 o'clock scramble to a 1 o'clock thumb-flick. The aerodynamic Magnus effect causes 4.8° of late away-drift before pitching, then cuts sharply into the left-hander's off-stump corridor.",
      hi: "दीप्ति अपनी सीम रिलीज को सामान्य 11 बजे की स्थिति से बदलकर अंगूठे के 1 बजे के झटके में बदल देती हैं। वायुगतिकीय मैग्नस प्रभाव के कारण गेंद पिच होने से पहले 4.8° बाहर की ओर ड्रिफ्ट करती है, और फिर तेजी से ऑफ-स्टंप की ओर अंदर आती है।",
      es: "Deepti cambia la liberación de su costura de las 11 en punto a un chasquido con el pulgar a la 1 en punto. El efecto aerodinámico Magnus genera 4.8° de deriva tardía antes de picar, cortando bruscamente hacia el off-stump de la zurda.",
      ar: "تغير ديبتي طريقة إفلات الكرة من موضع الساعة 11 إلى حركة نقر بالإبهام عند موضع الساعة 1. ويحدث تأثير ماغنوس الهوائي انحرافاً متأخراً بمقدار 4.8 درجات قبل الارتطام بالأرض، ثم تنكسر بحدة نحو الويكيت.",
      ta: "தீப்தி பந்தை வீசும்போது நிலையான 11 மணி சுழற்சியிலிருந்து 1 மணி விரல் சொடுக்காக மாற்றுகிறார். காற்றியக்க மேக்னஸ் விளைவு பந்து தரையில் படுவதற்கு முன் 4.8° விலகிச்சென்று, பின்னர் இடது கை பேட்டரின் ஆஃப்-ஸ்டம்பை நோக்கி கூர்மையாக திரும்புகிறது."
    },
    winProbability: {
      before: 50,
      after: 61,
      team: { en: "India", hi: "भारत", es: "India", ar: "الهند", ta: "இந்தியா" }
    },
    recommendedFieldingPositions: [
      { name: { en: "Wicketkeeper", hi: "विकेटकीपर", es: "Guardián", ar: "حارس الويكيت", ta: "விக்கெட் கீப்பர்" }, x: 50, y: 72, role: { en: "Keeper", hi: "कीपर", es: "Keeper", ar: "حارس", ta: "கீப்பர்" } },
      { name: { en: "Leg Slip", hi: "लेग स्लिप", es: "Leg Slip", ar: "ليغ سليب", ta: "லெக் ஸ்லிப்" }, x: 42, y: 74, highlight: true, role: { en: "Trap Catcher", hi: "जाल कैचर", es: "Receptor Trampa", ar: "صياد فخ", ta: "பொறி பிடிப்பவர்" } },
      { name: { en: "Silly Point", hi: "सिली पॉइंट", es: "Silly Point", ar: "سيلي بوينت", ta: "சில்லி பாயிண்ட்" }, x: 62, y: 58, highlight: true, role: { en: "Close Infield", hi: "क्लोज इनफील्ड", es: "Infield Cercano", ar: "قريب من الضارب", ta: "அருகாமை பீல்டர்" } },
      { name: { en: "Backward Point", hi: "बैकवर्ड पॉइंट", es: "Backward Point", ar: "باكورد بوينت", ta: "பேக்வர்ட் பாயிண்ட்" }, x: 75, y: 55, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Cover", hi: "कवर", es: "Cover", ar: "كوفر", ta: "கவர்" }, x: 70, y: 38, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Mid-Off", hi: "मिड-ऑफ", es: "Mid-Off", ar: "ميد أوف", ta: "மிட்-ஆஃப்" }, x: 58, y: 26, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Long-On", hi: "लॉन्ग-ऑन", es: "Long-On", ar: "لونغ أون", ta: "லாங்-ஆன்" }, x: 40, y: 15, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Deep Square Leg", hi: "डीप स्क्वायर लेग", es: "Deep Square Leg", ar: "ديب سكوير ليغ", ta: "டீப் ஸ்கொயர் லெக்" }, x: 20, y: 60, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Short Fine Leg", hi: "शॉर्ट फाइन लेग", es: "Short Fine Leg", ar: "شورت فاين ليغ", ta: "ஷார்ட் பைன் லெக்" }, x: 34, y: 76, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Deep Mid-Wicket", hi: "डीप मिड-विकेट", es: "Deep Mid-Wicket", ar: "ديب ميد ويكيت", ta: "டீப் மிட்-விக்கெட்" }, x: 25, y: 40, role: { en: "Boundary", hi: "बाउंड्री", es: "Límite", ar: "حدود", ta: "எல்லை" } },
      { name: { en: "Bowler", hi: "गेंदबाज", es: "Lanzador", ar: "الرامي", ta: "பந்துவீச்சாளர்" }, x: 50, y: 35, role: { en: "Bowler", hi: "बॉलर", es: "Bowler", ar: "رامي", ta: "பவுலர்" } }
    ]
  },
  {
    id: "q-5",
    category: "Powerplay",
    bowler: "Megan Schutt (In-Swing)",
    batter: "Shafali Verma (RHB)",
    fieldFocus: {
      en: "Deep Extra Cover & Deep Point Boundary Rope",
      hi: "डीप एक्स्ट्रा कवर और डीप पॉइंट बाउंड्री रोप",
      es: "Deep Extra Cover y Deep Point en la Cuerda",
      ar: "ديب إكسترا كوفر وديب بوينت على حبل الحدود",
      ta: "டீப் எக்ஸ்ட்ரா கவர் & டீப் பாயிண்ட் பவுண்டரி"
    },
    question: {
      en: "What is the optimal field setup against Shafali Verma in powerplay overs?",
      hi: "पावरप्ले ओवरों में शेफाली वर्मा के खिलाफ सबसे प्रभावी फील्डिंग सेटअप क्या है?",
      es: "¿Cuál es la configuración de campo óptima contra Shafali Verma en el powerplay?",
      ar: "ما هو التوزيع الميداني الأمثل ضد شيفالي فيرما في أشواط powerplay؟",
      ta: "பவர்பிளே ஓவர்களில் ஷஃபாலி வர்மாவுக்கு எதிரான உகந்த பீல்டிங் அமைப்பு என்ன?"
    },
    answer: {
      en: "Data proves Shafali clears the inner ring over extra cover on 42% of powerplay balls. The optimal counter-strategy brings third man and fine leg up into the circle to post both deep point and deep extra cover on the boundary rope.",
      hi: "आंकड़े साबित करते हैं कि शेफाली पावरप्ले की 42% गेंदों पर इनर रिंग को एक्स्ट्रा कवर के ऊपर से पार करती हैं। सबसे प्रभावी रणनीति थर्ड मैन और फाइन लेग को सर्कल में लाकर डीप पॉइंट और डीप एक्स्ट्रा कवर दोनों को बाउंड्री रोप पर तैनात करना है।",
      es: "Los datos prueban que Shafali supera el círculo interior por extra cover en el 42% de los balones en powerplay. La contrarrestategia óptima adelanta al tercer hombre y fine leg al círculo para colocar deep point y deep extra cover en la cuerda.",
      ar: "تثبت البيانات أن شيفالي تتجاوز الدائرة الداخلية من فوق extra cover في 42٪ من كرات الباوربلاي. والاستراتيجية المثلى تقتضي جلب third man و fine leg إلى الدائرة لنشر كل من deep point و deep extra cover على حبل الحدود.",
      ta: "பவர்பிளே பந்துகளில் 42% பந்துகளை ஷஃபாலி எக்ஸ்ட்ரா கவர் மேலே அடித்து தூக்குகிறார் என்பதை புள்ளிவிவரங்கள் காட்டுகின்றன. தேர்ட் மேன் மற்றும் ஃபைன் லெக்கை வட்டத்திற்குள் கொண்டுவந்து, டீப் பாயிண்ட் மற்றும் டீப் எக்ஸ்ட்ரா கவரை பவுண்டரி எல்லையில் நிறுத்துவதே சிறந்த வியூகம்."
    },
    winProbability: {
      before: 46,
      after: 54,
      team: { en: "Australia", hi: "ऑस्ट्रेलिया", es: "Australia", ar: "أستراليا", ta: "ஆஸ்திரேலியா" }
    },
    recommendedFieldingPositions: [
      { name: { en: "Wicketkeeper", hi: "विकेटकीपर", es: "Guardián", ar: "حارس الويكيت", ta: "விக்கெட் கீப்பர்" }, x: 50, y: 75, role: { en: "Keeper", hi: "कीपर", es: "Keeper", ar: "حارس", ta: "கீப்பர்" } },
      { name: { en: "First Slip", hi: "फर्स्ट स्लिप", es: "Primer Slip", ar: "سليب أول", ta: "முதல் ஸ்லிப்" }, x: 57, y: 76, role: { en: "Catcher", hi: "कैचर", es: "Catcher", ar: "صياد", ta: "பிடிப்பவர்" } },
      { name: { en: "Short Third Man", hi: "शॉर्ट थर्ड मैन", es: "Short Third", ar: "شورت ثيرد مان", ta: "ஷார்ட் தேர்ட் மேன்" }, x: 66, y: 70, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Deep Point", hi: "डीप पॉइंट", es: "Deep Point", ar: "ديب بوينت", ta: "டீப் பாயிண்ட்" }, x: 82, y: 55, highlight: true, role: { en: "Boundary Rope", hi: "बाउंड्री रोप", es: "Cuerda Límite", ar: "حبل الحدود", ta: "எல்லை கயிறு" } },
      { name: { en: "Deep Extra Cover", hi: "डीप एक्स्ट्रा कवर", es: "Deep Extra Cover", ar: "ديب إكسترا كوفر", ta: "டீப் எக்ஸ்ட்ரா கவர்" }, x: 78, y: 35, highlight: true, role: { en: "Boundary Rope", hi: "बाउंड्री रोप", es: "Cuerda Límite", ar: "حبل الحدود", ta: "எல்லை கயிறு" } },
      { name: { en: "Mid-Off", hi: "मिड-ऑफ", es: "Mid-Off", ar: "ميد أوف", ta: "மிட்-ஆஃப்" }, x: 58, y: 28, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-On", hi: "मिड-ऑन", es: "Mid-On", ar: "ميد أون", ta: "மிட்-ஆன்" }, x: 42, y: 28, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Mid-Wicket", hi: "मिड-विकेट", es: "Mid-Wicket", ar: "ميد ويكيت", ta: "மிட்-விக்கெட்" }, x: 30, y: 42, role: { en: "Ring", hi: "रिंग", es: "Ring", ar: "دائرة", ta: "ரிங்" } },
      { name: { en: "Short Square Leg", hi: "शॉर्ट स्क्वायर लेग", es: "Short Square Leg", ar: "شورت سكوير ليغ", ta: "ஷார்ட் ஸ்கொயர் லெக்" }, x: 32, y: 60, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Short Fine Leg", hi: "शॉर्ट फाइन लेग", es: "Short Fine Leg", ar: "شورت فاين ليغ", ta: "ஷார்ட் பைன் லெக்" }, x: 38, y: 75, role: { en: "Inner", hi: "इनर", es: "Inner", ar: "داخلي", ta: "உள்ளே" } },
      { name: { en: "Bowler", hi: "गेंदबाज", es: "Lanzador", ar: "الرامي", ta: "பந்துவீச்சாளர்" }, x: 50, y: 34, role: { en: "Bowler", hi: "बॉलर", es: "Bowler", ar: "رامي", ta: "பவுலர்" } }
    ]
  }
];

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  headerTag: {
    en: "Interactive Match Companion",
    hi: "इंटरएक्टिव मैच साथी",
    es: "Compañero Interactivo de Partido",
    ar: "رفيق المباراة التفاعلي",
    ta: "ஊடாடும் போட்டி துணை"
  },
  headerTitle: {
    en: "Tactical Co-Pilot & 2D Field Radar",
    hi: "सामरिक को-पायलट एवं 2D फील्ड रडार",
    es: "Co-Piloto Táctico y Radar de Campo 2D",
    ar: "مساعد التكتيكات ورادار الميدان 2D",
    ta: "தந்திரோபாய கோ-பைலட் & 2D கள ரேடார்"
  },
  headerSubtitle: {
    en: "Real-time conversational AI grounded in live ICC ball telemetry, field coordinates, and situational win probability models.",
    hi: "लाइव आईसीसी बॉल टेलीमेट्री, फील्ड निर्देशांक और स्थितिगत जीत संभावना मॉडल पर आधारित संवादात्मक एआई।",
    es: "IA conversacional en tiempo real basada en telemetría de bola ICC, coordenadas de campo y modelos de probabilidad.",
    ar: "ذكاء اصطناعي محادثة في الوقت الفعلي مدعوم بقياسات كريكيت ICC وإحداثيات الميدان ونماذج الفوز.",
    ta: "நேரலை ICC பந்து அளவீடுகள், கள ஆயத்தொலைவுகள் மற்றும் சூழ்நிலை வெற்றி வாய்ப்பு மாதிரிகள் அடிப்படையிலான AI."
  },
  telemetryActive: {
    en: "Telemetry Sync: Active",
    hi: "टेलीमेट्री सिंक: सक्रिय",
    es: "Sincronización Telemetría: Activa",
    ar: "مزامنة القياس عن بعد: نشطة",
    ta: "டெலிமெட்ரி ஒத்திசைவு: செயலில்"
  },
  fieldVisualizer: {
    en: "Dynamic Field Placement Visualizer",
    hi: "डायनामिक फील्ड प्लेसमेंट विज़ुअलाइज़र",
    es: "Visualizador Dinámico de Campo",
    ar: "مرسم توزيع الميدان التفاعلي",
    ta: "டைனமிக் கள அமைப்பு காட்சிப்படுத்தி"
  },
  bowlerVsBatter: {
    en: "Bowler vs Batter",
    hi: "गेंदबाज बनाम बल्लेबाज",
    es: "Lanzador vs Bateadora",
    ar: "الرامي ضد الضارب",
    ta: "பந்துவீச்சாளர் vs பேட்டர்"
  },
  offSide: {
    en: "OFF SIDE",
    hi: "ऑफ साइड",
    es: "OFF SIDE",
    ar: "الجانب الأيمن (OFF)",
    ta: "ஆஃப் சைட்"
  },
  legSide: {
    en: "LEG SIDE",
    hi: "लेग साइड",
    es: "LEG SIDE",
    ar: "الجانب الأيسر (LEG)",
    ta: "லெக் சைட்"
  },
  predictedOutcome: {
    en: "Predicted Outcome Delta",
    hi: "अनुमानित परिणाम डेल्टा",
    es: "Delta de Resultado Predicho",
    ar: "دلتا النتيجة المتوقعة",
    ta: "கணிக்கப்பட்ட முடிவு மாற்றம்"
  },
  winProb: {
    en: "Win Probability",
    hi: "जीतने की संभावना",
    es: "Probabilidad de Victoria",
    ar: "احتمالية الفوز",
    ta: "வெற்றி வாய்ப்பு"
  },
  optimal: {
    en: "Optimal",
    hi: "सर्वोत्तम",
    es: "Óptimo",
    ar: "مثالي",
    ta: "உகந்தது"
  },
  suggestedQuestions: {
    en: "AI Suggested Tactical Questions",
    hi: "एआई सुझावित सामरिक प्रश्न",
    es: "Preguntas Tácticas Sugeridas por IA",
    ar: "أسئلة تكتيكية مقترحة بالذكاء الاصطناعي",
    ta: "AI பரிந்துரைத்த தந்திரோபாய கேள்விகள்"
  },
  clickToAnalyze: {
    en: "Click to Analyze",
    hi: "विश्लेषण के लिए क्लिक करें",
    es: "Clic para Analizar",
    ar: "انقر للتحليل",
    ta: "பகுப்பாய்வு செய்ய கிளிக் செய்க"
  },
  catAll: {
    en: "All",
    hi: "सभी",
    es: "Todos",
    ar: "الكل",
    ta: "அனைத்தும்"
  },
  catCaptaincy: {
    en: "Captaincy",
    hi: "कप्तानी",
    es: "Capitanía",
    ar: "القيادة",
    ta: "கேப்டன்ஷிப்"
  },
  catSpin: {
    en: "Spin",
    hi: "स्पिन",
    es: "Giro (Spin)",
    ar: "الدوران (Spin)",
    ta: "ஸ்பின்"
  },
  catPowerplay: {
    en: "Powerplay",
    hi: "पावरप्ले",
    es: "Powerplay",
    ar: "باوربلاي",
    ta: "பவர்பிளே"
  },
  v2vMode: {
    en: "Voice-to-Voice",
    hi: "वॉयस-टू-वॉयस",
    es: "Voz a Voz",
    ar: "صوت إلى صوت",
    ta: "குரல்-க்கு-குரல்"
  },
  v2vActive: {
    en: "V2V Active",
    hi: "V2V चालू",
    es: "V2V Activo",
    ar: "V2V نشط",
    ta: "V2V இயங்குகிறது"
  },
  t2vReadAloud: {
    en: "Text-to-Voice",
    hi: "टेक्स्ट-टू-वॉयस",
    es: "Texto a Voz",
    ar: "نص إلى صوت",
    ta: "உரை-க்கு-குரல்"
  },
  listeningNow: {
    en: "Listening in English... Speak your question",
    hi: "हिंदी में सुन रहा हूँ... अपना सामरिक प्रश्न बोलें",
    es: "Escuchando en español... Haz tu pregunta",
    ar: "جاري الاستماع بالعربية... تحدث بسؤالك الآن",
    ta: "தமிழில் கேட்கிறது... உங்கள் கேள்வியைப் பேசுங்கள்"
  },
  inputPlaceholder: {
    en: "Ask tactical AI or speak via microphone...",
    hi: "सामरिक AI से पूछें या माइक द्वारा बोलें...",
    es: "Pregunta a la IA táctica o habla por el micrófono...",
    ar: "اسأل الذكاء الاصطناعي التكتيكي أو تحدث عبر الميكروفون...",
    ta: "தந்திரோபாய AI-யிடம் கேட்கவும் அல்லது மைக் மூலம் பேசவும்..."
  },
  aiGreeting: {
    en: "Hello! I am your AURA Tactical Co-Pilot with Voice-to-Voice and Text-to-Voice capabilities. Ask me any tactical question regarding field setups, bowling matchups, or win probability shifts.",
    hi: "नमस्ते! मैं आपका ऑरा टैक्टिकल को-पायलट हूँ (वॉयस-टू-वॉयस और टेक्स्ट-टू-वॉयस समर्थित)। फील्ड प्लेसमेंट, बॉलिंग मैचअप या जीत की संभावना पर कोई भी सवाल पूछें या बोलकर बताएं।",
    es: "¡Hola! Soy tu copiloto táctico AURA con funciones avanzadas de Voz a Voz y Texto a Voz. Hazme cualquier pregunta táctica sobre colocaciones de campo, emparejamientos o probabilidades de victoria.",
    ar: "مرحباً! أنا مساعد AURA التكتيكي مع دعم الصوت إلى الصوت والنص إلى صوت باللغة العربية. اسألني أي سؤال تكتيكي حول توزيع اللاعبين أو نسب الفوز في المباراة.",
    ta: "வணக்கம்! நான் உங்கள் AURA தந்திரோபாய கோ-பைலட் (குரல்-க்கு-குரல் மற்றும் உரை-க்கு-குரல் ஆதரவுடன்). கள அமைப்பு, பந்துவீச்சு உத்திகள் அல்லது வெற்றி வாய்ப்பு பற்றி கேளுங்கள்."
  },
  aiSpeaking: {
    en: "AI Speaking...",
    hi: "AI बोल रहा है...",
    es: "IA Hablando...",
    ar: "الذكاء الاصطناعي يتحدث...",
    ta: "AI பேசுகிறது..."
  },
  stopSpeaking: {
    en: "Stop Audio",
    hi: "ऑडियो रोकें",
    es: "Detener Audio",
    ar: "إيقاف الصوت",
    ta: "ஆடியோவை நிறுத்து"
  }
};

// Generate intelligent contextual tactical responses in any of the 5 languages
export function generateTacticalAIResponse(question: string, lang: string): string {
  const q = question.toLowerCase();

  if (lang === 'hi') {
    if (q.includes('field') || q.includes('फील्ड') || q.includes('slip') || q.includes('स्लिप')) {
      return `सामरिक विश्लेषण (हिंदी): "${question}" के संदर्भ में, पिच के 6.2 मीटर बाउंस कॉरिडोर को देखते हुए थर्ड स्लिप को 12° चौड़ा करने से किनारा लगने पर कैच की संभावना 24.3% बढ़ जाती है। भारत की अनुमानित जीत संभावना +5.2% सुधरती है।`;
    }
    if (q.includes('spin') || q.includes('स्पिन') || q.includes('deepti') || q.includes('दीप्ति')) {
      return `स्पिन रणनीति विश्लेषण: दुबई स्टेडियम की धीमी गति वाली सतह पर गेंद 3.8° अधिक टर्न ले रही है। सिली पॉइंट और डीप मिड-विकेट की दोहरी रणनीति से रन रेट 1.8 रन प्रति ओवर तक कम किया जा सकता है।`;
    }
    return `सामरिक टेलीमेट्री विश्लेषण ("${question}"): 68 मीटर बाउंड्री और वर्तमान ओवर-रेट के आधार पर, फील्डरों को डीप मिड-विकेट और लॉन्ग-ऑफ पर तैनात करने से 6 रन की संभावना 18.2% घट जाती है। जीत संभावना +4.6% सुधरती है।`;
  }

  if (lang === 'ta') {
    if (q.includes('field') || q.includes('களம்') || q.includes('slip') || q.includes('ஸ்லிப்')) {
      return `தந்திரோபாய பகுப்பாய்வு (தமிழ்): "${question}" அடிப்படையில், 6.2 மீட்டர் பவுன்ஸ் பாதையைக் கணக்கிட்டு தேர்ட் ஸ்லிப்பை 12° அகலப்படுத்துவது எட்ஜ் பிடிக்கும் வாய்ப்பை 24.3% அதிகரிக்கிறது. வெற்றி வாய்ப்பு +5.2% கூடுகிறது.`;
    }
    if (q.includes('spin') || q.includes('ஸ்பின்') || q.includes('சுழற்')) {
      return `சுழற்பந்து உத்தி பகுப்பாய்வு: ஆடுகளத்தில் பந்து 3.8° அதிகமாக திரும்புகிறது. சில்லி பாயிண்ட் மற்றும் டீப் மிட்-விக்கெட் ஒருங்கிணைப்பு ரன் வேகத்தை ஓவருக்கு 1.8 ரன்கள் குறைக்கிறது.`;
    }
    return `தந்திரோபாய அளவீட்டு பகுப்பாய்வு ("${question}"): துபாய் மைதானத்தின் 68 மீ எல்லை தூரத்தைக் கொண்டு, டீப் மிட்-விக்கெட்டில் பீல்டரை நிறுத்துவது பவுண்டரி வாய்ப்பை 18.2% குறைக்கிறது. வெற்றி வாய்ப்பு +4.6% அதிகரிக்கிறது.`;
  }

  if (lang === 'ar') {
    if (q.includes('field') || q.includes('ميدان') || q.includes('slip') || q.includes('سليب')) {
      return `التحليل التكتيكي الميداني (بالعربية): بالنسبة لسؤالك "${question}"، وبناءً على مسار ارتداد الكرة، فإن توسيع زاوية لاعب slip بمقدار 12 درجة يزيد من احتمالية الإمساك بالكرة المرتدة بنسبة 24.3٪، مما يرفع نسبة الفوز المتوقعة للهند بمقدار +5.2٪.`;
    }
    if (q.includes('spin') || q.includes('دوران') || q.includes('deepti')) {
      return `تحليل استراتيجية الدوران: على أرضية ملعب دبي، تدور الكرة بزاوية 3.8 درجات أكثر من المعتاد. وضع مدافعين في silly point و deep mid-wicket يقلل من معدل التسجيل بمقدار 1.8 نقطة في الشوط.`;
    }
    return `تحليل التيليمتري التكتيكي ("${question}"): بالنظر إلى أبعاد حدود الملعب (68 متراً)، فإن نقل المدافعين إلى deep mid-wicket يقلل من فرصة تسجيل 6 نقاط بنسبة 18.2٪، ويرفع مؤشر الفوز بنسبة +4.6٪.`;
  }

  if (lang === 'es') {
    if (q.includes('field') || q.includes('campo') || q.includes('slip')) {
      return `Análisis táctico (Español): Respecto a "${question}", considerando el corredor de rebote de 6.2m, ensanchar el tercer slip en 12° incrementa la probabilidad de captura en un 24.3%. La probabilidad de victoria mejora en +5.2%.`;
    }
    if (q.includes('spin') || q.includes('giro') || q.includes('deepti')) {
      return `Análisis de giro táctico: En la superficie de Dubái, la bola gira 3.8° adicionales. Una doble trampa con silly point y deep mid-wicket ahoga el ritmo anotador en 1.8 carreras por over.`;
    }
    return `Análisis de telemetría táctica ("${question}"): Basado en las dimensiones de 68m de límite y la velocidad del over, colocar fildeadores en deep mid-wicket reduce la probabilidad de un 6 en 18.2%. Ganancia de victoria esperada: +4.6%.`;
  }

  // English (default)
  return `Tactical telemetry analysis for "${question}": Based on Dubai Stadium's dimensions (68m boundary on western flank) and current over-rate, shifting fielders into deep mid-wicket minimizes the 6-run probability by 18.2%. Expected win equity shifts by +4.6%.`;
}
