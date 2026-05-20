import { PhotoSpot, MockPhoto, InfluencerStyle } from "./types";

export const VIRAL_PHOTO_SPOTS: PhotoSpot[] = [
  {
    id: "eiffel_tower",
    name: "Eiffel Tower Main Perspective (埃菲尔铁塔网红机位)",
    city: "Paris, France",
    coordinates: { lat: 48.8584, lng: 2.2945 },
    description: "The viral spot from Rue de l'Université where the Eiffel Tower is framed directly between the buildings.",
    recommendedAngle: "Bottom Angle Tilt Up (低机位仰拍)",
    recommendedAngleDetail: "Squat down, align the camera lens with your partner's chest height and tilt up slightly to make them look elegant and towering alongside the iron structure. Do not cut their feet!",
    zoom: "1.5x",
    aperture: "f/2.2",
    exposure: "-0.3",
    compositionType: "lead_lines",
    poseOutline: "standing_back_turn",
    tips: [
      "Stand 3-4 meters away from your partner",
      "Keep the top of Eiffel Tower visible inside the top 1/3 of the frame",
      "Ask her to hold a croissant or turn her shoulders 45 degrees back towards you",
      "Avoid centering her if buildings are asymmetrical; use rule of thirds to place her on the right line"
    ],
    sampleImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "shibuya_crossing",
    name: "Shibuya Crossing Pedestrian Sync (涩谷十字路口动态走拍)",
    city: "Tokyo, Japan",
    coordinates: { lat: 35.6595, lng: 139.7005 },
    description: "The classic action-packed portrait amidst the neon signage and bustling Tokyo crosswalk.",
    recommendedAngle: "Waist Height Steady Match (腰部平行机位)",
    recommendedAngleDetail: "Hold the camera securely at waist level, parallel to her posture. Use continuous shooting/burst mode as she walks toward you to capture the motion blur of the crowd while keeping her crisp.",
    zoom: "1.0x (Wide Angle)",
    aperture: "f/4.0",
    exposure: "+0.7",
    compositionType: "center",
    poseOutline: "casual_mid_walk",
    tips: [
      "Wait for the green pedestrian light, step into the intersection, let her walk 3 steps ahead",
      "Enable high exposure (+0.7) to keep the neon lights vibrant and skin clean",
      "Composition should place her dead center to emphasize crosswalk symmetry",
      "Tell her: 'Walk slowly toward me, glance down at your keys, then smile sideways!'"
    ],
    sampleImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "bali_swing",
    name: "Bali Jungle Sunset Swing (巴厘岛丛林大秋千)",
    city: "Ubud, Bali",
    coordinates: { lat: -8.5069, lng: 115.2625 },
    description: "The dreamy, sweeping landscape overlooking the high palms of Ubud river valleys.",
    recommendedAngle: "Symmetrical Side Eye-Level (眼平机位侧拍)",
    recommendedAngleDetail: "Shoot from 5 meters away at her exact swinging eye level. Align the horizon to the bottom 1/3 line. This maintains depth and keeps the flowing dress fully visible.",
    zoom: "2.5x",
    aperture: "f/1.8 (Bokeh Rich)",
    exposure: "+0.3",
    compositionType: "symmetry",
    poseOutline: "flowing_dress",
    tips: [
      "Use 2.5x zoom to compress the massive jungle background, making it look dense and breathtaking",
      "Time the swing peak state; trigger shutter exactly when the swing halts for a millisecond at its highest point",
      "Focus single point AF on her face to ensure beautiful soft depth of field",
      "Tell her: 'Kick your feet up, arch your back slightly, and let your head fall back gently'"
    ],
    sampleImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "brooklyn_dumbo",
    name: "DUMBO Bridge Perspective (纽约最火曼哈顿大桥机位)",
    city: "Brooklyn, New York",
    coordinates: { lat: 40.7042, lng: -73.9892 },
    description: "Washington Street frame where the blue steel Manhattan Bridge aligns perfectly between brick warehouses.",
    recommendedAngle: "Lower Kneeling Tilt (低机位跪姿微仰拍)",
    recommendedAngleDetail: "Do not stand and shoot! Kneel down fully, hold the phone at his knee/thigh level, tilt upward 15 degrees. This visually builds longer legs and aligns the bridge perfectly around her head.",
    zoom: "2.0x",
    aperture: "f/2.8",
    exposure: "0.0",
    compositionType: "rule_of_thirds",
    poseOutline: "chic_lean",
    tips: [
      "Align the Manhattan Bridge leg inside the direct space between her arm and waist",
      "Strict rule check: Keep eye level matching the middle grid horizontal intersection line",
      "Do not position her on the middle street stripe; place her slightly to the left side",
      "Tell her: 'Lean your hip toward the brick wall, tuck your hair with one hand, and look away!'"
    ],
    sampleImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80"
  }
];

