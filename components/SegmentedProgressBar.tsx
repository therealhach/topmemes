'use client';

import { useEffect, useState } from 'react';

interface SegmentedProgressBarProps {
  percentage: number;
  color?: 'orange' | 'blue' | 'pink' | 'black' | 'green' | 'auto';
  className?: string;
}

// Get color based on progress percentage
const getAutoColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-cyan-500';
  if (percentage >= 40) return 'bg-yellow-500';
  if (percentage >= 20) return 'bg-orange-500';
  return 'bg-rose-500';
};

const colorClassMap = {
  orange: 'bg-orange-400',
  blue: 'bg-blue-500',
  pink: 'bg-pink-500',
  black: 'bg-gray-900',
  green: 'bg-emerald-500',
};

export default function SegmentedProgressBar({
  percentage,
  color = 'auto',
  className = '',
}: SegmentedProgressBarProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  const totalBlocks = 10;
  const filledBlocks = Math.round(animatedPercentage / 10);
  const blockColor = color === 'auto' ? getAutoColor(animatedPercentage) : colorClassMap[color];

  return (
    <div
      className={`flex items-center gap-[2px] ${className}`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: totalBlocks }).map((_, index) => (
        <div
          key={index}
          className={`w-2.5 h-3 rounded-[2px] transition-all duration-300 ${
            index < filledBlocks ? blockColor : 'bg-gray-700/50'
          }`}
        />
      ))}
    </div>
  );
}
