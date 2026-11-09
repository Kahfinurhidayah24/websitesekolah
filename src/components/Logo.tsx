import React from 'react';
import logo from '../assets/logo.png';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

/** Logo resmi SDN Lubang Buaya 04 Pagi. */
export const Logo: React.FC<LogoProps> = ({ className = 'w-11 h-11', glow = true }) => (
  <img
    src={logo}
    alt="Logo SDN Lubang Buaya 04 Pagi"
    className={`${className} object-contain shrink-0 select-none ${glow ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]' : ''}`}
    draggable={false}
  />
);
