/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

// Svg Coat of Arms of Iraq (High-Fidelity representation of Eagle of Saladin with national flag shield)
export const IraqCoatOfArms: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      id="iraq-coat-of-arms-svg"
    >
      {/* Saladin Eagle Wings Behind Shield */}
      <path 
        d="M256 120 L270 40 L285 120 L300 80 L315 150 L340 120 L350 200 L370 170 L380 260 L410 220 L400 370 L425 430 L380 430 L350 390 L340 440 L310 440 L300 395 L270 445 L256 360 L242 445 L212 395 L202 440 L172 440 L162 390 L132 430 L87 430 L112 370 L102 220 L132 260 L142 170 L162 200 L172 120 L197 150 L212 80 L227 120 Z" 
        fill="#b38f00" 
        stroke="#4a3e00" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Dark Feathers Detail */}
      <path 
        d="M256 150 L280 200 M256 150 L232 200 M256 170 M300 220 L315 300 M212 220 L197 300 M340 250 L350 340 M172 250 L162 340" 
        stroke="#272100" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      
      {/* Head of the Eagle */}
      <path 
        d="M236 70 C236 40, 276 40, 276 70 C276 80, 266 90, 256 100 C246 90, 236 80, 236 70 Z" 
        fill="#b38f00" 
        stroke="#4a3e00" 
        strokeWidth="3" 
      />
      
      {/* Beak */}
      <path 
        d="M256 45 C256 35, 246 45, 242 48 C238 51, 242 55, 248 53 Z" 
        fill="#fff200" 
        stroke="#272100" 
        strokeWidth="2" 
      />
      
      {/* Crown / Eye Details */}
      <circle cx="248" cy="62" r="3" fill="#000" />
      <circle cx="264" cy="62" r="3" fill="#000" />
      
      {/* Talons / Claws grasping scroll */}
      <path 
        d="M170 415 C170 385, 200 385, 200 415 M312 415 C312 385, 342 385, 342 415" 
        stroke="#ffd700" 
        strokeWidth="8" 
        strokeLinecap="round" 
      />
      
      {/* Scroll of State / Ribbon at the bottom */}
      <rect 
        x="120" 
        y="435" 
        width="272" 
        height="32" 
        rx="6" 
        fill="#1e1e1e" 
        stroke="#ffd700" 
        strokeWidth="3" 
      />
      
      {/* Text on scroll "جمهورية العراق" (Republic of Iraq) */}
      <text 
        x="256" 
        y="456" 
        fill="#ffd700" 
        fontSize="16" 
        fontWeight="bold" 
        textAnchor="middle" 
        fontFamily="serif"
      >
        جمهورية العراق
      </text>

      {/* Official Iraqi Shield (Centered on Eagle's chest) */}
      <g id="shield-iraq">
        <path 
          d="M180 180 C180 140, 332 140, 332 180 C332 250, 310 330, 256 370 C202 330, 180 250, 180 180 Z" 
          fill="#ffffff" 
          stroke="#4a3e00" 
          strokeWidth="6" 
        />
        
        {/* Iraqi Flag Stripes inside Shield: RED (Top half-curve) */}
        <clipPath id="shield-clip">
          <path d="M180 180 C180 140, 332 140, 332 180 C332 250, 310 330, 256 370 C202 330, 180 250, 180 180 Z" />
        </clipPath>
        
        <g clipPath="url(#shield-clip)">
          {/* Red Stripe (Top) */}
          <rect x="150" y="110" width="212" height="85" fill="#da121a" />
          
          {/* White Stripe (Middle) */}
          <rect x="150" y="195" width="212" height="80" fill="#ffffff" />
          
          {/* Black Stripe (Bottom) */}
          <rect x="150" y="275" width="212" height="110" fill="#000000" />
          
          {/* Green Kufic Text in Middle White Stripe: "اللهأكبر" (Allahu Akbar) */}
          <text 
            x="256" 
            y="245" 
            fill="#007a3d" 
            fontSize="26" 
            fontWeight="900" 
            textAnchor="middle" 
            fontFamily="monospace"
            letterSpacing="-1"
          >
            الله أكبر
          </text>
        </g>
        
        {/* Shield fine border overlay */}
        <path 
          d="M180 180 C180 140, 332 140, 332 180 C332 250, 310 330, 256 370 C202 330, 180 250, 180 180 Z" 
          fill="none" 
          stroke="#b38f00" 
          strokeWidth="4" 
        />
      </g>
    </svg>
  );
};


