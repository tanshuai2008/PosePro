export interface PhotoSpot {
  id: string;
  name: string;
  city: string;
  coordinates: { lat: number; lng: number };
  description: string;
  recommendedAngle: string;
  recommendedAngleDetail: string;
  zoom: string;
  aperture: string;
  exposure: string;
  compositionType: 'rule_of_thirds' | 'symmetry' | 'lead_lines' | 'center';
  poseOutline: string; // SVG path or ID for the visual silhouette outline
  tips: string[];
  sampleImage: string; // Base64 or illustration
}

export interface AestheticProfile {
  lastUpdated: string;
  likesScale: string; // Close-up vs Landscape
  tonePreference: string; // Warm, Cool, Moody, High-Contrast, Pastel
  compositionPreference: string; // Symmetrical, Rule of Thirds, Minimalist
  strengths: string[];
  boyfriendMistakesToAvoid: string[];
  personalizedPromptTip: string;
}

export interface MockPhoto {
  id: string;
  url: string;
  label: string; // e.g. "Sunset Portrait", "Food Close-up", "Low Angle Outfit"
  rating?: number;
  status?: 'keep' | 'delete' | 'undecided';
  analysis?: {
    composition: string;
    lighting: string;
    posing: string;
    boyFriendActionItem: string;
  };
}

export interface InfluencerStyle {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  styleDescription: string;
  presetTags: string[];
  cameraSettings: {
    zoom: string;
    aperture: string;
    exposure: string;
  };
  keyPoseSuggestions: string[];
  guideOverlayType: 'thirds' | 'triangle' | 'golden_ratio' | 'none';
  customSilhouetteType: 'vintage_lean' | 'cute_wink' | 'walking_glance' | 'sitting_cafe';
}

export interface CoachResponse {
  score: number;
  compositionFeedback: string;
  lightingInstructions: string;
  posingCoaching: string;
  actionSettingChanges: {
    zoom?: string;
    aperture?: string;
    exposure?: string;
  };
  overlayHintText: string;
}
