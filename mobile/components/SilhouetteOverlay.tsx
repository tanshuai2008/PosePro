import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Line, Text as SvgText } from "react-native-svg";

interface SilhouetteOverlayProps {
  type: string; // e.g., 'standing_back_turn', 'casual_mid_walk', 'flowing_dress', 'chic_lean', 'vintage_lean', 'sitting_cafe', 'cute_wink'
  opacity: number;
}

export default function SilhouetteOverlay({ type, opacity }: SilhouetteOverlayProps) {
  // SVG silhouette with retro/cyber holographic guide look ported to react-native-svg
  const getSilhouetteContent = () => {
    switch (type) {
      case "standing_back_turn":
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            {/* Outline of a girl facing backwards looking up slightly to left, with hands behind her back or side */}
            <Path stroke="#f472b6" strokeWidth={2.5} fill="none" strokeDasharray="4 4" d="M200,120 C185,120 180,100 200,100 C220,100 215,120 200,120 Z" />
            <Path stroke="#f472b6" strokeWidth={2.5} fill="none" d="M185,108 C175,125 180,160 195,165 M215,108 C225,125 220,160 205,165" />
            <Path fill="#f472b6" fillOpacity={0.15} stroke="#f472b6" strokeWidth={2.5} d="M180,100 C180,85 220,85 220,100 C220,105 180,105 180,100 Z" />
            <Line x1={200} y1={85} x2={202} y2={78} stroke="#f472b6" strokeWidth={2.5} />
            
            <Path stroke="#f472b6" strokeWidth={2.5} fill="none" d="M160,175 C180,165 220,165 240,175" />
            <Line x1={175} y1={172} x2={175} y2={190} stroke="#f472b6" strokeWidth={2.5} />
            <Line x1={225} y1={172} x2={225} y2={190} stroke="#f472b6" strokeWidth={2.5} />
            
            <Path stroke="#f472b6" strokeWidth={2.5} fill="none" d="M170,175 C175,220 180,250 185,280" />
            <Path stroke="#f472b6" strokeWidth={2.5} fill="none" d="M230,175 C225,220 220,250 215,280" />
            
            <Path fill="#f472b6" fillOpacity={0.05} stroke="#f472b6" strokeWidth={2.5} d="M185,280 C170,330 140,400 120,480 C110,510 130,520 200,520 C270,520 290,510 280,480 C260,400 230,330 215,280 Z" />
            <Path stroke="#f472b6" strokeWidth={1.5} fill="none" d="M175,320 C165,380 155,440 145,500" />
            <Path stroke="#f472b6" strokeWidth={1} fill="none" d="M200,290 C200,360 200,430 200,515" />
            <Path stroke="#f472b6" strokeWidth={1.5} fill="none" d="M225,320 C235,380 245,440 255,500" />
            
            <Path fill="#f472b6" d="M185,520 L180,540 L190,543 Z" />
            <Path fill="#f472b6" d="M215,520 L210,540 L220,543 Z" />

            <Circle cx={200} cy={110} r={14} fill="none" stroke="#ec4899" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={218} y={114} fill="#f472b6" fontSize={10} fontFamily="monospace">HEAD SYNC</SvgText>
            <Line x1={100} y1={280} x2={300} y2={280} stroke="rgba(236, 72, 153, 0.5)" strokeWidth={1} strokeDasharray="5 5" />
            <SvgText x={120} y={275} fill="#f472b6" fontSize={9} fontFamily="monospace">WAIST LINE (1/2)</SvgText>
          </Svg>
        );
      case "casual_mid_walk":
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            <Circle cx={185} cy={120} r={18} fill="#22d3ee" fillOpacity={0.08} stroke="#22d3ee" strokeWidth={2.5} />
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M175,130 Q185,132 195,124" />
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M145,160 C165,152 205,152 225,160" />
            <Path stroke="#22d3ee" strokeWidth={2} fill="none" strokeDasharray="4 2" d="M150,160 Q185,190 215,210" />
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M145,160 C135,185 130,220 145,240 C150,230 155,210 160,185" />
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M225,160 C235,190 230,225 220,245" />
            
            <Path fill="#22d3ee" fillOpacity={0.1} stroke="#22d3ee" strokeWidth={2.5} d="M160,185 C165,220 160,260 150,310 L220,310 C210,260 205,220 210,185 Z" />
            
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M165,310 C165,370 160,430 158,510" />
            <Path fill="#22d3ee" d="M158,510 L145,525 L165,528 Z" />
            <Path stroke="#22d3ee" strokeWidth={2.5} fill="none" d="M200,310 C215,360 230,420 242,490" />
            <Path fill="#22d3ee" d="M242,490 L255,502 L245,506 Z" />

            <Circle cx={185} cy={120} r={6} fill="#22d3ee" />
            <Line x1={185} y1={50} x2={185} y2={450} stroke="rgba(6, 182, 212, 0.5)" strokeWidth={1} strokeDasharray="3 3" />
            <SvgText x={200} y={124} fill="#22d3ee" fontSize={10} fontFamily="monospace">DYN FOCUS</SvgText>
          </Svg>
        );
      case "flowing_dress":
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            <Circle cx={160} cy={150} r={16} fill="#2dd4bf" fillOpacity={0.1} stroke="#2dd4bf" strokeWidth={2.5} />
            <Path stroke="#2dd4bf" strokeWidth={1.5} fill="none" d="M144,144 C110,140 100,170 120,195 M160,166 C155,185 150,210 152,225" />
            
            <Line x1={125} y1={40} x2={125} y2={245} stroke="rgba(45, 212, 191, 0.4)" strokeWidth={1} />
            <Line x1={225} y1={40} x2={225} y2={245} stroke="rgba(45, 212, 191, 0.4)" strokeWidth={1} />
            
            <Path stroke="#2dd4bf" strokeWidth={2.5} fill="none" d="M152,180 C182,185 195,190 212,205" />
            <Path stroke="#2dd4bf" strokeWidth={2.5} fill="none" d="M140,178 Q125,180 125,200" />
            <Path stroke="#2dd4bf" strokeWidth={2.5} fill="none" d="M190,190 Q225,190 225,210" />
            
            <Line x1={110} y1={245} x2={240} y2={245} stroke="#2dd4bf" strokeWidth={5} strokeLinecap="round" />
            
            <Path fill="#2dd4bf" fillOpacity={0.15} stroke="#2dd4bf" strokeWidth={2.5} d="M125,245 C90,290 50,370 30,440 C50,455 120,440 150,420 C180,390 210,310 215,245 Z" />
            <Path stroke="#2dd4bf" strokeWidth={1} fill="none" d="M120,245 C105,300 85,360 65,425" />
            <Path stroke="#2dd4bf" strokeWidth={1.2} fill="none" d="M165,245 C155,310 145,370 135,420" />

            <Path stroke="#2dd4bf" strokeWidth={2.5} fill="none" d="M185,245 C215,290 245,310 270,305" />
            <Line x1={270} y1={305} x2={285} y2={295} stroke="#2dd4bf" strokeWidth={3} />
            <Path stroke="#2dd4bf" strokeWidth={2.5} fill="none" d="M195,245 C220,295 235,315 258,320" />
            <Line x1={258} y1={320} x2={273} y2={313} stroke="#2dd4bf" strokeWidth={3} />

            <Circle cx={160} cy={150} r={14} fill="none" stroke="#14b8a6" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={180} y={154} fill="#2dd4bf" fontSize={10} fontFamily="monospace">SUNSET SWING</SvgText>
          </Svg>
        );
      case "chic_lean":
      case "vintage_lean":
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            <Line x1={280} y1={50} x2={280} y2={550} stroke="rgba(129, 204, 248, 0.4)" strokeWidth={1} strokeDasharray="5 5" />
            <SvgText x={290} y={80} fill="#818cf8" fontSize={8} fontFamily="monospace">WALL SUPPORT</SvgText>

            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M220,110 C210,110 200,98 215,85 C230,72 235,90 230,105" />
            <Path fill="#818cf8" d="M208,92 L216,92 L215,96 L207,96 Z" />
            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M245,130 C205,135 180,150 178,180" />
            <Line x1={245} y1={130} x2={270} y2={165} stroke="#818cf8" strokeWidth={2.5} />
            <Path stroke="#818cf8" strokeWidth={2} fill="none" d="M178,180 C182,150 202,125 210,108" />
            
            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M240,132 C230,200 248,250 252,300" />
            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M185,150 C185,200 190,250 192,300" />
            
            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M192,300 C195,370 215,440 235,510" />
            <Path fill="#818cf8" d="M235,510 L242,518 L228,520 Z" />
            <Path stroke="#818cf8" strokeWidth={2.5} fill="none" d="M252,300 C242,370 232,440 215,510" />
            <Path fill="#818cf8" d="M215,510 L220,522 L208,521 Z" />

            <Circle cx={215} cy={85} r={14} fill="none" stroke="#6366f1" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={140} y={88} fill="#818cf8" fontSize={10} fontFamily="monospace">EYE LEVEL FOCUS (2/3)</SvgText>
          </Svg>
        );
      case "sitting_cafe":
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            <Line x1={80} y1={360} x2={320} y2={360} stroke="rgba(251, 191, 36, 0.5)" strokeWidth={3} />
            <SvgText x={250} y={380} fill="#fbbf24" fontSize={10} fontFamily="monospace">CAFE TABLE</SvgText>

            <Path fill="#fbbf24" fillOpacity={0.2} stroke="#fbbf24" strokeWidth={2.5} d="M185,340 C185,360 215,360 215,340 Z" />
            <Path stroke="#fbbf24" strokeWidth={2.5} fill="none" d="M215,345 Q222,348 215,352" />
            
            <Circle cx={170} cy={180} r={22} fill="#fbbf24" fillOpacity={0.1} stroke="#fbbf24" strokeWidth={2.5} />
            <Path stroke="#fbbf24" strokeWidth={2.5} fill="none" d="M170,202 L170,260 L200,340 M200,340 L160,340" />
            
            <Path stroke="#fbbf24" strokeWidth={2.5} fill="none" d="M140,240 C120,300 110,360 110,480" />
            <Path stroke="#fbbf24" strokeWidth={2.5} fill="none" d="M190,240 C195,290 190,360 185,480" />
            
            <Circle cx={170} cy={180} r={30} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={210} y={185} fill="#fbbf24" fontSize={10} fontFamily="monospace">CHIN CHIC PORTRAIT</SvgText>
          </Svg>
        );
      case "cute_wink":
      default:
        return (
          <Svg viewBox="0 0 400 600" width="100%" height="100%">
            <Circle cx={200} cy={180} r={35} fill="#fb7185" fillOpacity={0.1} stroke="#fb7185" strokeWidth={2.5} />
            <Path stroke="#fb7185" strokeWidth={1.8} fill="none" d="M162,170 C155,200 162,250 170,270 M238,170 C245,200 238,250 230,270" />
            <Path fill="#fb7185" fillOpacity={0.2} stroke="#fb7185" strokeWidth={2.5} d="M185,255 C180,245 195,240 200,248 C205,240 220,245 215,255 L200,268 Z" />
            
            <Path stroke="#fb7185" strokeWidth={2.5} fill="none" d="M130,290 C155,280 180,285 200,285 C220,285 245,280 270,290" />
            <Line x1={130} y1={290} x2={120} y2={450} stroke="#fb7185" strokeWidth={2.5} />
            <Line x1={270} y1={290} x2={280} y2={450} stroke="#fb7185" strokeWidth={2.5} />

            <Circle cx={200} cy={180} r={45} fill="none" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={200} y={125} textAnchor="middle" fill="#fb7185" fontSize={11} fontFamily="monospace">SWEET CANDID</SvgText>
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      <View style={styles.svgWrapper}>
        {getSilhouetteContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  svgWrapper: {
    width: "100%",
    height: "80%",
    maxWidth: 400,
  },
});