// Gorgeous gold embossed stamp design
export const OfficialChamberSeal: React.FC<{ 
  color?: "gold" | "red" | "green" | "bronze";
  title?: string;
  className?: string;
}> = ({ color = "gold", title = "وزارة الصناعة والمعادن", className = "w-28 h-28" }) => {
  const getColors = () => {
    switch(color) {
      case "red": 
        return {
          primary: "fill-red-800",
          secondary: "text-red-100",
          stroke: "stroke-red-950",
          gradientStart: "#991b1b",
          gradientEnd: "#7f1d1d",
          accentColor: "#fca5a5"
        };
      case "green":
        return {
          primary: "fill-emerald-800",
          secondary: "text-emerald-100",
          stroke: "stroke-emerald-950",
          gradientStart: "#065f46",
          gradientEnd: "#064e3b",
          accentColor: "#6ee7b7"
        };
      case "bronze":
        return {
          primary: "fill-amber-900",
          secondary: "text-amber-100",
          stroke: "stroke-amber-950",
          gradientStart: "#7c2d12",
          gradientEnd: "#451a03",
          accentColor: "#fdba74"
        };
      case "gold":
      default:
        return {
          primary: "fill-amber-600",
          secondary: "text-amber-200",
          stroke: "stroke-amber-800",
          gradientStart: "#b45309",
          gradientEnd: "#78350f",
          accentColor: "#fef08a"
        };
    }
  };

  const scheme = getColors();

  return (
    <div className={`relative ${className} select-none transition-all duration-300 transform hover:scale-105`} id="official-stamp-seal-div">
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id={`sealGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={scheme.gradientStart} />
            <stop offset="100%" stopColor={scheme.gradientEnd} />
          </linearGradient>
          
          <path id="textCircle" d="M 100, 100 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" />
          <path id="textCircleInner" d="M 100, 100 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0" />
        </defs>
        
        {/* Outer scalloped/star element represent classical official stamps */}
        <g className={scheme.stroke} strokeWidth="2">
          <path 
            d="M 100 8 C 105 15, 115 15, 120 8 C 125 15, 135 15, 140 8 C 145 15, 155 15, 160 8 C 165 15, 175 15, 180 8 C 185 20, 192 25, 192 35 C 192 45, 197 55, 192 60 C 197 65, 197 75, 192 80 C 197 85, 197 95, 192 100 C 197 105, 197 115, 192 120 C 197 125, 192 135, 192 140 C 192 145, 185 155, 180 160 C 175 165, 175 175, 168 180 C 160 185, 155 192, 145 192 C 135 192, 125 197, 120 192 C 115 197, 105 197, 100 192 C 95 197, 85 197, 80 192 C 75 192, 65 185, 60 180 C 55 175, 45 175, 40 180 C 35 175, 25 175, 20 180 C 15 168, 8 160, 8 152 C 8 145, 3 135, 8 130 C 3 125, 3 115, 8 110 C 3 105, 3 95, 8 90 C 3 85, 3 75, 8 70 C 3 65, 8 55, 8 50 C 8 45, 15 35, 20 30 C 25 25, 25 15, 32 10 C 40 8, 45 3, 52 8 C 60 3, 70 3, 75 8 C 80 3, 90 3, 95 8 Z" 
            fill={`url(#sealGrad-${color})`} 
            filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))"
          />
        </g>
        
        {/* Inner Gold Rings */}
        <circle cx="100" cy="100" r="72" fill="none" stroke={scheme.accentColor} strokeWidth="2" opacity="0.8" />
        <circle cx="100" cy="100" r="66" fill="none" stroke={scheme.accentColor} strokeWidth="1" strokeDasharray="4 2" />
        <circle cx="100" cy="100" r="50" fill="none" stroke={scheme.accentColor} strokeWidth="1.5" />
        
        {/* Curved Text in Stamp: "TRADEMARK OFFICE BAGHDAD * قسم الملكية الصناعية *" */}
        <text className="font-sans font-bold uppercase text-[9px]" fill={scheme.accentColor}>
          <textPath href="#textCircle" startOffset="0%">
            * TRADEMARK OFFICE * BAGHDAD * STATUTORY SEAL
          </textPath>
        </text>

        {/* Iraqi Palm in the very middle of the stamp */}
        <g transform="translate(82, 75) scale(0.35)" fill={scheme.accentColor}>
          <path d="M50 15 C45 30 35 45 20 50 C35 50 45 40 50 25 C55 40 65 50 80 50 C65 45 55 30 50 15 Z" />
          <path d="M50 25 C45 38 30 52 10 58 C30 58 42 48 50 35 C58 48 70 58 90 58 C70 52 55 38 50 25 Z" />
          <path d="M50 35 C42 45 25 60 5 65 C25 65 38 55 50 45 C62 55 75 65 95 65 C75 60 58 45 50 35 Z" />
          {/* Trunk */}
          <rect x="46" y="55" width="8" height="40" rx="2" />
          {/* Base of ground */}
          <path d="M30 95 C40 90, 60 90, 70 95 Z" />
        </g>
        
        {/* Arabic ring text: "جمهورية العراق - قسم الملكية الصناعية" */}
        <text className="font-serif text-[10px] tracking-widest font-semibold" fill={scheme.accentColor}>
          <textPath href="#textCircleInner" startOffset="0%">
            • مسجل العلامات التجارية • جمهورية العراق •
          </textPath>
        </text>
      </svg>
    </div>
  );
};

