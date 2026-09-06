import React from 'react';
import { Link } from 'react-router-dom';

export const LuxuryLogoIcon = ({ className = "h-8 w-8" }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer Royal Diamond Crest */}
    <path 
      d="M50 4L94 28V72L50 96L6 72V28L50 4Z" 
      stroke="url(#goldGradient)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M50 12L86 32V68L50 88L14 68V32L50 12Z" 
      stroke="url(#goldGradient)" 
      strokeWidth="1" 
      strokeDasharray="2 3"
      opacity="0.6"
    />
    
    {/* Inner Monogram Crown / Architectural Columns */}
    <path 
      d="M32 66V38L50 26L68 38V66" 
      stroke="url(#goldGradient)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <path 
      d="M42 66V44L50 38L58 44V66" 
      stroke="url(#goldGradient)" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    <path 
      d="M26 66H74" 
      stroke="url(#goldGradient)" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
    />
    
    {/* Center 5-Point Luxury Star */}
    <path 
      d="M50 20L51.8 24.5L56.5 25L52.8 28.2L54 32.8L50 30.2L46 32.8L47.2 28.2L43.5 25L48.2 24.5L50 20Z" 
      fill="url(#goldGradient)" 
    />

    {/* Gold Linear Gradient Definition */}
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E6CA65" />
        <stop offset="40%" stopColor="#D4AF37" />
        <stop offset="70%" stopColor="#AA771C" />
        <stop offset="100%" stopColor="#85580C" />
      </linearGradient>
    </defs>
  </svg>
);

const LuxuryLogo = ({ 
  variant = 'dark', // 'dark' (for white bg), 'light' (for dark bg), 'gold'
  size = 'md',      // 'sm', 'md', 'lg'
  withLink = true,
  to = '/'
}) => {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8 sm:h-9 sm:w-9',
    lg: 'h-11 w-11 sm:h-12 sm:w-12'
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl'
  };

  const subtitleSizes = {
    sm: 'text-[7px]',
    md: 'text-[8px] sm:text-[9px]',
    lg: 'text-[10px] sm:text-[11px]'
  };

  const content = (
    <div className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none">
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <LuxuryLogoIcon className={iconSizes[size]} />
      </div>
      <div className="flex flex-col text-left">
        <span className={`font-serif font-extrabold tracking-[0.15em] leading-tight ${titleSizes[size]} ${
          variant === 'light' ? 'text-white' : 'text-gray-900'
        }`}>
          LUXURY<span className="text-gold-500 font-normal">STAY</span>
        </span>
        <span className={`font-sans uppercase tracking-[0.35em] font-semibold text-gold-600 ${subtitleSizes[size]}`}>
          HOTEL & RESORT
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return <Link to={to} className="inline-block focus:outline-none">{content}</Link>;
  }

  return content;
};

export default LuxuryLogo;
