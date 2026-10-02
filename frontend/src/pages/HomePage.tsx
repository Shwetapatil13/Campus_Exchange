import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Laptop,
  BookOpen,
  Bike,
  Armchair,
  Calculator,
  Shirt,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Category, Product } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/explore?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const categories: { label: string; value: Category; icon: React.ReactNode; color: string }[] = [
    { label: 'Electronics & Laptops', value: 'ELECTRONICS', icon: <Laptop className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { label: 'Textbooks & Study', value: 'BOOKS', icon: <BookOpen className="w-5 h-5" />, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    { label: 'Cycles & Gear', value: 'CYCLES', icon: <Bike className="w-5 h-5" />, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { label: 'Hostel Furniture', value: 'FURNITURE', icon: <Armchair className="w-5 h-5" />, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
    { label: 'Calculators & Kits', value: 'STATIONERY', icon: <Calculator className="w-5 h-5" />, color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
    { label: 'Apparel & Accessories', value: 'FASHION', icon: <Shirt className="w-5 h-5" />, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/20 to-purple-500/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center px-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Trusted Campus-Only Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Buy, Sell & Swap Items <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Directly Within Your Campus
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Discover laptops, engineering books, cycles, calculators, and hostel furniture listed by fellow students. Zero commission, instant contact, safe campus meetups.
          </motion.p>

          {/* Hero Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleHeroSearch}
            className="max-w-2xl mx-auto relative flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl"
          >
            <Search className="w-5 h-5 absolute left-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 'MacBook', 'CLRS Algorithm', 'Gear Cycle', 'Calculator'..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-12 pr-32 py-3 bg-transparent text-slate-900 dark:text-white text-sm focus:outline-none placeholder:text-slate-400"
            />
            <Button type="submit" variant="primary" size="md" className="shrink-0 rounded-xl">
              Search Items
            </Button>
          </motion.form>

          {/* Quick CTA buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 pt-2"
          >
            <Link to="/explore">
              <Button variant="outline" size="md">
                Browse All Items
              </Button>
            </Link>
            <Link to="/add-product">
              <Button variant="secondary" size="md">
                + List an Item
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Browse second-hand student essentials</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              to={`/explore?category=${cat.value}`}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col items-center text-center space-y-3 group"
            >
              <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fresh on Campus Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Fresh on Campus</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recently listed items from students nearby</p>
          </div>
          <Link to="/explore" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            Explore All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">No products listed yet.</p>
        )}
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How CampusExchange Works</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Buying & selling within your campus in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">List Your Item</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Snap a photo of your old laptop, textbook or cycle, add a quick title and price, and post it in seconds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Connect with Students</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Interested buyers view your listing and contact you directly via phone or email for inquiries.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Safe Campus Swap</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Meet up safely at the central library, hostel lobby, or food court to inspect the item and finalize the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Band */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Got items lying around your hostel room?
            </h2>
            <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
              Clear out your unused textbooks, electronics, and gear while making extra cash. Join hundreds of students already trading on CampusExchange.
            </p>
          </div>
          <Link to="/add-product" className="shrink-0">
            <Button variant="secondary" size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-lg font-bold">
              List Your First Item Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};
