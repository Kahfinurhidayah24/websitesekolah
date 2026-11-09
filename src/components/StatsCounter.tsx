import React, { useEffect, useState, useRef } from 'react';
import { Users, GraduationCap, School, Trophy } from 'lucide-react';
import { SCHOOL_STATS } from '../data/schoolData';

const CounterItem: React.FC<{
  targetValue: number;
  suffix: string;
  label: string;
  subtext: string;
  iconName: string;
}> = ({ targetValue, suffix, label, subtext, iconName }) => {
  const [count, setCount] = useState(targetValue);

  const renderIcon = () => {
    const iconClass = "w-6 h-6 text-amber-500";
    switch (iconName) {
      case 'Users':
        return <Users className={iconClass} />;
      case 'GraduationCap':
        return <GraduationCap className={iconClass} />;
      case 'School':
        return <School className={iconClass} />;
      case 'Trophy':
        return <Trophy className={iconClass} />;
      default:
        return <Users className={iconClass} />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white shadow-lg shadow-slate-200/50 border border-slate-200/80 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-3">
        {renderIcon()}
      </div>

      <div className="text-3xl font-extrabold text-slate-900 font-['Outfit'] tracking-tight flex items-baseline justify-center">
        <span>{count}</span>
        <span className="text-amber-500 font-black ml-0.5 text-2xl">{suffix}</span>
      </div>

      <h4 className="text-sm font-bold text-slate-800 mt-1">{label}</h4>
      <p className="text-xs text-slate-500 mt-0.5 leading-snug">{subtext}</p>
    </div>
  );
};

export const StatsCounter: React.FC = () => {
  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCHOOL_STATS.map((stat, idx) => (
          <CounterItem
            key={idx}
            targetValue={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            subtext={stat.subtext}
            iconName={stat.iconName}
          />
        ))}
      </div>
    </section>
  );
};
