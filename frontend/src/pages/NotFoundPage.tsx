import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-3xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-4">
        <Compass className="w-16 h-16 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
        The page or product listing you are looking for doesn't exist or may have been moved by the seller.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Return to Campus Home
        </Button>
      </Link>
    </div>
  );
};
