import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AestheticProfile, MockPhoto } from "../types";
import { MOCK_USER_PHOTOS } from "../data";
import {
  Heart,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  CheckCircle,
  Smartphone,
} from "lucide-react-native";

interface PreferenceDashboardProps {
  profile: AestheticProfile;
  onUpdateProfile: (newProfile: AestheticProfile) => void;
  serverIp: string;
  onChangeServerIp: (ip: string) => void;
}

export default function PreferenceDashboard({
  profile,
  onUpdateProfile,
  serverIp,
  onChangeServerIp,
}: PreferenceDashboardProps) {
  const [photos, setPhotos] = useState<MockPhoto[]>(
    MOCK_USER_PHOTOS.map((p) => ({ ...p, status: "undecided" }))
  );
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleAction = (id: string, action: "keep" | "delete") => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
    if (activePhotoIndex < photos.length - 1) {
      setActivePhotoIndex((prev) => prev + 1);
    } else {
      // Trigger all graded state
      setActivePhotoIndex(photos.length);
    }
  };

  const currentPhoto = activePhotoIndex < photos.length ? photos[activePhotoIndex] : null;

  const resetQueue = () => {
    setPhotos(MOCK_USER_PHOTOS.map((p) => ({ ...p, status: "undecided" })));
    setActivePhotoIndex(0);
    setSuccessMsg("");
  };

  const triggerAISync = async () => {
    setLoading(true);
    setSuccessMsg("");
    let kept: any[] = [];
    let deleted: any[] = [];
    try {
      kept = photos
        .filter((p) => p.status === "keep")
        .map((p) => ({ label: p.label, details: p.analysis }));
      deleted = photos
        .filter((p) => p.status === "delete")
        .map((p) => ({ label: p.label, details: p.analysis }));

      if (kept.length === 0 && deleted.length === 0) {
        const defaults: AestheticProfile = {
          lastUpdated: new Date().toISOString(),
          likesScale: "Balanced 50% Portrait / 50% General Scenery",
          tonePreference: "Natural and Bright Atmospheric",
          compositionPreference: "Centered Grid alignment & Rule of Thirds",
          strengths: ["Clean subject focus", "Decent eye-level balance"],
          boyfriendMistakesToAvoid: [
            "Ensure you don't crop feet/ankles!",
            "Watch out for tilted horizons!",
          ],
          personalizedPromptTip:
            "Keep alignment grid on. Squat down for outfit shots; take closeup portraits with 2x zoom to prevent nose compression.",
        };
        onUpdateProfile(defaults);
        setSuccessMsg("Initialized with default profile. Try swiping!");
        setLoading(false);
        return;
      }

      const backendUrl = `http://${serverIp.trim()}:3000/api/learn-preferences`;
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keptPhotos: kept, deletedPhotos: deleted }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact preference-learning model.");
      }

      const data = await response.json();
      onUpdateProfile(data);
      setSuccessMsg("Taste Sync complete! Personalizations activated.");
    } catch (err: any) {
      console.log("Taste Sync error:", err);
      // Fallback local sync if server is not accessible or offline
      const mockSyncedProfile: AestheticProfile = {
        lastUpdated: new Date().toISOString(),
        likesScale: kept.length > deleted.length ? "Close-up Portrait Focus" : "Scenic Wide Landscapes",
        tonePreference: "Warm Nostalgic Retro Film Colors",
        compositionPreference: "Rule of Thirds Alignment Offset",
        strengths: ["Great color composition choices", "High-contrast dynamic outlines"],
        boyfriendMistakesToAvoid: [
          "Do not tilt the camera up from too close",
          "Avoid center-cropping feet boundaries",
        ],
        personalizedPromptTip:
          "Sync simulated: Recommended to maintain a stable horizontal balance grid. Keep camera parallel to chin height.",
      };
      onUpdateProfile(mockSyncedProfile);
      setSuccessMsg("Taste Offline-Sync Complete! Mock profile active.");
    } finally {
      setLoading(false);
    }
  };

  const keepsCount = photos.filter((p) => p.status === "keep").length;
  const deletesCount = photos.filter((p) => p.status === "delete").length;
  const totalReviewed = photos.filter((p) => p.status !== "undecided").length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Title block */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Heart size={20} color="#ec4899" fill="#ec4899" />
          <Text style={styles.headerTitle}>Taste Learner (女友喜好学习)</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Analyze photograph votes to customize dynamic recommendations.
        </Text>
      </View>

      {/* Network Setup Box */}
      <View style={styles.networkCard}>
        <View style={styles.networkHeader}>
          <Smartphone size={16} color="#22d3ee" />
          <Text style={styles.networkTitle}>Expo Go Connect helper</Text>
        </View>
        <Text style={styles.networkDesc}>
          Enter your computer's local IP address (e.g. 192.168.1.100) to connect with the backend service.
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputPrefix}>http://</Text>
          <TextInput
            style={styles.input}
            value={serverIp}
            onChangeText={onChangeServerIp}
            placeholder="192.168.X.X"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
          />
          <Text style={styles.inputSuffix}>:3000</Text>
        </View>
      </View>

      {/* Left panel: Swiper Simulator */}
      <View style={styles.cardSwiper}>
        {activePhotoIndex >= photos.length ? (
          <View style={styles.gradedContainer}>
            <View style={styles.checkedCircle}>
              <CheckCircle size={32} color="#ec4899" />
            </View>
            <Text style={styles.gradedTitle}>All Photos Graded!</Text>
            <Text style={styles.gradedSubtitle}>
              Ready to compute her dynamic style preference profile? Let Gemini build her personal taste guide.
            </Text>
            <View style={styles.gradedActions}>
              <TouchableOpacity style={styles.resetButton} onPress={resetQueue}>
                <Text style={styles.resetButtonText}>Reset Queue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.syncButton} onPress={triggerAISync} disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 6 }} />
                ) : (
                  <Sparkles size={14} color="#ffffff" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.syncButtonText}>Analyze Taste</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          currentPhoto && (
            <View style={styles.activePhotoFrame}>
              <View style={styles.frameHeader}>
                <View style={styles.photoCountBadge}>
                  <Text style={styles.photoCountText}>
                    Photo {activePhotoIndex + 1} of {photos.length}
                  </Text>
                </View>
                <Text style={styles.tagText}>Interactive training roll</Text>
              </View>

              {/* Photo Image */}
              <View style={styles.imageWrapper}>
                <Image source={{ uri: currentPhoto.url }} style={styles.photoImage} resizeMode="cover" />
                <View style={styles.photoLabelContainer}>
                  <Text style={styles.photoLabelText}>{currentPhoto.label}</Text>
                </View>
              </View>

              {/* Cam spec details */}
              <View style={styles.specBox}>
                <Text style={styles.specTitle}>CAMERA SPECS:</Text>
                <Text style={styles.specContent} numberOfLines={3}>
                  {currentPhoto.analysis?.composition}
                </Text>
              </View>

              {/* Control Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleAction(currentPhoto.id, "delete")}
                >
                  <Trash2 size={16} color="#ef4444" />
                  <Text style={[styles.actionBtnText, styles.deleteBtnText]}>She Deleted 🗑️</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.keepButton]}
                  onPress={() => handleAction(currentPhoto.id, "keep")}
                >
                  <Heart size={16} color="#ec4899" fill="#ec4899" />
                  <Text style={[styles.actionBtnText, styles.keepBtnText]}>She Kept 😍</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        )}
      </View>

      {/* Stats Board */}
      <View style={styles.statsBoard}>
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Kept (Keep)</Text>
          <Text style={[styles.statValue, styles.pinkText]}>{keepsCount}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Deleted (Trash)</Text>
          <Text style={[styles.statValue, styles.redText]}>{deletesCount}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Status</Text>
          <Text style={styles.statStatus}>
            {totalReviewed === photos.length ? "Done Sync-Ready" : `${totalReviewed}/4 Rated`}
          </Text>
        </View>
      </View>

      {successMsg ? (
        <View style={styles.alertSuccess}>
          <Text style={styles.alertSuccessText}>{successMsg}</Text>
        </View>
      ) : null}

      {/* Dynamic Preference Blueprint */}
      <View style={styles.blueprintCard}>
        <View style={styles.blueprintHeader}>
          <Sparkles size={16} color="#a78bfa" />
          <Text style={styles.blueprintTitle}>Dynamic Preference Blueprint</Text>
        </View>

        <View style={styles.blueprintItem}>
          <Text style={styles.blueprintLabel}>PARTNER DESIRED FRAMING SCALE</Text>
          <Text style={styles.blueprintValue}>{profile.likesScale || "Balanced Portrait Coverage"}</Text>
        </View>

        <View style={styles.blueprintItem}>
          <Text style={styles.blueprintLabel}>AESTHETIC & COLOR TONE</Text>
          <Text style={styles.blueprintValue}>{profile.tonePreference || "Natural diffuse lighting"}</Text>
        </View>

        <View style={styles.blueprintItem}>
          <Text style={styles.blueprintLabel}>COMPOSITION BALANCE RULE</Text>
          <Text style={styles.blueprintValue}>
            {profile.compositionPreference || "Balanced symmetry rule-of-thirds matching"}
          </Text>
        </View>

        {/* Mistakes warnings */}
        <View style={styles.mistakesCard}>
          <View style={styles.mistakesHeader}>
            <AlertTriangle size={15} color="#f87171" style={{ marginRight: 6 }} />
            <Text style={styles.mistakesTitle}>MISTAKES SHE HATES MOST:</Text>
          </View>
          {profile.boyfriendMistakesToAvoid && profile.boyfriendMistakesToAvoid.length > 0 ? (
            profile.boyfriendMistakesToAvoid.map((m, idx) => (
              <View key={idx} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{m}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMistakes}>
              No historical delete reviews yet. Keep grading to uncover her photography pet peeves!
            </Text>
          )}
        </View>

        {/* AI overlay hint */}
        <View style={styles.adviceCard}>
          <Text style={styles.adviceLabel}>AI SMART ADVICE OVERLAY:</Text>
          <Text style={styles.adviceText}>
            {profile.personalizedPromptTip ||
              "Sync the photo-session history to formulate an automated real-time coach overlay prescription."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 16,
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 16,
  },
  networkCard: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  networkHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  networkTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#22d3ee",
    marginLeft: 6,
  },
  networkDesc: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 10,
    lineHeight: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  inputPrefix: {
    color: "#64748b",
    fontSize: 13,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
    marginHorizontal: 2,
  },
  inputSuffix: {
    color: "#64748b",
    fontSize: 13,
  },
  cardSwiper: {
    backgroundColor: "#0b0f19",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    height: 380,
    justifyContent: "space-between",
    position: "relative",
    marginBottom: 16,
  },
  gradedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  checkedCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  gradedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  gradedSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  gradedActions: {
    flexDirection: "row",
    gap: 12,
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  resetButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  syncButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#ec4899",
    flexDirection: "row",
    alignItems: "center",
  },
  syncButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  activePhotoFrame: {
    flex: 1,
    justifyContent: "space-between",
  },
  frameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  photoCountBadge: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  photoCountText: {
    fontSize: 10,
    color: "#e2e8f0",
    fontFamily: "System",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#ec4899",
    letterSpacing: 0.5,
  },
  imageWrapper: {
    height: 180,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1e293b",
    backgroundColor: "#0f172a",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoLabelContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  photoLabelText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
  specBox: {
    marginTop: 10,
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.8)",
    padding: 10,
    borderRadius: 8,
  },
  specTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#fb923c",
    marginBottom: 2,
  },
  specContent: {
    fontSize: 11,
    color: "#94a3b8",
    lineHeight: 15,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#0f172a",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  deleteButton: {
    backgroundColor: "rgba(127, 29, 29, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(127, 29, 29, 0.5)",
  },
  deleteBtnText: {
    color: "#f87171",
  },
  keepButton: {
    backgroundColor: "rgba(157, 23, 77, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(157, 23, 77, 0.5)",
  },
  keepBtnText: {
    color: "#f472b6",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  statsBoard: {
    flexDirection: "row",
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statColumn: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  statStatus: {
    fontSize: 11,
    fontWeight: "600",
    color: "#cbd5e1",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#1e293b",
  },
  pinkText: {
    color: "#ec4899",
  },
  redText: {
    color: "#f87171",
  },
  alertSuccess: {
    backgroundColor: "rgba(6, 78, 59, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(6, 78, 59, 0.5)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignItems: "center",
  },
  alertSuccessText: {
    color: "#34d399",
    fontSize: 12,
    fontWeight: "600",
  },
  blueprintCard: {
    backgroundColor: "#090d16",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
  },
  blueprintHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  blueprintTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 8,
  },
  blueprintItem: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  blueprintLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  blueprintValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ec4899",
    marginTop: 4,
  },
  mistakesCard: {
    backgroundColor: "rgba(127, 29, 29, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(127, 29, 29, 0.2)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  mistakesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  mistakesTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#f87171",
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    color: "#f87171",
    fontSize: 12,
    marginRight: 6,
    marginTop: -2,
  },
  bulletText: {
    fontSize: 11,
    color: "#cbd5e1",
    flex: 1,
    lineHeight: 14,
  },
  emptyMistakes: {
    fontSize: 11,
    color: "#64748b",
    fontStyle: "italic",
  },
  adviceCard: {
    backgroundColor: "rgba(109, 40, 217, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(109, 40, 217, 0.2)",
    borderRadius: 10,
    padding: 12,
  },
  adviceLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#a78bfa",
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 11,
    color: "#e2e8f0",
    lineHeight: 15,
  },
});
