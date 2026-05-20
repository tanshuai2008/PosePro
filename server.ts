import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with increased limit for base64 images
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI SDK
// It checks process.env.GEMINI_API_KEY. User-agent is set for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to check if API key is present
function checkApiKey(res: express.Response) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or placeholder.");
  }
}

// 1. Coach Viewfinder Angle API
app.post("/api/coach-frame", async (req, res) => {
  checkApiKey(res);
  try {
    const { 
      image, // Base64 jpeg string
      locationName, 
      userPreferences, // AestheticProfile
      selectedSpotTips, // string[]
      activeStylePreset, // InfluencerStyle
      cameraSettings // { zoom, aperture, exposure }
    } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Missing image payload." });
    }

    // Strip out the data url header if present
    const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    };

    const locationContext = locationName ? `The photographer is shooting at landmark spot: "${locationName}".` : "The photographer is taking a casual portrait shot.";
    const activeStyleContext = activeStylePreset 
      ? `The user wants to mimic influencer style "${activeStylePreset.name}" with key pose guidance: "${activeStylePreset.keyPoseSuggestions?.join(', ')}".` 
      : "";
    
    let preferenceContext = "";
    if (userPreferences) {
      preferenceContext = `
The user has analyzed their partner's preferences previously:
- Partner enjoys: ${userPreferences.tonePreference} lighting/colors with ${userPreferences.compositionPreference} framing.
- Partner's scaling style: ${userPreferences.likesScale}.
- Key boyfriend mistakes to avoid in analysis: ${userPreferences.boyfriendMistakesToAvoid?.join(', ')}.
`;
    }

    const currentSettingsContext = cameraSettings 
      ? `The camera settings are currently Zoom: ${cameraSettings.zoom}, Aperture: ${cameraSettings.aperture}, Exposure: ${cameraSettings.exposure}.`
      : "";

    const userInstructionsPrompt = `
You are the ultimate AI Boyfriend Photo Coach, designed to help boys take incredible, high-quality, Insta-worthy pictures that their girlfriends or partners will absolutely rave about (guaranteed zero disappointment!).

Analyze the provided camera frame (which is a real-time shot of the target subject and scene) and provide photographic feedback.

Context details:
${locationContext}
${activeStyleContext}
${preferenceContext}
${currentSettingsContext}
${selectedSpotTips ? `Landmark advice: ${selectedSpotTips.join('. ')}` : ""}

Evaluate:
1. Composition & Framing: Are the partner's feet cut off? (Crucial boyfriend mistake!) Is there too much dead space above the head? Is the subject aligned with the Rule of Thirds or Grid lines?
2. Angle & Height: Is the camera too high (making them look short) or too low (unflattering nose angles)? Suggest the exact physical position: e.g., squat down, chest height, eye height, tilt camera up/down.
3. Lighting & Background: Are they backlit with face in shadows? Is the lighting too harsh? Check for background clutter like poles growing out of their head.
4. Posing Guidance: How should the boyfriend coach the model (e.g., 'tell her to chin down slightly', 'ask her to look 45 degrees away', 'tilt shoulder back')?
5. Camera Settings Adjustment: Suggest optimal zoom ratio (e.g. 2x is often best for portrait distortion), aperture choice, exposure correction.

Provide your analysis in the strict JSON schema provided below. Keep descriptions constructive, funny, and highly practical. Avoid generic filler. Be ultra specific with instructions!
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: userInstructionsPrompt },
        imagePart
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { 
              type: Type.INTEGER, 
              description: "A solid score from 0 to 100 based on aesthetic value, framing correctness and avoiding classic boyfriend errors." 
            },
            compositionFeedback: { 
              type: Type.STRING, 
              description: "Short, snappy direct advice on composition (e.g., 'Feet are cropped! Back up!' or 'Grid lines perfect. Maintain vertical alignment')." 
            },
            lightingInstructions: { 
              type: Type.STRING, 
              description: "Feedback about shadow details, backlit conditions, or light orientation (e.g., 'Backlit alert! Turn her 30 degrees right to catch the window glow')." 
            },
            posingCoaching: { 
              type: Type.STRING, 
              description: "Actionable voice commands the boy can say right now (e.g., 'Say, look over your shoulder and walk slow! Close eyes and laugh')." 
            },
            actionSettingChanges: {
              type: Type.OBJECT,
              properties: {
                zoom: { type: Type.STRING, description: "Suggested Zoom e.g., 2.0x, 1.0x, 3.0x" },
                aperture: { type: Type.STRING, description: "Suggested Aperture setting e.g., f/1.8, f/2.8, f/5.6" },
                exposure: { type: Type.STRING, description: "Suggested Exposure setting e.g., -0.3, +0.7, 0.0" }
              },
              required: ["zoom", "aperture", "exposure"]
            },
            overlayHintText: { 
              type: Type.STRING, 
              description: "HUD display tip, under 10 words, highly encouragingly." 
            }
          },
          required: ["score", "compositionFeedback", "lightingInstructions", "posingCoaching", "actionSettingChanges", "overlayHintText"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    res.json(parsedResponse);
  } catch (err: any) {
    console.error("Error in /api/coach-frame:", err);
    res.status(500).json({ error: err?.message || "Internal GenAI Server Error" });
  }
});

// 2. Persona Learning Preference from Liked vs Deleted Photos API
app.post("/api/learn-preferences", async (req, res) => {
  checkApiKey(res);
  try {
    const { keptPhotos, deletedPhotos } = req.body;

    if (!keptPhotos || !deletedPhotos) {
      return res.status(400).json({ error: "Missing kept and deleted photos descriptors." });
    }

    const userInstructionsPrompt = `
You are the Photography Preferences Learner. You will analyze what the User's Partner prefers based on custom meta-tags of which photos they "Kept" (Liked) and which ones they "Deleted" (Disliked).

Kept Photos data:
${JSON.stringify(keptPhotos, null, 2)}

Deleted Photos data:
${JSON.stringify(deletedPhotos, null, 2)}

Analyze the correlation:
- Contrast the framing (close-ups vs outfit focus vs landscapes) are they keeping close-ups or wide angles?
- Analyze common mistakes causing deletion (cropped feet, bad eye level, poor light direction, centered portraits).
- Synthesize an Aesthetic Profile consisting of:
  1. Likes scale ratio (e.g. 70% Outfit Portrait, 30% Scenic Vibe).
  2. Tone preference (Moody, Pastel, Vivid, Cinematic, Bright-and-Clean).
  3. Composition rule preferred (e.g., Off-Center Rule of Thirds, Symmetry, Minimal Empty Space).
  4. Checklist of 3 critical boyfriend mistakes to avoid immediately!
  5. Tailored visual hint for boyfriend cam overlays.

Prepare this analysis strictly in the JSON format requested.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstructionsPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            likesScale: { type: Type.STRING, description: "Ratio breakdown of Close-up Outfit vs Landscape scenery e.g., '70% Closeup Portrait, 30% Landscape Scenery'" },
            tonePreference: { type: Type.STRING, description: "Color and mood descriptor e.g. 'Warm Nostalgic / Golden Cinematic'" },
            compositionPreference: { type: Type.STRING, description: "Aesthetic placement description e.g., 'Off-center positioning with leading lines and low camera level'" },
            strengths: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of positive things they already do well." 
            },
            boyfriendMistakesToAvoid: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Boyfriend mistakes that annoy her most (e.g. 'Cropping her legs out in full outfit photos', 'Centering framing leaving too much head space')."
            },
            personalizedPromptTip: { type: Type.STRING, description: "An actionable summary note to apply on the coach overlay." }
          },
          required: ["likesScale", "tonePreference", "compositionPreference", "strengths", "boyfriendMistakesToAvoid", "personalizedPromptTip"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    res.json({
      ...parsedResponse,
      lastUpdated: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("Error in /api/learn-preferences:", err);
    res.status(500).json({ error: err?.message || "Internal GenAI Server Error" });
  }
});

