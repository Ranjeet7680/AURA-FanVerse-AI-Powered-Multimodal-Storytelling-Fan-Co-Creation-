import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type LanguageCode = 'en' | 'hi' | 'ta' | 'es' | 'ar';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', label: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', dir: 'rtl' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav Tabs
    'nav.discover': 'Discover',
    'nav.shorts': 'Shorts',
    'nav.tactical': 'Tactical AI',
    'nav.stadium3d': '3D Stadium',
    'nav.analytics': 'Radar',
    'nav.rl': 'RL Agent',
    'nav.cybersecurity': 'Cyber Shield',
    'nav.athletes': 'Athletes',
    'nav.profile': 'Profile',
    'nav.login': 'Login / Register',
    'nav.logout': 'Sign Out',
    'nav.sparks': 'Sparks',
    'nav.live_mesh': 'ICC LIVE TOURNAMENT MESH',
    'nav.over_live': 'OVER 14.3 LIVE',

    // 3D Stadium
    'stadium.title': 'Hyper-Realistic 3D WebGL Cricket Stadium',
    'stadium.subtitle': 'Volumetric Lighting, Procedural Textures & Physics Engine',
    'stadium.desc': 'Featuring 4 floodlight volumetric beams, procedural mower turf, weathered clay pitch scuffs, animated LED sponsor hoardings, sight screens, and flying bails physics.',
    'stadium.play': 'Play',
    'stadium.pause': 'Pause',
    'stadium.reset': 'Reset',
    'stadium.cam_broadcast': 'Broadcast',
    'stadium.cam_batter': 'Batter POV',
    'stadium.cam_hawkeye': 'Hawk-Eye',
    'stadium.cam_topdown': 'Top-Down',
    'stadium.cam_stump': 'Stump Cam',
    'stadium.cam_drone': 'Drone Orbit',
    'stadium.delivery': 'Delivery:',
    'stadium.del_seam': '142 km/h Seam',
    'stadium.del_spin': '86 km/h Spin',
    'stadium.del_yorker': '148 km/h Yorker',
    'stadium.shot': 'Shot:',
    'stadium.shot_cover': 'Cover Drive (6)',
    'stadium.shot_pull': 'Pull Shot (4)',
    'stadium.shot_straight': 'Straight Drive (4)',
    'stadium.shot_upper': 'Upper Cut (6)',
    'stadium.shot_wicket': 'Wicket ⚡',
    'stadium.lighting': 'Lighting:',
    'stadium.light_day': 'Day',
    'stadium.light_sunset': 'Sunset',
    'stadium.light_night': 'Night',
    'stadium.trail': 'Hawk-Eye Trail',
    'stadium.flashes': 'Crowd Flashes',
    'stadium.in_flight': 'IN FLIGHT',
    'stadium.contact_made': 'CONTACT MADE',
    'stadium.ready': 'READY',

    // Tactical AI Co-Pilot
    'tactical.badge': 'AI Tactical Intelligence & Multi-Model Ensemble',
    'tactical.title': 'Tactical Co-Pilot & AI Model Studio',
    'tactical.subtitle': 'Trained on 2,896 match files (7,119 tactical states) and 90,308 player career profiles with 0.9988 ROC-AUC calibration.',
    'tactical.tab_copilot': 'Co-Pilot & Radar',
    'tactical.tab_matchup': 'Matchup Matrix',
    'tactical.tab_inplay': 'In-Play Win Sim',
    'tactical.tab_studio': 'AI Studio & Scenarios',
    'tactical.field_radar': 'Dynamic Field Placement Visualizer',
    'tactical.suggested_questions': 'AI Suggested Tactical Questions',
    'tactical.click_analyze': 'Click to Analyze',
    'tactical.ask_placeholder': 'Ask tactical AI (e.g. why did the captain set a deep slip?)...',
    'tactical.speak_guidance': 'Speak Guidance',
    'tactical.listen_review': 'Listen to Over Review',
    'tactical.threat_high': 'HIGH THREAT',
    'tactical.threat_vulnerable': 'VULNERABLE',
    'tactical.threat_neutral': 'NEUTRAL',
    'tactical.threat_favorable': 'FAVORABLE',

    // Data Analytics
    'analytics.badge': 'Big Data Cricket Analytics & Intelligence Platform',
    'analytics.title': 'Data Analysis, Match Statistics & ML Telemetry',
    'analytics.subtitle': 'Grounded in 2,896 match files (7,119 over snapshots), 90,308 player career records, and 16,666 demographic profiles.',
    'analytics.tab_data': 'Data Analysis',
    'analytics.tab_ml': 'ML Predictor',
    'analytics.tab_players': 'Top Players (500)',
    'analytics.tab_matches': 'Recent Matches',
    'analytics.tab_charts': 'Live Charts',
    'analytics.kpi_matches': 'Matches Mined',
    'analytics.kpi_states': 'Tactical States',
    'analytics.kpi_players': 'Player Records',
    'analytics.kpi_accuracy': 'GB Accuracy',
    'analytics.kpi_t20_par': 'T20 Avg 1st Inns',
    'analytics.kpi_odi_par': 'ODI Avg 1st Inns',
    'analytics.team_power_title': 'Highest-Rated International & Franchise Teams',
    'analytics.phase_quantiles_title': 'Phase Scoring Quantiles (Floor vs Ceiling)',
    'analytics.leaderboard_title': 'Composite Player Impact (CPI) Leaderboard',
    'analytics.predict_win': 'Win Probability',
    'analytics.projected_score': 'Projected 1st Innings',
    'analytics.search_player': 'Search by player or country...',

    // General
    'common.live': 'LIVE',
    'common.all': 'All',
    'common.runs': 'Runs',
    'common.wickets': 'Wickets',
    'common.strike_rate': 'Strike Rate',
    'common.overs': 'Overs',
    'common.target': 'Target',
    'common.accuracy': 'Accuracy',
  },

  hi: {
    // Nav Tabs
    'nav.discover': 'खोजें',
    'nav.shorts': 'शॉर्ट्स',
    'nav.tactical': 'रणनीतिक AI',
    'nav.stadium3d': '3D स्टेडियम',
    'nav.analytics': 'रडार',
    'nav.rl': 'RL एजेंट',
    'nav.cybersecurity': 'साइबर शील्ड',
    'nav.athletes': 'एथलीट',
    'nav.profile': 'प्रोफाइल',
    'nav.login': 'लॉग इन / साइन अप',
    'nav.logout': 'लॉग आउट',
    'nav.sparks': 'स्पार्क्स',
    'nav.live_mesh': 'आईसीसी लाइव टूर्नामेंट मेश',
    'nav.over_live': 'ओवर 14.3 लाइव',

    // 3D Stadium
    'stadium.title': 'अति-यथार्थवादी 3D WebGL क्रिकेट स्टेडियम',
    'stadium.subtitle': 'वॉल्यूमेट्रिक लाइटिंग, प्रोसीजरल टेक्सचर और भौतिकी इंजन',
    'stadium.desc': '4 फ्लडलाइट वॉल्यूमेट्रिक बीम, घास की धारियां, मिट्टी की पिच, एनिमेटेड एलईडी होर्डिंग और उड़ती गिल्लियां।',
    'stadium.play': 'चलाएं',
    'stadium.pause': 'रोकें',
    'stadium.reset': 'रीसेट',
    'stadium.cam_broadcast': 'प्रसारण',
    'stadium.cam_batter': 'बल्लेबाज POV',
    'stadium.cam_hawkeye': 'हॉक-आई',
    'stadium.cam_topdown': 'ऊपर से दृश्य',
    'stadium.cam_stump': 'स्टंप कैमरा',
    'stadium.cam_drone': 'ड्रोन ऑर्बिट',
    'stadium.delivery': 'गेंदबाजी:',
    'stadium.del_seam': '142 किमी/घंटा सीम',
    'stadium.del_spin': '86 किमी/घंटा स्पिन',
    'stadium.del_yorker': '148 किमी/घंटा यॉर्कर',
    'stadium.shot': 'शॉट:',
    'stadium.shot_cover': 'कवर ड्राइव (6)',
    'stadium.shot_pull': 'पुल शॉट (4)',
    'stadium.shot_straight': 'स्ट्रेट ड्राइव (4)',
    'stadium.shot_upper': 'अपर कट (6)',
    'stadium.shot_wicket': 'विकेट गिरा ⚡',
    'stadium.lighting': 'रोशनी:',
    'stadium.light_day': 'दिन',
    'stadium.light_sunset': 'सूर्यास्त',
    'stadium.light_night': 'रात',
    'stadium.trail': 'हॉक-आई ट्रेल',
    'stadium.flashes': 'दर्शकों के फ्लैश',
    'stadium.in_flight': 'हवा में',
    'stadium.contact_made': 'संपर्क हुआ',
    'stadium.ready': 'तैयार',

    // Tactical AI Co-Pilot
    'tactical.badge': 'AI सामरिक बुद्धिमत्ता और मल्टी-मॉडल पहनावा',
    'tactical.title': 'रणनीतिक सह-पायलट और AI मॉडल स्टूडियो',
    'tactical.subtitle': '2,896 मैचों (7,119 सामरिक स्थितियों) और 90,308 खिलाड़ी प्रोफाइलों पर प्रशिक्षित।',
    'tactical.tab_copilot': 'सह-पायलट और रडार',
    'tactical.tab_matchup': 'मुकाबला मैट्रिक्स',
    'tactical.tab_inplay': 'लाइव मैच सिमुलेटर',
    'tactical.tab_studio': 'AI स्टूडियो और परिदृश्य',
    'tactical.field_radar': 'गतिशील फील्ड प्लेसमेंट विज़ुअलाइज़र',
    'tactical.suggested_questions': 'AI सुझाए गए रणनीतिक सवाल',
    'tactical.click_analyze': 'विश्लेषण के लिए क्लिक करें',
    'tactical.ask_placeholder': 'रणनीतिक सवाल पूछें (उदा. कप्तान ने डीप स्लिप क्यों रखी?)...',
    'tactical.speak_guidance': 'रणनीति सुनें',
    'tactical.listen_review': 'ओवर समीक्षा सुनें',
    'tactical.threat_high': 'उच्च खतरा',
    'tactical.threat_vulnerable': 'संवेदनशील',
    'tactical.threat_neutral': 'तटस्थ',
    'tactical.threat_favorable': 'अनुकूल',

    // Data Analytics
    'analytics.badge': 'बिग डेटा क्रिकेट एनालिटिक्स और इंटेलिजेंस प्लेटफॉर्म',
    'analytics.title': 'डेटा विश्लेषण, मैच सांख्यिकी और ML टेलीमेट्री',
    'analytics.subtitle': '2,896 मैच फाइलों, 90,308 खिलाड़ियों के रिकॉर्ड और 16,666 प्रोफाइलों पर आधारित।',
    'analytics.tab_data': 'डेटा विश्लेषण',
    'analytics.tab_ml': 'ML भविष्यवक्ता',
    'analytics.tab_players': 'शीर्ष खिलाड़ी (500)',
    'analytics.tab_matches': 'हालिया मैच',
    'analytics.tab_charts': 'लाइव चार्ट्स',
    'analytics.kpi_matches': 'विश्लेषित मैच',
    'analytics.kpi_states': 'सामरिक स्थितियां',
    'analytics.kpi_players': 'खिलाड़ी रिकॉर्ड',
    'analytics.kpi_accuracy': 'GB सटीकता',
    'analytics.kpi_t20_par': 'T20 औसत स्कोर',
    'analytics.kpi_odi_par': 'ODI औसत स्कोर',
    'analytics.team_power_title': 'शीर्ष रेटेड अंतर्राष्ट्रीय और फ्रैंचाइज़ी टीमें',
    'analytics.phase_quantiles_title': 'चरण स्कोरिंग अपेक्षाएं (न्यूनतम बनाम अधिकतम)',
    'analytics.leaderboard_title': 'समग्र खिलाड़ी प्रभाव (CPI) लीडरबोर्ड',
    'analytics.predict_win': 'जीत की संभावना',
    'analytics.projected_score': 'अनुमानित पहली पारी स्कोर',
    'analytics.search_player': 'खिलाड़ी या देश द्वारा खोजें...',

    // General
    'common.live': 'लाइव',
    'common.all': 'सभी',
    'common.runs': 'रन',
    'common.wickets': 'विकेट',
    'common.strike_rate': 'स्ट्राइक रेट',
    'common.overs': 'ओवर',
    'common.target': 'लक्ष्य',
    'common.accuracy': 'सटीकता',
  },

  ta: {
    // Nav Tabs
    'nav.discover': 'கண்டறிக',
    'nav.shorts': 'குறும்படங்கள்',
    'nav.tactical': 'தந்திரோபாய AI',
    'nav.stadium3d': '3D அரங்கம்',
    'nav.analytics': 'ரேடார்',
    'nav.rl': 'RL முகவர்',
    'nav.cybersecurity': 'சைபர் பாதுகாப்பு',
    'nav.athletes': 'வீரர்கள்',
    'nav.profile': 'சுயவிவரம்',
    'nav.login': 'உள்நுழைய / பதிவு',
    'nav.logout': 'வெளியேறு',
    'nav.sparks': 'ஸ்பார்க்ஸ்',
    'nav.live_mesh': 'ஐசிசி நேரலை போட்டி மெஷ்',
    'nav.over_live': 'ஓவர் 14.3 நேரலை',

    // 3D Stadium
    'stadium.title': 'இயற்கையான 3D WebGL கிரிக்கெட் அரங்கம்',
    'stadium.subtitle': 'ஒளிரும் விளக்குகள், புல்வெளி மற்றும் இயற்பியல் இயந்திரம்',
    'stadium.desc': '4 ஃப்ளட்லைட்கள், பச்சை புல்வெளி தடம், களிமண் பிட்ச், ஒளிரும் எல்இடி பலகைகள் மற்றும் பறக்கும் பெயில்கள்.',
    'stadium.play': 'இயக்கு',
    'stadium.pause': 'நிறுத்து',
    'stadium.reset': 'மீட்டமை',
    'stadium.cam_broadcast': 'ஒளிபரப்பு',
    'stadium.cam_batter': 'பேட்டர் பார்வை',
    'stadium.cam_hawkeye': 'ஹாக்-ஐ',
    'stadium.cam_topdown': 'மேல் பார்வை',
    'stadium.cam_stump': 'ஸ்டம்ப் கேமரா',
    'stadium.cam_drone': 'ட்ரோன் சுழற்சி',
    'stadium.delivery': 'பந்துவீச்சு:',
    'stadium.del_seam': '142 கிமீ/ம சீம்',
    'stadium.del_spin': '86 கிமீ/ம ஸ்பின்',
    'stadium.del_yorker': '148 கிமீ/ம யார்க்கர்',
    'stadium.shot': 'ஷாட்:',
    'stadium.shot_cover': 'கவர் டிரைவ் (6)',
    'stadium.shot_pull': 'புல் ஷாட் (4)',
    'stadium.shot_straight': 'ஸ்ட்ரெய்ட் டிரைவ் (4)',
    'stadium.shot_upper': 'அப்பர் கட் (6)',
    'stadium.shot_wicket': 'விக்கெட் ⚡',
    'stadium.lighting': 'விளக்குகள்:',
    'stadium.light_day': 'பகல்',
    'stadium.light_sunset': 'மாலைப்பொழுது',
    'stadium.light_night': 'இரவு',
    'stadium.trail': 'ஹாக்-ஐ பாதை',
    'stadium.flashes': 'ரசிகர் கேமரா ஒளி',
    'stadium.in_flight': 'காற்றில்',
    'stadium.contact_made': 'தாக்கம் ஏற்பட்டது',
    'stadium.ready': 'தயார்',

    // Tactical AI Co-Pilot
    'tactical.badge': 'AI தந்திரோபாய நுண்ணறிவு & மாடல் குழுமம்',
    'tactical.title': 'தந்திரோபாய இணை-பைலட் & AI ஸ்டுடியோ',
    'tactical.subtitle': '2,896 போட்டிகள் மற்றும் 90,308 வீரர்களின் தரவுகளில் பயிற்சியளிக்கப்பட்டது.',
    'tactical.tab_copilot': 'இணை-பைலட் & ரேடார்',
    'tactical.tab_matchup': 'மோதல் மேட்ரிக்ஸ்',
    'tactical.tab_inplay': 'நேரலை வெற்றி உருவகப்படுத்துதல்',
    'tactical.tab_studio': 'AI ஸ்டுடியோ & காட்சிகள்',
    'tactical.field_radar': 'கள அமைப்பு காட்சிப்படுத்தி',
    'tactical.suggested_questions': 'AI பரிந்துரைக்கும் கேள்விகள்',
    'tactical.click_analyze': 'பகுப்பாய்வு செய்ய கிளிக் செய்க',
    'tactical.ask_placeholder': 'தந்திரோபாய கேள்வி கேட்கவும்...',
    'tactical.speak_guidance': 'வழிகாட்டலைக் கேட்கவும்',
    'tactical.listen_review': 'ஓவர் மதிப்பாய்வு கேட்கவும்',
    'tactical.threat_high': 'அதிக அச்சுறுத்தல்',
    'tactical.threat_vulnerable': 'பாதிக்கப்படக்கூடியது',
    'tactical.threat_neutral': 'நடுநிலை',
    'tactical.threat_favorable': 'சாதகமானது',

    // Data Analytics
    'analytics.badge': 'பிக் டேட்டா கிரிக்கெட் அனலிட்டிக்ஸ் தளம்',
    'analytics.title': 'தரவு பகுப்பாய்வு, போட்டி புள்ளிவிவரங்கள் & ML',
    'analytics.subtitle': '2,896 போட்டிகள் மற்றும் 90,308 வீரர்களின் தரவுத்தளத்தில் இருந்து பெறப்பட்டது.',
    'analytics.tab_data': 'தரவு பகுப்பாய்வு',
    'analytics.tab_ml': 'ML கணிப்பாளர்',
    'analytics.tab_players': 'சிறந்த வீரர்கள் (500)',
    'analytics.tab_matches': 'சமீபத்திய போட்டிகள்',
    'analytics.tab_charts': 'நேரலை வரைபடங்கள்',
    'analytics.kpi_matches': 'பகுப்பாய்வு செய்யப்பட்ட போட்டிகள்',
    'analytics.kpi_states': 'தந்திரோபாய நிலைகள்',
    'analytics.kpi_players': 'வீரர் பதிவுகள்',
    'analytics.kpi_accuracy': 'GB துல்லியம்',
    'analytics.kpi_t20_par': 'T20 சராசரி ஸ்கோர்',
    'analytics.kpi_odi_par': 'ODI சராசரி ஸ்கோர்',
    'analytics.team_power_title': 'அதிக மதிப்பீடு பெற்ற அணிகள்',
    'analytics.phase_quantiles_title': 'கட்ட வாரியான ரன் எதிர்பார்ப்புகள்',
    'analytics.leaderboard_title': 'வீரர் தாக்க (CPI) தரவரிசை',
    'analytics.predict_win': 'வெற்றி வாய்ப்பு',
    'analytics.projected_score': 'கணிக்கப்பட்ட முதல் இன்னிங்ஸ் ஸ்கோர்',
    'analytics.search_player': 'வீரர் அல்லது நாடு மூலம் தேடுக...',

    // General
    'common.live': 'நேரலை',
    'common.all': 'அனைத்தும்',
    'common.runs': 'ரன்கள்',
    'common.wickets': 'விக்கெட்டுகள்',
    'common.strike_rate': 'ஸ்ட்ரைக் ரேட்',
    'common.overs': 'ஓவர்கள்',
    'common.target': 'இலக்கு',
    'common.accuracy': 'துல்லியம்',
  },

  es: {
    // Nav Tabs
    'nav.discover': 'Descubrir',
    'nav.shorts': 'Shorts',
    'nav.tactical': 'IA Táctica',
    'nav.stadium3d': 'Estadio 3D',
    'nav.analytics': 'Radar',
    'nav.rl': 'Agente RL',
    'nav.cybersecurity': 'Ciberescudo',
    'nav.athletes': 'Atletas',
    'nav.profile': 'Perfil',
    'nav.login': 'Iniciar Sesión',
    'nav.logout': 'Cerrar Sesión',
    'nav.sparks': 'Chispas',
    'nav.live_mesh': 'RED EN VIVO TORNEO ICC',
    'nav.over_live': 'OVER 14.3 EN VIVO',

    // 3D Stadium
    'stadium.title': 'Estadio de Críquet 3D WebGL Hiperrealista',
    'stadium.subtitle': 'Iluminación Volumétrica, Texturas Procedurales y Motor Físico',
    'stadium.desc': '4 torres de focos con conos volumétricos, césped cortado por patrones, terreno de juego desgastado y física de bails.',
    'stadium.play': 'Reproducir',
    'stadium.pause': 'Pausa',
    'stadium.reset': 'Reiniciar',
    'stadium.cam_broadcast': 'Transmisión',
    'stadium.cam_batter': 'Vista Bateador',
    'stadium.cam_hawkeye': 'Ojo de Halcón',
    'stadium.cam_topdown': 'Vista Cenital',
    'stadium.cam_stump': 'Cámara Muñón',
    'stadium.cam_drone': 'Órbita Dron',
    'stadium.delivery': 'Lanzamiento:',
    'stadium.del_seam': '142 km/h Seam',
    'stadium.del_spin': '86 km/h Giro',
    'stadium.del_yorker': '148 km/h Yorker',
    'stadium.shot': 'Golpe:',
    'stadium.shot_cover': 'Cover Drive (6)',
    'stadium.shot_pull': 'Pull Shot (4)',
    'stadium.shot_straight': 'Straight Drive (4)',
    'stadium.shot_upper': 'Upper Cut (6)',
    'stadium.shot_wicket': 'Wicket ⚡',
    'stadium.lighting': 'Iluminación:',
    'stadium.light_day': 'Día',
    'stadium.light_sunset': 'Atardecer',
    'stadium.light_night': 'Noche',
    'stadium.trail': 'Trayectoria Hawk-Eye',
    'stadium.flashes': 'Flashes Multitud',
    'stadium.in_flight': 'EN EL AIRE',
    'stadium.contact_made': 'CONTACTO HECHO',
    'stadium.ready': 'LISTO',

    // Tactical AI Co-Pilot
    'tactical.badge': 'Inteligencia Táctica IA y Ensamble Multimodelo',
    'tactical.title': 'Copiloto Táctico y Estudio de Modelos IA',
    'tactical.subtitle': 'Entrenado con 2,896 partidos (7,119 estados tácticos) y 90,308 perfiles profesionales con 0.9988 ROC-AUC.',
    'tactical.tab_copilot': 'Copiloto y Radar',
    'tactical.tab_matchup': 'Matriz de Duelos',
    'tactical.tab_inplay': 'Simulador En Vivo',
    'tactical.tab_studio': 'Estudio IA y Escenarios',
    'tactical.field_radar': 'Visualizador Dinámico de Campo',
    'tactical.suggested_questions': 'Preguntas Tácticas Sugeridas por IA',
    'tactical.click_analyze': 'Clic para Analizar',
    'tactical.ask_placeholder': 'Haz una pregunta táctica...',
    'tactical.speak_guidance': 'Escuchar Guía',
    'tactical.listen_review': 'Escuchar Resumen del Over',
    'tactical.threat_high': 'AMENAZA ALTA',
    'tactical.threat_vulnerable': 'VULNERABLE',
    'tactical.threat_neutral': 'NEUTRAL',
    'tactical.threat_favorable': 'FAVORABLE',

    // Data Analytics
    'analytics.badge': 'Plataforma de Inteligencia y Big Data de Críquet',
    'analytics.title': 'Análisis de Datos, Estadísticas y Telemetría ML',
    'analytics.subtitle': 'Basado en 2,896 archivos de partidos, 90,308 registros históricos y 16,666 perfiles de jugadores.',
    'analytics.tab_data': 'Análisis de Datos',
    'analytics.tab_ml': 'Predictor ML',
    'analytics.tab_players': 'Mejores Jugadores (500)',
    'analytics.tab_matches': 'Partidos Recientes',
    'analytics.tab_charts': 'Gráficos en Vivo',
    'analytics.kpi_matches': 'Partidos Minados',
    'analytics.kpi_states': 'Estados Tácticos',
    'analytics.kpi_players': 'Registros Jugadores',
    'analytics.kpi_accuracy': 'Precisión GB',
    'analytics.kpi_t20_par': 'Promedio 1er Inns T20',
    'analytics.kpi_odi_par': 'Promedio 1er Inns ODI',
    'analytics.team_power_title': 'Equipos Mejor Calificados (ELO)',
    'analytics.phase_quantiles_title': 'Cuantiles de Anotación por Fase',
    'analytics.leaderboard_title': 'Clasificación de Impacto de Jugadores (CPI)',
    'analytics.predict_win': 'Probabilidad de Victoria',
    'analytics.projected_score': 'Puntuación Proyectada 1er Inns',
    'analytics.search_player': 'Buscar por jugador o país...',

    // General
    'common.live': 'EN VIVO',
    'common.all': 'Todos',
    'common.runs': 'Carreras',
    'common.wickets': 'Wickets',
    'common.strike_rate': 'Tasa de Golpeo',
    'common.overs': 'Overs',
    'common.target': 'Objetivo',
    'common.accuracy': 'Precisión',
  },

  ar: {
    // Nav Tabs
    'nav.discover': 'اكتشف',
    'nav.shorts': 'فيديوهات قصيرة',
    'nav.tactical': 'الذكاء التكتيكي',
    'nav.stadium3d': 'ملعب 3D',
    'nav.analytics': 'الرادار',
    'nav.rl': 'وكيل RL',
    'nav.cybersecurity': 'الدرع السيبراني',
    'nav.athletes': 'الرياضيون',
    'nav.profile': 'الملف الشخصي',
    'nav.login': 'تسجيل الدخول',
    'nav.logout': 'تسجيل الخروج',
    'nav.sparks': 'سباركس',
    'nav.live_mesh': 'شبكة بطولة ICC المباشرة',
    'nav.over_live': 'الشوط 14.3 مباشر',

    // 3D Stadium
    'stadium.title': 'ملعب الكريكيت ثلاثي الأبعاد الواقعي',
    'stadium.subtitle': 'إضاءة حجمية ومواد إجرائية وفيزياء متقدمة',
    'stadium.desc': '4 أبراج إضاءة مع مخاريط حجمية، عشب مخطط إجرائياً، ملعب طيني، شاشات رقمية متحركة.',
    'stadium.play': 'تشغيل',
    'stadium.pause': 'إيقاف مؤقت',
    'stadium.reset': 'إعادة ضبط',
    'stadium.cam_broadcast': 'بث تلفزيوني',
    'stadium.cam_batter': 'منظور الضارب',
    'stadium.cam_hawkeye': 'عين الصقر',
    'stadium.cam_topdown': 'منظر علوي',
    'stadium.cam_stump': 'كاميرا المرمى',
    'stadium.cam_drone': 'مدار الطائرة بدون طيار',
    'stadium.delivery': 'الرمية:',
    'stadium.del_seam': '142 كم/س درز',
    'stadium.del_spin': '86 كم/س دوران',
    'stadium.del_yorker': '148 كم/س يوركر',
    'stadium.shot': 'الضربة:',
    'stadium.shot_cover': 'ضربة التغطية (6)',
    'stadium.shot_pull': 'ضربة السحب (4)',
    'stadium.shot_straight': 'ضربة مستقيمة (4)',
    'stadium.shot_upper': 'ضربة علوية (6)',
    'stadium.shot_wicket': 'سقوط ويكيت ⚡',
    'stadium.lighting': 'الإضاءة:',
    'stadium.light_day': 'نهار',
    'stadium.light_sunset': 'غروب',
    'stadium.light_night': 'ليل',
    'stadium.trail': 'مسار عين الصقر',
    'stadium.flashes': 'فلاشات الجماهير',
    'stadium.in_flight': 'في الهواء',
    'stadium.contact_made': 'تم الاتصال',
    'stadium.ready': 'جاهز',

    // Tactical AI Co-Pilot
    'tactical.badge': 'الذكاء التكتيكي ومجموعة النماذج المتعددة',
    'tactical.title': 'المساعد التكتيكي واستوديو نماذج الذكاء الاصطناعي',
    'tactical.subtitle': 'مدرب على 2,896 مباراة (7,119 حالة تكتيكية) و90,308 ملف للاعبين بمعيار 0.9988 ROC-AUC.',
    'tactical.tab_copilot': 'المساعد التكتيكي والرادار',
    'tactical.tab_matchup': 'مصفوفة المواجهات',
    'tactical.tab_inplay': 'محاكي الفوز المباشر',
    'tactical.tab_studio': 'استوديو الذكاء الاصطناعي',
    'tactical.field_radar': 'خريطة توزيع الميدان التفاعلية',
    'tactical.suggested_questions': 'أسئلة تكتيكية مقترحة',
    'tactical.click_analyze': 'انقر للتحليل',
    'tactical.ask_placeholder': 'اطرح سؤالاً تكتيكياً...',
    'tactical.speak_guidance': 'استمع للتوجيه',
    'tactical.listen_review': 'استمع لمراجعة الشوط',
    'tactical.threat_high': 'تهديد مرتفع',
    'tactical.threat_vulnerable': 'معرض للخطر',
    'tactical.threat_neutral': 'محايد',
    'tactical.threat_favorable': 'مناسب',

    // Data Analytics
    'analytics.badge': 'منصة تحليلات البيانات الضخمة للكريكيت',
    'analytics.title': 'تحليل البيانات، إحصائيات المباريات وقياس التعلم الآلي',
    'analytics.subtitle': 'مبني على 2,896 ملف مباراة، 90,308 سجل للاعبين، و16,666 ملف شخصي.',
    'analytics.tab_data': 'تحليل البيانات',
    'analytics.tab_ml': 'متنبئ الفوز',
    'analytics.tab_players': 'أفضل اللاعبين (500)',
    'analytics.tab_matches': 'المباريات الأخيرة',
    'analytics.tab_charts': 'مخططات حية',
    'analytics.kpi_matches': 'المباريات المحللة',
    'analytics.kpi_states': 'الحالات التكتيكية',
    'analytics.kpi_players': 'سجلات اللاعبين',
    'analytics.kpi_accuracy': 'دقة GB',
    'analytics.kpi_t20_par': 'معدل الشوط الأول T20',
    'analytics.kpi_odi_par': 'معدل الشوط الأول ODI',
    'analytics.team_power_title': 'الفرق الأعلى تقييماً (ELO)',
    'analytics.phase_quantiles_title': 'توقعات تسجيل النقاط حسب المرحلة',
    'analytics.leaderboard_title': 'لوحة صدارة تأثير اللاعبين (CPI)',
    'analytics.predict_win': 'احتمال الفوز',
    'analytics.projected_score': 'النقاط المتوقعة للشوط الأول',
    'analytics.search_player': 'البحث حسب اللاعب أو الدولة...',

    // General
    'common.live': 'مباشر',
    'common.all': 'الكل',
    'common.runs': 'الركضات',
    'common.wickets': 'الويكيت',
    'common.strike_rate': 'معدل الضرب',
    'common.overs': 'الأشواط',
    'common.target': 'الهدف',
    'common.accuracy': 'الدقة',
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, defaultText?: string) => string;
  dir: 'ltr' | 'rtl';
  currentOption: LanguageOption;
  getSpeechLangCode: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('aura_fanverse_lang');
    if (saved && ['en', 'hi', 'ta', 'es', 'ar'].includes(saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('aura_fanverse_lang', lang);
    const opt = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    document.documentElement.dir = opt?.dir || 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    const opt = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    document.documentElement.dir = opt?.dir || 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, defaultText?: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en']?.[key] || defaultText || key;
  };

  const currentOption = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const getSpeechLangCode = (): string => {
    switch (language) {
      case 'hi': return 'hi-IN';
      case 'ta': return 'ta-IN';
      case 'es': return 'es-ES';
      case 'ar': return 'ar-SA';
      default: return 'en-US';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: currentOption.dir, currentOption, getSpeechLangCode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
