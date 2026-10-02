import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
                CE
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                CampusExchange
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The ultimate campus-only marketplace for college students to discover, buy, sell, and wishlist pre-loved items securely within campus.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Explore Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/explore?category=ELECTRONICS" className="hover:text-brand-600 transition-colors">Electronics & Laptops</Link></li>
              <li><Link to="/explore?category=BOOKS" className="hover:text-brand-600 transition-colors">Textbooks & Notes</Link></li>
              <li><Link to="/explore?category=CYCLES" className="hover:text-brand-600 transition-colors">Bicycles & Gear</Link></li>
              <li><Link to="/explore?category=FURNITURE" className="hover:text-brand-600 transition-colors">Hostel Furniture</Link></li>
              <li><Link to="/explore?category=STATIONERY" className="hover:text-brand-600 transition-colors">Calculators & Supplies</Link></li>
            </ul>
          </div>

          {/* Student Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Safety & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Student Verification</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-brand-500" /> Direct In-Person Meetups</li>
              <li>Zero Listing Fees for Students</li>
              <li>Campus-Only Network</li>
            </ul>
          </div>

          {/* Contact / Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Tech Stack
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Built with Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL, React, TypeScript, Vite & Tailwind CSS.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusExchange Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for University Students
          </p>
        </div>
      </div>
    </footer>
  );
};