// 3. Mimic Social Media / Influencer Style API
app.post("/api/analyze-portfolio", async (req, res) => {
  checkApiKey(res);
  try {
    const { handle, sampleImageBase64 } = req.body;
    
    // Default mock portfolio presets if user doesn't upload a custom screenshot
    if (!sampleImageBase64) {
      return res.status(400).json({ error: "Missing influencer image attachment for analysis." });
    }

    const cleanBase64 = sampleImageBase64.replace(/^data:image\/\w+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: "image/jpeg",
        data: cleanBase64,
      },
    };

    const influencerAestheticPrompt = `
You are an expert Social Media Aesthetic Consultant. Analyze this uploaded influencer screenshot or sample photograph under the handle "${handle || '@aesthetic_muse'}".

Perform stylistic visual reverse engineering:
1. Palette & Tone: What are the primary color casts, saturation depth, black/white points (vintage film look, cold moody, warm pastel)?
2. Camera Specs Mimicking: What zoom level works best to capture this look (e.g. 1.5x compress, 1x wide)? What aperture depth (f/1.4 crazy bokeh, or f/8.0 landscapes)? What exposure offset?
3. Composition Guidelines: What grid style or alignment geometry is present (e.g., triangle posing, rule-of-thirds, vertical power lines)?
4. Influencer Model Posing Code: Define 3 signature pose adjustments for the boyfriend to request (e.g. 'Hand in pocket, chin tilted away', 'Look down at knees while walking').

Output a beautifully configured style preset JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { text: influencerAestheticPrompt },
        imagePart
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            styleDescription: { type: Type.STRING, description: "Brief visual summary of the signature vibe e.g., 'Retro Tokyo Film Cast with heavy grain, nostalgic bokeh, and low sight angles'." },
            presetTags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Tags like ['Retro Film', 'Warm Glow', 'Candid Low-Angle', 'Chic Minimal']" 
            },
            cameraSettings: {
              type: Type.OBJECT,
              properties: {
                zoom: { type: Type.STRING, description: "Perfect zoom ratio e.g., '2.5x'" },
                aperture: { type: Type.STRING, description: "Perfect aperture setting e.g., 'f/1.8'" },
                exposure: { type: Type.STRING, description: "Perfect exposure setting e.g., '-0.3'" }
              },
              required: ["zoom", "aperture", "exposure"]
            },
            keyPoseSuggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Array of exactly 3 signature pose guides to display on-screen." 
            },
            guideOverlayType: { type: Type.STRING, description: "A selection of grid style: 'thirds', 'triangle', 'golden_ratio' or 'none'." },
            customSilhouetteType: { type: Type.STRING, description: "The styling skeleton category: 'vintage_lean', 'cute_wink', 'walking_glance' or 'sitting_cafe'." }
          },
          required: ["styleDescription", "presetTags", "cameraSettings", "keyPoseSuggestions", "guideOverlayType", "customSilhouetteType"]
        }
      }
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    res.json({
      id: "custom_" + Date.now(),
      handle: handle || "@custom_preset",
      name: `${handle}'s Aesthetic`,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      ...parsedResponse
    });
  } catch (err: any) {
    console.error("Error in /api/analyze-portfolio:", err);
    res.status(500).json({ error: err?.message || "Internal GenAI Server Error" });
  }
});

// Setup Vite & static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Boyfriend Camera Coach (男友拍照教练) server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
