import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export function LogoIcon({ className = '', size = 120 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      id="leveai-logo-icon"
    >
      <defs>
        {/* Main circular gradient */}
        <linearGradient id="circleGradient" x1="20" y1="180" x2="180" y2="20">
          <stop offset="0%" stopColor="#1e40af" /> {/* Deep Blue */}
          <stop offset="50%" stopColor="#3b82f6" /> {/* Light Blue */}
          <stop offset="100%" stopColor="#10b981" /> {/* Emerald Green */}
        </linearGradient>

        {/* Leaf gradient */}
        <linearGradient id="leafGradient" x1="90" y1="140" x2="170" y2="40">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>

        {/* Shadow filter for 3D depth */}
        <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.15" />
        </filter>
        <filter id="elementShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="3" stdDeviation="2.5" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Gradient Circle/Arc with heart gap at the bottom */}
      <path
        d="M 60 172 A 80 80 0 1 1 140 172"
        stroke="url(#circleGradient)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        filter="url(#logoShadow)"
      />

      {/* Connecting bottom-right curve */}
      <path
        d="M 140 172 C 158 150, 168 120, 168 95"
        stroke="#10b981"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Left Circuit Tech Nodes */}
      <path
        d="M 28 85 L 50 85 L 60 100 L 72 100"
        stroke="#1e40af"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="85" r="4" fill="#1e40af" />

      <path
        d="M 20 102 L 62 102"
        stroke="#1e40af"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="20" cy="102" r="4" fill="#1e40af" />

      <path
        d="M 24 120 L 48 120 L 58 108 L 70 108"
        stroke="#1d4ed8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="24" cy="120" r="4" fill="#1d4ed8" />

      {/* Sparkles/Stars Top-Left */}
      {/* Star 1 */}
      <path
        d="M 92 22 Q 92 31, 101 31 Q 92 31, 92 40 Q 92 31, 83 31 Q 92 31, 92 22 Z"
        fill="#10b981"
      />
      {/* Star 2 */}
      <path
        d="M 74 34 Q 74 41, 81 41 Q 74 41, 74 48 Q 74 41, 67 41 Q 74 41, 74 34 Z"
        fill="#10b981"
      />
      {/* Tiny circle node */}
      <circle cx="112" cy="40" r="3.5" fill="#10b981" />

      {/* Leaf (Drawn first under L shadow but with beautiful green gradient) */}
      <path
        d="M 100 135 C 100 95, 122 55, 164 45 C 168 80, 146 122, 100 135 Z"
        fill="url(#leafGradient)"
        filter="url(#elementShadow)"
      />
      {/* Leaf Central Vein */}
      <path
        d="M 100 135 Q 128 92, 164 45"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* Stylized white 'L' overlapping leaf with gorgeous drop shadow */}
      <path
        d="M 84 62 C 76 62, 76 72, 79 82 L 79 122 C 79 132, 88 136, 102 136 L 138 136 C 146 136, 148 130, 138 128 L 115 128 C 103 128, 98 124, 98 114 L 98 84 C 98 74, 88 62, 84 62 Z"
        fill="#ffffff"
        filter="url(#elementShadow)"
      />

      {/* Heart at the Bottom Center */}
      <g filter="url(#elementShadow)">
        <path
          d="M 100 166 C 94 158, 83 158, 83 167 C 83 176, 100 188, 100 188 C 100 188, 117 176, 117 167 C 117 158, 106 158, 100 166 Z"
          fill="#0c4a6e"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Heart inner fill */}
        <path
          d="M 100 166 C 94 158, 83 158, 83 167 C 83 176, 100 188, 100 188 C 100 188, 117 176, 117 167 C 117 158, 106 158, 100 166 Z"
          fill="#3b82f6"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

export function FullLogo({ className = '', size = 180 }: LogoProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`} id="leveai-full-logo">
      {/* 1. Main graphic badge */}
      <LogoIcon size={size} />

      {/* 2. Main Title: LeveAI */}
      <div className="mt-4 flex items-center justify-center font-sans">
        <span className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Leve
        </span>
        <span className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
          AI
        </span>
      </div>

      {/* 3. Subtitle: SUA MELHOR VERSÃO, TODOS OS DIAS */}
      <div className="mt-3 flex items-center gap-3 w-full max-w-xs">
        <div className="h-[1.5px] flex-1 bg-gradient-to-r from-blue-500 to-blue-200" />
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
          Sua melhor versão, todos os dias
        </span>
        <div className="h-[1.5px] flex-1 bg-gradient-to-l from-emerald-500 to-emerald-200" />
      </div>

      {/* 4. Three categories footer */}
      <div className="mt-5 grid grid-cols-5 gap-1 w-full max-w-sm px-4 items-center">
        {/* Alimentação */}
        <div className="col-span-1 flex flex-col items-center">
          <span className="text-sm">🍃</span>
          <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">Alimentação</span>
        </div>
        
        {/* Divider */}
        <div className="col-span-1 flex justify-center text-slate-300 dark:text-slate-800 font-light">|</div>

        {/* Exercícios */}
        <div className="col-span-1 flex flex-col items-center">
          <span className="text-sm">🏋️‍♂️</span>
          <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">Exercícios</span>
        </div>

        {/* Divider */}
        <div className="col-span-1 flex justify-center text-slate-300 dark:text-slate-800 font-light">|</div>

        {/* Hábitos */}
        <div className="col-span-1 flex flex-col items-center">
          <span className="text-sm">💧</span>
          <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">Hábitos</span>
        </div>
      </div>
    </div>
  );
}
