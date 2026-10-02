import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Category, Condition, Product, PagedResponse } from '../types';
import { productService } from '../services/productService';
import { ProductCard } from '../components/common/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Pagination } from '../components/common/Pagination';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const keywordParam = searchParams.get('keyword') || '';
  const categoryParam = (searchParams.get('category') as Category) || undefined;
  const conditionParam = (searchParams.get('condition') as Condition) || undefined;
  const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const availableParam = searchParams.get('available') !== null ? searchParams.get('available') === 'true' : true;
  const pageParam = searchParams.get('page') ? Number(searchParams.get('page')) : 0;
  const sortParam = searchParams.get('sort') || 'createdAt,desc';

  // Local state
  const [keywordInput, setKeywordInput] = useState(keywordParam);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(categoryParam);
  const [selectedCondition, setSelectedCondition] = useState<Condition | undefined>(conditionParam);
  const [minPrice, setMinPrice] = useState<number | undefined>(minPriceParam);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(maxPriceParam);
  const [availableOnly, setAvailableOnly] = useState<boolean>(availableParam);

  const [productsData, setProductsData] = useState<PagedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync keyword input when URL changes
  useEffect(() => {
    setKeywordInput(keywordParam);
    setSelectedCategory(categoryParam);
    setSelectedCondition(conditionParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setAvailableOnly(availableParam);
  }, [keywordParam, categoryParam, conditionParam, minPriceParam, maxPriceParam, availableParam]);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sortBy, direction] = sortParam.split(',');
      const response = await productService.getProducts({
        keyword: keywordParam || undefined,
        category: categoryParam,
        condition: conditionParam,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        available: availableParam ? true : undefined,
        page: pageParam,
        size: 12,
        sortBy,
        direction: direction as 'asc' | 'desc',
      });
      setProductsData(response);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  }, [keywordParam, categoryParam, conditionParam, minPriceParam, maxPriceParam, availableParam, pageParam, sortParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newParams: Record<string, string | undefined>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updated: Record<string, string | undefined> = { ...current, ...newParams, page: '0' }; // Reset to page 0 on filter change

    Object.keys(updated).forEach((key) => {
      if (updated[key] === undefined || updated[key] === '' || updated[key] === 'null') {
        delete updated[key];
      }
    });

    const finalParams: Record<string, string> = {};
    Object.entries(updated).forEach(([k, v]) => {
      if (v !== undefined) finalParams[k] = v;
    });

    setSearchParams(finalParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ keyword: keywordInput.trim() || undefined });
  };

  const handleClearFilters = () => {
    setKeywordInput('');
    setSelectedCategory(undefined);
    setSelectedCondition(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setAvailableOnly(true);
    setSearchParams({});
  };

  const categories: { label: string; value: Category }[] = [
    { label: 'Electronics & Laptops', value: 'ELECTRONICS' },
    { label: 'Books & Textbooks', value: 'BOOKS' },
    { label: 'Cycles & Gear', value: 'CYCLES' },
    { label: 'Furniture', value: 'FURNITURE' },
    { label: 'Stationery & Calculators', value: 'STATIONERY' },
    { label: 'Fashion & Bags', value: 'FASHION' },
    { label: 'Other Items', value: 'OTHER' },
  ];

  const conditions: { label: string; value: Condition }[] = [
    { label: 'New', value: 'NEW' },
    { label: 'Like New', value: 'LIKE_NEW' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Fair', value: 'FAIR' },
  ];

  const hasActiveFilters = !!(
    keywordParam ||
    categoryParam ||
    conditionParam ||
    minPriceParam ||
    maxPriceParam ||
    !availableParam
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Campus Products
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Discover second-hand items listed by verified campus students
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search keyword..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </form>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortParam}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="pl-8 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="createdAt,desc">Latest First</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden shrink-0"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">Active Filters:</span>
          {keywordParam && (
            <Badge variant="brand" className="gap-1">
              Keyword: "{keywordParam}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ keyword: undefined })} />
            </Badge>
          )}
          {categoryParam && (
            <Badge category={categoryParam} className="gap-1">
              Category: {categoryParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ category: undefined })} />
            </Badge>
          )}
          {conditionParam && (
            <Badge condition={conditionParam} className="gap-1">
              Condition: {conditionParam}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ condition: undefined })} />
            </Badge>
          )}
          {(minPriceParam || maxPriceParam) && (
            <Badge variant="slate" className="gap-1">
              Price: ₹{minPriceParam || 0} - ₹{maxPriceParam || '∞'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ minPrice: undefined, maxPrice: undefined })} />
            </Badge>
          )}

          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-rose-500 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filter Panel */}
        <aside className="hidden md:block md:col-span-1 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" /> Filters
            </h3>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="text-xs font-semibold text-rose-500 hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* Category List Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Category</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateFilters({ category: undefined })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  !categoryParam
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => updateFilters({ category: cat.value })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    categoryParam === cat.value
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Item Condition</h4>
            <div className="space-y-1">
              <button
                onClick={() => updateFilters({ condition: undefined })}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  !conditionParam
                    ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Any Condition
              </button>
              {conditions.map((cond) => (
                <button
                  key={cond.value}
                  onClick={() => updateFilters({ condition: cond.value })}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    conditionParam === cond.value
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Price (₹)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice ?? ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
              <span className="text-xs text-slate-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-2"
              onClick={() => updateFilters({ minPrice: minPrice?.toString(), maxPrice: maxPrice?.toString() })}
            >
              Apply Price Filter
            </Button>
          </div>

          {/* Availability Toggle */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">In-Stock Only</span>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => {
                setAvailableOnly(e.target.checked);
                updateFilters({ available: e.target.checked ? 'true' : undefined });
              }}
              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="md:col-span-3 space-y-6">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : productsData && productsData.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={productsData.pageNo}
                totalPages={productsData.totalPages}
                totalElements={productsData.totalElements}
                onPageChange={(p) => updateFilters({ page: p.toString() })}
              />
            </>
          ) : (
            <EmptyState
              title="No items found"
              description="No products match your active search keyword or filter settings. Try adjusting your filter parameters or resetting."
              actionText="Reset Filters"
              onAction={handleClearFilters}
            />
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm md:hidden">
          <div className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Filter Products</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Category</h4>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    updateFilters({ category: cat.value });
                    setIsMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs ${
                    categoryParam === cat.value ? 'bg-brand-600 text-white font-bold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <Button onClick={() => setIsMobileFilterOpen(false)} variant="primary" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
