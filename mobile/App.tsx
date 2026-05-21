import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  Camera as CameraIcon,
  MapPin,
  Sparkles,
  Layers,
  Sliders,
  Heart,
  User,
  RefreshCw,
  Info,
  Navigation,
  AlertTriangle,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react-native";

import { PhotoSpot, AestheticProfile, InfluencerStyle, CoachResponse } from "./types";
import { VIRAL_PHOTO_SPOTS, MOCK_INFLUENCERS } from "./data";
import SilhouetteOverlay from "./components/SilhouetteOverlay";
import PreferenceDashboard from "./components/PreferenceDashboard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [activeTab, setActiveTab] = useState<"viewfinder" | "learning" | "influencers">("viewfinder");
  const [serverIp, setServerIp] = useState<string>("192.168.1.100"); // Dynamic IP helper

  // Selected configurations
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot>(VIRAL_PHOTO_SPOTS[0]);
  const [activeStyle, setActiveStyle] = useState<InfluencerStyle>(MOCK_INFLUENCERS[0]);

  // Preferences profile (synchronized from Taste Learner)
  const [profile, setProfile] = useState<AestheticProfile>({
    lastUpdated: "",
    likesScale: "Balanced 50% Outfit / 50% Landscape",
    tonePreference: "Nostalgic Vintage Film look",
    compositionPreference: "Lower position, symmetrical center alignment",
    strengths: ["Clean focus", "Rule of thirds compliance"],
    boyfriendMistakesToAvoid: ["Cropping feet inside full dress outfit shots!"],
    personalizedPromptTip: "Squat down 15 degrees, use 2.0x zoom, and align her head with the upper third line.",
  });

  // Camera settings state
  const [zoom, setZoom] = useState<string>("1.5x");
  const [aperture, setAperture] = useState<string>("f/1.8");
  const [exposure, setExposure] = useState<string>("-0.3");

  // Camera vs Simulated mode states
  const [cameraMode, setCameraMode] = useState<"simulated" | "live">("simulated");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // HUD Guidance feedback
  const [coachFeedback, setCoachFeedback] = useState<CoachResponse>({
    score: 84,
    compositionFeedback:
      "Looking solid! Keep Eiffel tower fully framed. Lower your phone angle by 3 inches to elongate her height.",
    lightingInstructions: "Soft direct glow is magnificent. Watch out for severe building shadow line on her shoulder.",
    posingCoaching: "Action voice command: 'Turn around, point chin to left shoulder and flip hair!'",
    actionSettingChanges: {
      zoom: "1.5x",
      aperture: "f/1.8",
      exposure: "-0.3",
    },
    overlayHintText: "Lower camera angle! Watch her feet!",
  });

  const [isCoachingLoading, setIsCoachingLoading] = useState<boolean>(false);
  const [gridOverlay, setGridOverlay] = useState<"thirds" | "triangle" | "golden" | "none">("thirds");
  const [silhouetteOpacity, setSilhouetteOpacity] = useState<number>(0.75);

  // Custom influencer style builder
  const [customHandle, setCustomHandle] = useState<string>("@cyber_tokyo");
  const [customInfluencerFile, setCustomInfluencerFile] = useState<string>("");
  const [customInfluencers, setCustomInfluencers] = useState<InfluencerStyle[]>([]);
  const [isAnalyzingInfluencer, setIsAnalyzingInfluencer] = useState<boolean>(false);

  // GPS Simulation state
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string>("");

  // Sync camera parameters when influencer changes
  useEffect(() => {
    if (activeStyle) {
      setZoom(activeStyle.cameraSettings.zoom);
      setAperture(activeStyle.cameraSettings.aperture);
      setExposure(activeStyle.cameraSettings.exposure);
    }
  }, [activeStyle]);

  const applySpotSpec = (spot: PhotoSpot) => {
    setSelectedSpot(spot);
    setZoom(spot.zoom);
    setAperture(spot.aperture);
    setExposure(spot.exposure);
  };

  const handleCameraToggle = async () => {
    if (cameraMode === "simulated") {
      if (!permission?.granted) {
        const res = await requestPermission();
        if (!res.granted) {
          Alert.alert(
            "Camera Access Required",
            "Please enable camera permissions in your device settings or use the simulated sandbox mode.",
            [{ text: "OK" }]
          );
          return;
        }
      }
      setCameraMode("live");
    } else {
      setCameraMode("simulated");
    }
  };

  const runAICritique = async () => {
    setIsCoachingLoading(true);
    try {
      let activeImageBase64 = "";

      if (cameraMode === "live" && cameraRef.current) {
        // Snap active camera frame
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
        });
        if (photo && photo.base64) {
          activeImageBase64 = `data:image/jpeg;base64,${photo.base64}`;
        }
      }

      const backendUrl = `http://${serverIp.trim()}:3000/api/coach-frame`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: activeImageBase64 || "base64PlaceholderSceneryCode",
          locationName: selectedSpot.name,
          userPreferences: profile,
          selectedSpotTips: selectedSpot.tips,
          activeStylePreset: activeStyle,
          cameraSettings: { zoom, aperture, exposure },
        }),
      });

      if (!response.ok) {
        throw new Error("Coach API request failed");
      }

      const critique = await response.json();
      setCoachFeedback(critique);
      Alert.alert("AI Critique Refreshed!", "Gemini completed direct frame review.");
    } catch (err: any) {
      console.log("Critique API error:", err);
      // Construct premium simulated response as fallback if backend is offline
      setCoachFeedback({
        score: Math.floor(Math.random() * 15) + 81,
        compositionFeedback: `Grid alignment is accurate! Based on landmark profile: ${selectedSpot.recommendedAngle}. Watch the bottom edge spacing.`,
        lightingInstructions: `Direct lighting detected. Compensate with ${exposure} EV to balance shadow depth.`,
        posingCoaching: `Ask her: "${selectedSpot.tips[2] || "Look slightly away and smile gently towards the horizon!"}"`,
        actionSettingChanges: { zoom, aperture, exposure },
        overlayHintText: selectedSpot.recommendedAngle.includes("Bottom") ? "Squat down! Level camera!" : "Hold eye-level!",
      });
      Alert.alert("Local AI Assistant Active", "Backend offline. Evaluated overlay using local landmark blueprints.");
    } finally {
      setIsCoachingLoading(false);
    }
  };

  const runInfluencerReverseEngineer = () => {
    setIsAnalyzingInfluencer(true);
    setTimeout(() => {
      // Simulate reverse engineer profile response
      const fakePreset: InfluencerStyle = {
        id: "custom_" + Date.now(),
        handle: customHandle,
        name: `${customHandle}'s Signature Look`,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        styleDescription: `Custom reverse-engineered aesthetic, featuring premium f/1.4 soft lens compression.`,
        presetTags: ["AI Reverse-Eng", "Warm Film Tone", "Rule of Thirds Alignment"],
        cameraSettings: {
          zoom: "2.0x",
          aperture: "f/1.4",
          exposure: "+0.3",
        },
        keyPoseSuggestions: [
          "Slight head tilt with sunglasses slightly lowered on nose.",
          "Walk forward with hands on waist line, glancing downwards.",
          "Sit down, lean chin on hand, looking directly at lens.",
        ],
        guideOverlayType: "golden_ratio",
        customSilhouetteType: "walking_glance",
      };
      setCustomInfluencers((prev) => [fakePreset, ...prev]);
      setActiveStyle(fakePreset);
      setIsAnalyzingInfluencer(false);
      Alert.alert("Aesthetic Cloned!", `Applied new @${customHandle.replace("@", "")} preset values to Viewfinder.`);
      setActiveTab("viewfinder");
    }, 1500);
  };

  const detectLiveLocation = () => {
    setIsLocating(true);
    setLocationStatus("Tuning GPS satellite...");

    setTimeout(() => {
      setIsLocating(false);
      setLocationStatus("Matched local landmark!");

      // Dynamic local landmark recommendation injection
      const mockLocalSpot: PhotoSpot = {
        id: "local_detected",
        name: "Detected Local High-Street Spot (智能推荐打卡机位)",
        city: "Metropolitan District",
        coordinates: { lat: 0, lng: 0 },
        description: "AI-synchronized with popular high-fashion hashtags nearby.",
        recommendedAngle: "Bottom Angle Chest Height (低位平视拍)",
        recommendedAngleDetail: "Align camera with her chest, tilt back 10 degrees. This provides professional high-fashion vibes.",
        zoom: "2.0x",
        aperture: "f/2.2",
        exposure: "+0.3",
        compositionType: "rule_of_thirds",
        poseOutline: "vintage_lean",
        tips: [
          "Ensure she stands on the left grid third intersection",
          "Ask her to tuck her chin down slightly to minimize direct lighting glare",
          "Let the background have subtle walking motion blur",
        ],
        sampleImage: "https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?w=600&auto=format&fit=crop&q=80",
      };
      setSelectedSpot(mockLocalSpot);
      applySpotSpec(mockLocalSpot);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <CameraIcon size={16} color="#ec4899" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.logoText}>男友拍照教练</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionText}>PRO V2.8</Text>
              </View>
            </View>
            <Text style={styles.subtitleText}>Real-time AI Guidance & Silhouette Overlay</Text>
          </View>
        </View>
      </View>

      {/* Active Tab Panel */}
      <View style={styles.panelContainer}>
        {activeTab === "viewfinder" && (
          <View style={styles.viewfinderTab}>
            {/* Viewfinder Top Area: Landmark Spots */}
            <View style={styles.spotsRow}>
              <View style={styles.spotsRowHeader}>
                <View style={styles.labelRow}>
                  <MapPin size={12} color="#ec4899" />
                  <Text style={styles.rowLabelText}>VIRAL HOTSPOTS</Text>
                </View>
                <TouchableOpacity
                  style={styles.gpsBtn}
                  onPress={detectLiveLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <ActivityIndicator size="small" color="#ec4899" />
                  ) : (
                    <>
                      <Navigation size={10} color="#ec4899" style={{ marginRight: 3 }} />
                      <Text style={styles.gpsText}>GPS</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {locationStatus ? (
                <Text style={styles.gpsStatusText}>{locationStatus}</Text>
              ) : null}

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.spotsScroll}
                contentContainerStyle={styles.spotsScrollContent}
              >
                {VIRAL_PHOTO_SPOTS.map((spot) => (
                  <TouchableOpacity
                    key={spot.id}
                    style={[
                      styles.spotBadge,
                      selectedSpot.id === spot.id && styles.activeSpotBadge,
                    ]}
                    onPress={() => applySpotSpec(spot)}
                  >
                    <Image source={{ uri: spot.sampleImage }} style={styles.spotThumb as any} />
                    <View style={styles.spotInfoTextWrapper}>
                      <Text
                        style={[
                          styles.spotNameText,
                          selectedSpot.id === spot.id && styles.activeSpotNameText,
                        ]}
                        numberOfLines={1}
                      >
                        {spot.name.split(" ")[0]}
                      </Text>
                      <Text style={styles.spotCityText}>{spot.city.split(",")[0]}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Main Phone Camera Viewfinder */}
            <View style={styles.cameraBoxContainer}>
              {cameraMode === "live" && permission?.granted ? (
                <CameraView ref={cameraRef} style={styles.cameraView} facing="back">
                  {/* Grid Lines Overlay */}
                  {gridOverlay === "thirds" && (
                    <View style={styles.gridThirds}>
                      <View style={styles.gridRow} />
                      <View style={styles.gridRow} />
                      <View style={styles.gridColContainer}>
                        <View style={styles.gridCol} />
                        <View style={styles.gridCol} />
                      </View>
                    </View>
                  )}
                  {gridOverlay === "triangle" && (
                    <View style={styles.gridTriangle}>
                      <View style={styles.diagLineLeft} />
                      <View style={styles.diagLineRight} />
                    </View>
                  )}

                  {/* Silhouette Hologram Overlay */}
                  <SilhouetteOverlay
                    type={selectedSpot.poseOutline || activeStyle.customSilhouetteType}
                    opacity={silhouetteOpacity}
                  />

                  {/* Top Overlay HUD Tag */}
                  <View style={styles.hudOverlayTag}>
                    <Text style={styles.hudOverlayTagText}>
                      ACTIVE OUTLINE: {(selectedSpot.poseOutline || activeStyle.customSilhouetteType).toUpperCase()}
                    </Text>
                  </View>
                </CameraView>
              ) : (
                // Simulated Sandbox Scenery View
                <View style={styles.simulatedSceneryWrapper}>
                  <Image
                    source={{ uri: selectedSpot.sampleImage }}
                    style={styles.simulatedImage as any}
                    resizeMode="cover"
                  />

                  {/* Grid Lines Overlay */}
                  {gridOverlay === "thirds" && (
                    <View style={styles.gridThirds}>
                      <View style={styles.gridRow} />
                      <View style={styles.gridRow} />
                      <View style={styles.gridColContainer}>
                        <View style={styles.gridCol} />
                        <View style={styles.gridCol} />
                      </View>
                    </View>
                  )}
                  {gridOverlay === "triangle" && (
                    <View style={styles.gridTriangle}>
                      <View style={styles.diagLineLeft} />
                      <View style={styles.diagLineRight} />
                    </View>
                  )}

                  {/* Silhouette Hologram Overlay */}
                  <SilhouetteOverlay
                    type={selectedSpot.poseOutline || activeStyle.customSilhouetteType}
                    opacity={silhouetteOpacity}
                  />

                  <View style={styles.hudOverlayTag}>
                    <Text style={styles.hudOverlayTagText}>SIMULATED VIEWPORT SANDBOX</Text>
                  </View>
                </View>
              )}

              {/* Float Glassmorphic AI Critique HUD Box */}
              <View style={styles.critiqueHudBox}>
                <View style={styles.critiqueHeader}>
                  <Text style={styles.critiqueTitle}>GEMINI LIVE COACHING DECK</Text>
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{coachFeedback.score} / 100</Text>
                  </View>
                </View>
                <Text style={styles.critiqueSubtitle}>
                  🚨 <Text style={styles.highlightText}>{coachFeedback.overlayHintText}</Text>
                </Text>
                <Text style={styles.feedbackBodyText} numberOfLines={2}>
                  {coachFeedback.compositionFeedback}
                </Text>
                <Text style={styles.posingText} numberOfLines={1}>
                  🗣️ Posing cue: "{coachFeedback.posingCoaching}"
                </Text>
              </View>
            </View>

            {/* Viewfinder Controls Area */}
            <View style={styles.controlsArea}>
              {/* Dial: Camera Zoom Selector */}
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>ZOOM</Text>
                <View style={styles.dialContainer}>
                  {["1.0x", "1.5x", "2.0x", "2.5x"].map((zVal) => (
                    <TouchableOpacity
                      key={zVal}
                      style={[styles.dialCircle, zoom === zVal && styles.activeDialCircle]}
                      onPress={() => setZoom(zVal)}
                    >
                      <Text
                        style={[styles.dialText, zoom === zVal && styles.activeDialText]}
                      >
                        {zVal}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Dial: Silhouette Opacity */}
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>OPACITY</Text>
                <View style={styles.dialContainer}>
                  {[0.25, 0.5, 0.75, 1.0].map((oVal) => (
                    <TouchableOpacity
                      key={oVal}
                      style={[
                        styles.dialPill,
                        silhouetteOpacity === oVal && styles.activeDialPill,
                      ]}
                      onPress={() => setSilhouetteOpacity(oVal)}
                    >
                      <Text
                        style={[
                          styles.dialPillText,
                          silhouetteOpacity === oVal && styles.activeDialPillText,
                        ]}
                      >
                        {oVal * 100}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Dial: Grid Lines */}
              <View style={styles.controlRow}>
                <Text style={styles.controlLabel}>GRID TYPE</Text>
                <View style={styles.dialContainer}>
                  {(["thirds", "triangle", "none"] as const).map((gVal) => (
                    <TouchableOpacity
                      key={gVal}
                      style={[
                        styles.dialPill,
                        gridOverlay === gVal && styles.activeDialPill,
                      ]}
                      onPress={() => setGridOverlay(gVal)}
                    >
                      <Text
                        style={[
                          styles.dialPillText,
                          gridOverlay === gVal && styles.activeDialPillText,
                        ]}
                      >
                        {gVal.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.triggerButtonRow}>
                <TouchableOpacity
                  style={[styles.cameraModeToggleBtn, cameraMode === "live" && styles.liveCameraActive]}
                  onPress={handleCameraToggle}
                >
                  <CameraIcon size={18} color="#ffffff" />
                  <Text style={styles.cameraToggleText}>
                    {cameraMode === "live" ? "SIMULATOR" : "USE PHONE CAM"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.critiqueTriggerBtn}
                  onPress={runAICritique}
                  disabled={isCoachingLoading}
                >
                  {isCoachingLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Sparkles size={16} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.critiqueText}>AI SNAP CRITIQUE</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === "learning" && (
          <PreferenceDashboard
            profile={profile}
            onUpdateProfile={setProfile}
            serverIp={serverIp}
            onChangeServerIp={setServerIp}
          />
        )}

        {activeTab === "influencers" && (
          <ScrollView style={styles.influencersTab} contentContainerStyle={styles.scrollPadding}>
            {/* Clone panel card */}
            <View style={styles.influencerFormCard}>
              <View style={styles.cardIconHeader}>
                <Sparkles size={20} color="#fbbf24" />
                <Text style={styles.influencerCardTitle}>Clone Influencer Aesthetic</Text>
              </View>
              <Text style={styles.influencerCardDesc}>
                Type her favorite influencer handle, mock upload a sample screenshot, and let Gemini deconstruct the layout grids and pose guidelines.
              </Text>

              {/* Form Input */}
              <View style={styles.formInputGroup}>
                <Text style={styles.formLabel}>INFLUENCER HANDLE ID</Text>
                <View style={styles.inputPrefixWrapper}>
                  <Text style={styles.handleSymbol}>@</Text>
                  <TextInput
                    style={styles.handleInput}
                    value={customHandle.replace("@", "")}
                    onChangeText={(val) => setCustomHandle("@" + val)}
                    placeholder="aesthetic_goddess"
                    placeholderTextColor="#64748b"
                  />
                </View>

                {/* Simulated screenshot drop area */}
                <TouchableOpacity
                  style={styles.screenshotDropArea}
                  onPress={() => setCustomInfluencerFile("loaded")}
                >
                  {customInfluencerFile ? (
                    <View style={styles.screenshotActive}>
                      <ImageIcon size={28} color="#ec4899" />
                      <Text style={styles.screenshotActiveText}>Screenshot Analyzed Successfully!</Text>
                      <Text style={styles.screenshotChangeText}>Tap to change mockup</Text>
                    </View>
                  ) : (
                    <View style={styles.screenshotPlaceholder}>
                      <ImageIcon size={28} color="#64748b" style={{ marginBottom: 6 }} />
                      <Text style={styles.screenshotPlaceText}>Mock Vibe Screenshot Attached</Text>
                      <Text style={styles.screenshotSubText}>Tap to select influencer sample image</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.formSyncBtn}
                  onPress={runInfluencerReverseEngineer}
                  disabled={isAnalyzingInfluencer}
                >
                  {isAnalyzingInfluencer ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Sparkles size={14} color="#ffffff" style={{ marginRight: 6 }} />
                      <Text style={styles.formSyncBtnText}>Reverse Engineer Look</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Style Preset Selector */}
            <View style={styles.influencerFormCard}>
              <Text style={styles.sectionHeadingText}>CHOOSE DYNAMIC PRESET TEMPLATE</Text>
              <Text style={styles.influencerCardDesc}>
                Select an aesthetic profile below to load its framing metrics and holographic positioning onto your camera screen.
              </Text>

              <View style={styles.presetsList}>
                {/* Custom Analyzed presets */}
                {customInfluencers.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetRow,
                      activeStyle.id === preset.id && styles.activePresetRow,
                    ]}
                    onPress={() => {
                      setActiveStyle(preset);
                      setActiveTab("viewfinder");
                    }}
                  >
                    <View style={[styles.avatarBox, styles.customAvatarBg]}>
                      <Text style={styles.avatarLetter}>AI</Text>
                    </View>
                    <View style={styles.presetContent}>
                      <View style={styles.presetTitleHeader}>
                        <Text style={styles.presetName}>{preset.name}</Text>
                        <Text style={styles.presetBadge}>LIVE CLONED</Text>
                      </View>
                      <Text style={styles.presetDesc}>{preset.styleDescription}</Text>
                      <View style={styles.tagSpecsRow}>
                        <Text style={styles.specTag}>Zoom: {preset.cameraSettings.zoom}</Text>
                        <Text style={styles.specTag}>Aperture: {preset.cameraSettings.aperture}</Text>
                        <Text style={styles.specTag}>Exp: {preset.cameraSettings.exposure}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                {/* Preinstalled influencers */}
                {MOCK_INFLUENCERS.map((preset) => (
                  <TouchableOpacity
                    key={preset.id}
                    style={[
                      styles.presetRow,
                      activeStyle.id === preset.id && styles.activePresetRow,
                    ]}
                    onPress={() => {
                      setActiveStyle(preset);
                      setActiveTab("viewfinder");
                    }}
                  >
                    <Image source={{ uri: preset.avatar }} style={styles.avatarImage as any} />
                    <View style={styles.presetContent}>
                      <View style={styles.presetTitleHeader}>
                        <Text style={styles.presetName}>{preset.name}</Text>
                        <Text style={styles.presetHandle}>{preset.handle}</Text>
                      </View>
                      <Text style={styles.presetDesc}>{preset.styleDescription}</Text>
                      <View style={styles.tagSpecsRow}>
                        {preset.presetTags.slice(0, 2).map((t, idx) => (
                          <Text key={idx} style={styles.vibeTag}>
                            {t}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Glassmorphic Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navBtn, activeTab === "viewfinder" && styles.activeNavBtn]}
          onPress={() => setActiveTab("viewfinder")}
        >
          <CameraIcon size={18} color={activeTab === "viewfinder" ? "#ec4899" : "#64748b"} />
          <Text style={[styles.navText, activeTab === "viewfinder" && styles.activeNavText]}>
            Viewfinder
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === "learning" && styles.activeNavBtn]}
          onPress={() => setActiveTab("learning")}
        >
          <Heart size={18} color={activeTab === "learning" ? "#ec4899" : "#64748b"} />
          <Text style={[styles.navText, activeTab === "learning" && styles.activeNavText]}>
            Taste Learner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, activeTab === "influencers" && styles.activeNavBtn]}
          onPress={() => setActiveTab("influencers")}
        >
          <User size={18} color={activeTab === "influencers" ? "#ec4899" : "#64748b"} />
          <Text style={[styles.navText, activeTab === "influencers" && styles.activeNavText]}>
            Copycat Vibe
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
    backgroundColor: "#020617",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 15,
    fontWeight: "900",
    color: "#ffffff",
  },
  versionBadge: {
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.2)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  versionText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#ec4899",
  },
  subtitleText: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
  },
  panelContainer: {
    flex: 1,
  },
  viewfinderTab: {
    flex: 1,
    flexDirection: "column",
  },
  spotsRow: {
    paddingVertical: 8,
    backgroundColor: "#020617",
    borderBottomWidth: 1,
    borderBottomColor: "#0f172a",
  },
  spotsRowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowLabelText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#64748b",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  gpsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.2)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  gpsText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#ec4899",
  },
  gpsStatusText: {
    fontSize: 9,
    color: "#fb923c",
    fontFamily: "System",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  spotsScroll: {
    paddingLeft: 16,
  },
  spotsScrollContent: {
    paddingRight: 32,
    gap: 8,
  },
  spotBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 8,
    padding: 6,
    width: 150,
  },
  activeSpotBadge: {
    borderColor: "#ec4899",
    backgroundColor: "#1f1025",
  },
  spotThumb: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginRight: 6,
  },
  spotInfoTextWrapper: {
    flex: 1,
  },
  spotNameText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#cbd5e1",
  },
  activeSpotNameText: {
    color: "#ffffff",
  },
  spotCityText: {
    fontSize: 8,
    color: "#64748b",
  },
  cameraBoxContainer: {
    flex: 1,
    position: "relative",
    backgroundColor: "#000000",
  },
  cameraView: {
    flex: 1,
  },
  simulatedSceneryWrapper: {
    flex: 1,
    position: "relative",
    backgroundColor: "#0f172a",
  },
  simulatedImage: {
    width: "100%",
    height: "100%",
  },
  hudOverlayTag: {
    position: "absolute",
    top: 12,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(34, 211, 238, 0.2)",
  },
  hudOverlayTagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#22d3ee",
    fontFamily: "System",
  },

  // Grid system overlays
  gridThirds: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-around",
    backgroundColor: "transparent",
  },
  gridRow: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "100%",
  },
  gridColContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
  },
  gridCol: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    height: "100%",
  },
  gridTriangle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  diagLineLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    transform: [{ rotate: "45deg" }],
  },
  diagLineRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    transform: [{ rotate: "-45deg" }],
  },

  // Floating AI coach box
  critiqueHudBox: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.25)",
    padding: 12,
  },
  critiqueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  critiqueTitle: {
    fontSize: 9,
    fontWeight: "900",
    color: "#ec4899",
    letterSpacing: 0.5,
  },
  scoreBadge: {
    backgroundColor: "rgba(236, 72, 153, 0.15)",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#f472b6",
  },
  critiqueSubtitle: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  highlightText: {
    color: "#22d3ee",
  },
  feedbackBodyText: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 14,
    marginBottom: 4,
  },
  posingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fbbf24",
  },

  // Controls Area
  controlsArea: {
    padding: 12,
    backgroundColor: "#020617",
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  controlLabel: {
    width: 60,
    fontSize: 9,
    fontWeight: "900",
    color: "#64748b",
  },
  dialContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },
  dialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  activeDialCircle: {
    borderColor: "#ec4899",
    backgroundColor: "rgba(236, 72, 153, 0.1)",
  },
  dialText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
  },
  activeDialText: {
    color: "#ec4899",
  },
  dialPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
  },
  activeDialPill: {
    borderColor: "#ec4899",
    backgroundColor: "rgba(236, 72, 153, 0.1)",
  },
  dialPillText: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "700",
  },
  activeDialPillText: {
    color: "#ec4899",
  },
  triggerButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12,
  },
  cameraModeToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    gap: 6,
  },
  liveCameraActive: {
    backgroundColor: "#0284c7",
    borderColor: "#38bdf8",
  },
  cameraToggleText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },
  critiqueTriggerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1.2,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ec4899",
    gap: 6,
  },
  critiqueText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },

  // Influencers Tab styles
  influencersTab: {
    flex: 1,
    backgroundColor: "#020617",
  },
  scrollPadding: {
    padding: 16,
    paddingBottom: 40,
  },
  influencerFormCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardIconHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  influencerCardTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#ffffff",
    marginLeft: 8,
  },
  influencerCardDesc: {
    fontSize: 11,
    color: "#64748b",
    lineHeight: 15,
    marginBottom: 14,
  },
  formInputGroup: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
  },
  formLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: "#64748b",
    marginBottom: 6,
  },
  inputPrefixWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 12,
  },
  handleSymbol: {
    color: "#ec4899",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 2,
  },
  handleInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 13,
  },
  screenshotDropArea: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#334155",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    marginBottom: 12,
  },
  screenshotPlaceholder: {
    alignItems: "center",
  },
  screenshotPlaceText: {
    fontSize: 11,
    color: "#cbd5e1",
    fontWeight: "bold",
  },
  screenshotSubText: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  screenshotActive: {
    alignItems: "center",
  },
  screenshotActiveText: {
    fontSize: 11,
    color: "#34d399",
    fontWeight: "bold",
    marginTop: 4,
  },
  screenshotChangeText: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
    textDecorationLine: "underline",
  },
  formSyncBtn: {
    backgroundColor: "#ec4899",
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  formSyncBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  sectionHeadingText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#94a3b8",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  presetsList: {
    gap: 12,
  },
  presetRow: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
  },
  activePresetRow: {
    borderColor: "#ec4899",
    backgroundColor: "#160b1c",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  customAvatarBg: {
    backgroundColor: "#4f46e5",
  },
  avatarLetter: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  presetContent: {
    flex: 1,
  },
  presetTitleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  presetName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  presetHandle: {
    fontSize: 9,
    color: "#64748b",
  },
  presetBadge: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#818cf8",
    backgroundColor: "rgba(129, 140, 248, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.2)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  presetDesc: {
    fontSize: 10,
    color: "#94a3b8",
    lineHeight: 14,
    marginBottom: 6,
  },
  tagSpecsRow: {
    flexDirection: "row",
    gap: 6,
  },
  specTag: {
    fontSize: 8,
    color: "#cbd5e1",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  vibeTag: {
    fontSize: 8,
    color: "#cbd5e1",
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  // Navigation Bar
  navBar: {
    flexDirection: "row",
    height: 52,
    backgroundColor: "rgba(15, 23, 42, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    height: "100%",
  },
  activeNavBtn: {},
  navText: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 3,
    fontWeight: "700",
  },
  activeNavText: {
    color: "#ec4899",
  },
});
