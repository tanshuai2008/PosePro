import React from "react";

interface SilhouetteOverlayProps {
  type: string; // e.g., 'standing_back_turn', 'casual_mid_walk', 'flowing_dress', 'chic_lean', 'vintage_lean', 'sitting_cafe', 'cute_wink'
  opacity: number;
}

export default function SilhouetteOverlay({ type, opacity }: SilhouetteOverlayProps) {
  // SVG silhouette with retro/cyber holographic guide look
  const getSilhouetteContent = () => {
    switch (type) {
      case "standing_back_turn":
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-pink-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Outline of a girl facing backwards looking up slightly to left, with hands behind her back or side */}
            {/* Head and back of neck */}
            <path strokeDasharray="4 4" d="M200,120 C185,120 180,100 200,100 C220,100 215,120 200,120 Z" />
            {/* Hair outline flow */}
            <path d="M185,108 C175,125 180,160 195,165 M215,108 C225,125 220,160 205,165" />
            {/* French hat/beret on top */}
            <path fill="currentColor" fillOpacity="0.15" d="M180,100 C180,85 220,85 220,100 C220,105 180,105 180,100 Z" />
            <path d="M200,85 L202,78" />
            
            {/* Shoulders and chic strap dress */}
            <path d="M160,175 C180,165 220,165 240,175" />
            <path d="M175,172 L175,190 M225,172 L225,190" />
            
            {/* Back outline down to waist */}
            <path d="M170,175 C175,220 180,250 185,280" />
            <path d="M230,175 C225,220 220,250 215,280" />
            
            {/* Hips and Flowing long dress outline */}
            <path fill="currentColor" fillOpacity="0.05" d="M185,280 C170,330 140,400 120,480 C110,510 130,520 200,520 C270,520 290,510 280,480 C260,400 230,330 215,280 Z" />
            {/* Dress folds lines */}
            <path d="M175,320 C165,380 155,440 145,500" strokeWidth="1.5" />
            <path d="M200,290 C200,360 200,430 200,515" strokeWidth="1" />
            <path d="M225,320 C235,380 245,440 255,500" strokeWidth="1.5" />
            
            {/* Lower legs / shoes peek */}
            <path d="M185,520 L180,540 L190,543 Z" fill="currentColor" />
            <path d="M215,520 L210,540 L220,543 Z" fill="currentColor" />

            {/* Target Crosshairs for Alignment */}
            <circle cx="200" cy="110" r="14" strokeDasharray="3 3" className="stroke-pink-500" />
            <text x="218" y="114" className="text-[10px] font-mono fill-pink-400" stroke="none">HEAD SYNC</text>
            <path d="M100,280 L300,280" strokeDasharray="5 5" strokeWidth="1" className="stroke-pink-500/50" />
            <text x="120" y="275" className="text-[9px] font-mono fill-pink-400" stroke="none">WAIST LINE (1/2)</text>
          </svg>
        );
      case "casual_mid_walk":
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Candid walking shot outline */}
            {/* Head looking slightly down to right */}
            <circle cx="185" cy="120" r="18" fill="currentColor" fillOpacity="0.08" />
            {/* Smiling mouth/chin curve */}
            <path d="M175,130 Q185,132 195,124" />
            {/* Shoulder and strap bag */}
            <path d="M145,160 C165,152 205,152 225,160" />
            {/* Sling bag strap across chest */}
            <path d="M150,160 Q185,190 215,210" strokeWidth="2" strokeDasharray="4 2" />
            {/* Left and right arms */}
            <path d="M145,160 C135,185 130,220 145,240 C150,230 155,210 160,185" />
            <path d="M225,160 C235,190 230,225 220,245" />
            
            {/* Body of fitted coat/top */}
            <path fill="currentColor" fillOpacity="0.1" d="M160,185 C165,220 160,260 150,310 L220,310 C210,260 205,220 210,185 Z" />
            
            {/* Straight leg and walking forward leg */}
            {/* Leg A: standing weight line */}
            <path d="M165,310 C165,370 160,430 158,510" />
            <path d="M158,510 L145,525 L165,528 Z" fill="currentColor" />
            {/* Leg B: moving forward foot */}
            <path d="M200,310 C215,360 230,420 242,490" />
            <path d="M242,490 L255,502 L245,506 Z" fill="currentColor" />

            {/* Rule of Thirds Intersection points */}
            <circle cx="185" cy="120" r="6" className="fill-cyan-400" stroke="none" />
            <line x1="185" y1="50" x2="185" y2="450" strokeDasharray="3 3" strokeWidth="1" className="stroke-cyan-500/50" />
            <text x="200" y="124" className="text-[10px] font-mono fill-cyan-400" stroke="none">DYN FOCUS</text>
          </svg>
        );
      case "flowing_dress":
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-teal-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Seated on swing, legs slightly kicked forward, flowing dress fluttering downwards */}
            {/* Back angle head with hair wind blowing block */}
            <circle cx="160" cy="150" r="16" fill="currentColor" fillOpacity="0.1" />
            <path d="M144,144 C110,140 100,170 120,195 M160,166 C155,185 150,210 152,225" strokeWidth="1.5" />
            
            {/* Swing rope lines */}
            <line x1="125" y1="40" x2="125" y2="245" strokeWidth="1" className="stroke-teal-400/40" />
            <line x1="225" y1="40" x2="225" y2="245" strokeWidth="1" className="stroke-teal-400/40" />
            
            {/* Torso tilted back */}
            <path d="M152,180 C182,185 195,190 212,205" />
            {/* Hands grabbing rope */}
            <path d="M140,178 Q125,180 125,200" />
            <path d="M190,190 Q225,190 225,210" />
            
            {/* Seated cushion board */}
            <path d="M110,245 L240,245" strokeWidth="5" strokeLinecap="round" />
            
            {/* Giant Fluttering Dress Outline */}
            <path fill="currentColor" fillOpacity="0.15" d="M125,245 C90,290 50,370 30,440 C50,455 120,440 150,420 C180,390 210,310 215,245 Z" />
            <path d="M120,245 C105,300 85,360 65,425" strokeWidth="1" />
            <path d="M165,245 C155,310 145,370 135,420" strokeWidth="1.2" />

            {/* Feet kicked high in positive energy pose */}
            <path d="M185,245 C215,290 245,310 270,305" />
            <path d="M270,305 L285,295" strokeWidth="3" />
            <path d="M195,245 C220,295 235,315 258,320" />
            <path d="M258,320 L273,313" strokeWidth="3" />

            <circle cx="160" cy="150" r="14" strokeDasharray="3 3" className="stroke-teal-500" />
            <text x="180" y="154" className="text-[10px] font-mono fill-teal-400" stroke="none">SUNSET SWING</text>
          </svg>
        );
      case "chic_lean":
      case "vintage_lean":
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Profile outfit modeling pose - leaning against a wall structure on right */}
            {/* Lean Wall Line */}
            <line x1="280" y1="50" x2="280" y2="550" strokeWidth="1" strokeDasharray="5 5" className="stroke-indigo-400/40" />
            <text x="290" y="80" className="text-[8px] font-mono fill-indigo-400" stroke="none">WALL SUPPORT</text>

            {/* Elegant neck and face from side */}
            <path d="M220,110 C210,110 200,98 215,85 C230,72 235,90 230,105" />
            {/* sunglasses */}
            <path fill="currentColor" d="M208,92 L216,92 L215,96 L207,96 Z" />
            {/* Shoulder and body angled */}
            <path d="M245,130 C205,135 180,150 178,180" />
            {/* Arm A: Leaning back on wall */}
            <path d="M245,130 L270,165" />
            {/* Arm B: Tucking hair or sunglasses pocket */}
            <path d="M178,180 C182,150 202,125 210,108" strokeWidth="2" />
            
            {/* Torso hip displacement (S curve posing) */}
            <path d="M240,132 C230,200 248,250 252,300" />
            <path d="M185,150 C185,200 190,250 192,300" />
            
            {/* Long legs with crossing detail */}
            {/* Legs A crossing over back leg */}
            <path d="M192,300 C195,370 215,440 235,510" />
            <path d="M235,510 L242,518 L228,520 Z" fill="currentColor" />
            {/* Leg B matching supporting stance */}
            <path d="M252,300 C242,370 232,440 215,510" />
            <path d="M215,510 L220,522 L208,521 Z" fill="currentColor" />

            <circle cx="215" cy="85" r="14" strokeDasharray="3 3" className="stroke-indigo-500" />
            <text x="140" y="88" className="text-[10px] font-mono fill-indigo-400" stroke="none">EYE LEVEL FOCUS (2/3)</text>
          </svg>
        );
      case "sitting_cafe":
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Table bottom line */}
            <line x1="80" y1="360" x2="320" y2="360" strokeWidth="3" className="stroke-amber-400/50" />
            <text x="250" y="380" className="text-[10px] font-mono fill-amber-400" stroke="none">CAFE TABLE</text>

            {/* Coffee cup */}
            <path d="M185,340 C185,360 215,360 215,340 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M215,345 Q222,348 215,352" />
            
            {/* Head resting on hand */}
            <circle cx="170" cy="180" r="22" fill="currentColor" fillOpacity="0.1" />
            {/* Arm support */}
            <path d="M170,202 L170,260 L200,340 M200,340 L160,340" />
            
            {/* Torso slightly bent over table */}
            <path d="M140,240 C120,300 110,360 110,480" />
            <path d="M190,240 C195,290 190,360 185,480" />
            
            <circle cx="170" cy="180" r="30" strokeDasharray="3 3" className="stroke-amber-500" />
            <text x="210" y="185" className="text-[10px] font-mono fill-amber-400" stroke="none">CHIN CHIC PORTRAIT</text>
          </svg>
        );
      case "cute_wink":
      default:
        return (
          <svg viewBox="0 0 400 600" className="w-full h-full text-rose-400" fill="none" stroke="currentColor" strokeWidth="2.5">
            {/* Frame centering head and shoulders with cute heart hands pose */}
            {/* Head and gorgeous hair outline */}
            <circle cx="200" cy="180" r="35" fill="currentColor" fillOpacity="0.1" />
            {/* Soft hair strands framing cheeks */}
            <path d="M162,170 C155,200 162,250 170,270 M238,170 C245,200 238,250 230,270" strokeWidth="1.8" />
            {/* Heart symbol hands shape in front of chin */}
            <path fill="currentColor" fillOpacity="0.2" d="M185,255 C180,245 195,240 200,248 C205,240 220,245 215,255 L200,268 Z" />
            
            {/* Shoulder outline */}
            <path d="M130,290 C155,280 180,285 200,285 C220,285 245,280 270,290" />
            <path d="M130,290 L120,450" />
            <path d="M270,290 L280,450" />

            <circle cx="200" cy="180" r="45" strokeDasharray="3 3" className="stroke-rose-500" />
            <text x="200" y="125" textAnchor="middle" className="text-[11px] font-mono fill-rose-400" stroke="none">SWEET CANDID</text>
          </svg>
        );
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none flex items-center justify-center transition-opacity duration-300"
      style={{ opacity }}
    >
      <div className="w-full h-full max-w-sm max-h-[80%] opacity-80 animate-pulse-slow">
        {getSilhouetteContent()}
      </div>
    </div>
  );
}