export const MOCK_USER_PHOTOS: MockPhoto[] = [
  {
    id: "photo_1",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    label: "Sunset Outfit Silhouette (cropped legs error)",
    status: "undecided",
    analysis: {
      composition: "Composition has a fatal mistake: The subject's feet and ankles are completely cut off at the bottom, which is the #1 complaint of partners worldwide! It interrupts the body proportions.",
      lighting: "Excellent warm backlight highlights. Face is slightly dark but has nice golden rim light.",
      posing: "Dynamic walk look is nice, but framing killed the proportion.",
      boyFriendActionItem: "Back up two steps, squat down lower to get a full body shot from below!"
    }
  },
  {
    id: "photo_2",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
    label: "Cafe Close-up (Rule of third symmetry check)",
    status: "undecided",
    analysis: {
      composition: "Stunning placement! The subject is looking toward the negative space according to the Rule of Thirds correctly.",
      lighting: "Beautiful diffuse window light. Perfect ambient glow and skin tone rendering.",
      posing: "Natural casual smile while holding a warm mug. Captures candid warmth.",
      boyFriendActionItem: "Excellent job here. Maintain this height level and soft light angle!"
    }
  },
  {
    id: "photo_3",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    label: "Street Outfit (Too much empty headspace)",
    status: "undecided",
    analysis: {
      composition: "There is 50% empty sky headspace above her. This makes her look short and shrinks her presence in the frame.",
      lighting: "Direct afternoon sunlight is high contrast, causing shadows underneath the eyes.",
      posing: "Great eye-contact smirk, looks confident.",
      boyFriendActionItem: "Tilt the camera down, put her eyes along the top third line, slice off excess sky!"
    }
  },
  {
    id: "photo_4",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    label: "Urban Candid (Bokeh rich portrait)",
    status: "undecided",
    analysis: {
      composition: "Fantastic full body alignment. Nice background perspective with lines converging behind her waist.",
      lighting: "City evening lights create cute round bokeh spheres. Bright color matches nicely.",
      posing: "Candid walking and looking down slightly with elegant collar tilt.",
      boyFriendActionItem: "Awesome street snapshot. You correctly utilized the high-quality 2x / f/1.8 bokeh compression."
    }
  }
];

export const MOCK_INFLUENCERS: InfluencerStyle[] = [
  {
    id: "moody_film",
    handle: "@retro_tokyo_vibes",
    name: "Tokyo Retro Film Cast (复古胶片感)",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    styleDescription: "Nostalgic 90s film aesthetic. Warm vintage undertones, subtle green shadow casts, grainy texture, and candid low-angle cinematic portraits.",
    presetTags: ["Vintage Film", "Warm Amber", "Heavy Grain", "Candid Low"],
    cameraSettings: {
      zoom: "1.5x",
      aperture: "f/1.8",
      exposure: "-0.3"
    },
    keyPoseSuggestions: [
      "Slight slouch, hands loosely in trench-coat pocket, looking down towards your feet.",
      "Candid side glance, wind blowing hair, clutching a hot canned coffee.",
      "Leaning shoulder against a retro vending machine, checking public transit schedule."
    ],
    guideOverlayType: "thirds",
    customSilhouetteType: "vintage_lean"
  },
  {
    id: "paris_chic",
    handle: "@minimalist_chic",
    name: "Parisian Warm Pastel Minimal (法式极简柔光)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    styleDescription: "Bright, warm, creamy, and high-fashion. Minimal negative backdrops, soft pastel glow, subtle shadows, and centered elegant long-legged postures.",
    presetTags: ["Paste Creamy", "Parisian High", "Clean Space", "Soft Diffuse"],
    cameraSettings: {
      zoom: "2.5x",
      aperture: "f/2.2",
      exposure: "+0.7"
    },
    keyPoseSuggestions: [
      "Staggered legs, walk slowly forward, tilting chin back slightly and closing eyes in golden sunlight.",
      "Sitting on a cafe chair, leaning chin on palm, looking sideways.",
      "Standing silhouette turning back to wave of hand with sunglasses sliding on nose."
    ],
    guideOverlayType: "triangle",
    customSilhouetteType: "sitting_cafe"
  },
  {
    id: "urban_cyber",
    handle: "@cyber_neon_core",
    name: "Cyber Street Contrast (霓虹赛博高街)",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    styleDescription: "Dark moody background, flashy neon primary highlights, high contrast and razor-sharp outlines with dynamic movement focus.",
    presetTags: ["High Contrast", "Cyberpunk Neon", "Sharp Edge", "Action Frame"],
    cameraSettings: {
      zoom: "1.0x",
      aperture: "f/4.0",
      exposure: "-0.7"
    },
    keyPoseSuggestions: [
      "Glaring directly at the camera through clear glasses, neon reflections in eyes.",
      "Walking away aggressively down wet alleyway, turning collar up.",
      "Squatting low with street-reflecting sneakers in front center, looking up at camera lens."
    ],
    guideOverlayType: "golden_ratio",
    customSilhouetteType: "walking_glance"
  }
];
