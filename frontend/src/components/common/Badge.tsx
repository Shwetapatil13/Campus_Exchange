import React from 'react';
import { Category, Condition } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'category' | 'condition' | 'availability' | 'slate';
  category?: Category;
  condition?: Condition;
  available?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  category,
  condition,
  available,
  className = '',
}) => {
  let styleClasses = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

  if (category) {
    const categoryStyles: Record<Category, string> = {
      ELECTRONICS: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      BOOKS: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      FURNITURE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      CYCLES: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      FASHION: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
      STATIONERY: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      OTHER: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    };
    styleClasses = categoryStyles[category] || styleClasses;
  } else if (condition) {
    const conditionStyles: Record<Condition, string> = {
      NEW: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      LIKE_NEW: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      GOOD: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      FAIR: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
    styleClasses = conditionStyles[condition] || styleClasses;
  } else if (typeof available === 'boolean') {
    styleClasses = available
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  } else if (variant === 'brand') {
    styleClasses = 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