// Premium High Resolution Vector Presets for target client's logo
export const PresetMarkLogo: React.FC<{ 
  logoId: string; 
  color: string; 
  textInitials?: string;
  className?: string;
}> = ({ logoId, color = "#a16207", textInitials = "IQ", className = "w-24 h-24" }) => {
  switch(logoId) {
    case "mesopotamia-palm-shield":
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} id="logo-palm-shield">
          <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Beautiful Stylized Palm Tree Symbol of Mesopotamia */}
          <g fill={color} stroke={color} strokeWidth="0.5">
            {/* Crown of Palm */}
            <path d="M50 15 C48 24 38 35 24 38 C36 38 45 31 50 22 C55 31 64 38 76 38 C62 35 52 24 50 15 Z" />
            <path d="M50 24 C48 33 34 44 18 47 C32 47 44 39 50 30 C56 39 68 47 82 47 C66 44 52 33 50 24 Z" />
            <path d="M50 34 C48 41 30 52 14 55 C28 55 42 45 50 38 C58 45 72 55 86 55 C70 52 52 41 50 34 Z" />
            
            {/* Trunk */}
            <path d="M47 52 L53 52 L54 85 L46 85 Z" fill={color} />
            <line x1="46" y1="58" x2="54" y2="58" />
            <line x1="45" y1="64" x2="55" y2="64" />
            <line x1="45" y1="71" x2="55" y2="71" />
            <line x1="45" y1="78" x2="55" y2="78" />
            
            {/* Roots/Base soil shape */}
            <path d="M30 85 C40 82, 60 82, 70 85 C65 89, 35 89, 30 85 Z" />
          </g>
          
          {/* Stars */}
          <path d="M28 55 L30 50 L32 55 L28 52 Z" fill={color} />
          <path d="M72 55 L70 50 L68 55 L72 52 Z" fill={color} />
        </svg>
      );
    
    case "mesopotamia-cuneiform":
      return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} id="logo-cuneiform">
          {/* Star shape represent Al-Rafidain (Between Two Rivers) waves */}
          <polygon points="50,5 63,38 95,50 63,62 50,95 37,62 5,50 37,38" stroke={color} strokeWidth="2" fill="none" />
          <polygon points="50,18 59,41 82,50 59,59 50,82 41,59 18,50 41,41" stroke={color} strokeWidth="1" strokeDasharray="2 2" fill="none" />
          {/* Waves in the middle */}
          <path d="M35 48 Q 42 42, 50 48 T 65 48 M35 53 Q 42 47, 50 53 T 65 53" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="50" r="8" fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
      );

    case "crescent-tech":
      return (
        <svg viewBox="0 0 100 100" fill="none" id="logo-crescent-tech" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* High-tech Crescent Emblem with integrated gear representing Iraqi Industry */}
          <path 
            d="M30 20 C55 20, 75 40, 75 65 C75 78, 68 88, 58 94 C71 88, 81 74, 81 58 C81 32, 60 11, 34 11 C25 11, 16 14, 10 18 C16 19, 23 20, 30 20 Z" 
            fill={color} 
          />
          <g stroke={color} strokeWidth="1.5" strokeLinecap="round">
            {/* Gear in the inner curve */}
            <circle cx="34" cy="58" r="14" fill="none" strokeWidth="2" />
            <path d="M34 40 L34 44 M34 72 L34 76 M16 58 L20 58 M48 58 L52 58 M21 45 L24 48 M44 68 L47 71 M21 71 L24 68 M44 45 L47 48" strokeWidth="2.5" />
          </g>
          <circle cx="34" cy="58" r="6" fill={color} />
        </svg>
      );

    case "islamic-geometry":
      return (
        <svg viewBox="0 0 100 100" fill="none" id="logo-islamic-geom" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* 8-pointed star of Iraqi traditional mosaic art */}
          <g stroke={color} strokeWidth="2" fill="none">
            <rect x="25" y="25" width="50" height="50" transform="rotate(0 50 50)" />
            <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="18" />
            <polygon points="50,38 53,47 62,50 53,53 50,62 47,53 38,50 47,47" fill={color} />
          </g>
          <circle cx="50" cy="50" r="30" stroke={color} strokeWidth="0.75" strokeDasharray="4 2" />
        </svg>
      );

    case "custom-text-monogram":
    default:
      return (
        <div 
          className="flex items-center justify-center rounded-xl border-2 border-dashed p-2 select-none" 
          style={{ borderColor: color, width: "100%", height: "100%" }}
          id="custom-monogram-container"
        >
          <div 
            className="flex items-center justify-center rounded-full font-display font-black text-2xl tracking-widest text-center"
            style={{ 
              color: "#ffffff", 
              backgroundColor: color, 
              width: "56px", 
              height: "56px", 
              boxShadow: `0 4px 10px ${color}55`
            }}
          >
            {textInitials.slice(0, 3)}
          </div>
        </div>
      );
  }
};
