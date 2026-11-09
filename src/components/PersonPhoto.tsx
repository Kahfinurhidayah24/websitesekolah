import React from 'react';
import { assetUrl } from '../lib/router';

interface PersonPhotoProps {
  src?: string;
  name: string;
  className?: string;
}

const initials = (name: string) =>
  name
    .replace(/,.*$/, '')
    .split(/\s+/)
    .filter((w) => w && !/\.$/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

/** Foto orang; bila belum ada foto, tampilkan inisial pada latar hijau. */
export const PersonPhoto: React.FC<PersonPhotoProps> = ({ src, name, className = '' }) =>
  src ? (
    <img src={assetUrl(src)} alt={name} className={className} />
  ) : (
    <div
      role="img"
      aria-label={name}
      className={`${className} flex items-center justify-center bg-gradient-to-br from-green-600 to-forest-800 text-white font-black tracking-wider font-['Outfit'] text-4xl`}
    >
      {initials(name)}
    </div>
  );
