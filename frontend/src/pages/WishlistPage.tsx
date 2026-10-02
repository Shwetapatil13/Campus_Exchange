import React, { useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { WishlistResponse, PagedResponse } from '../types';
import { wishlistService } from '../services/wishlistService';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';
import { ProductGridSkeleton } from '../components/common/Skeleton';

export const WishlistPage: React.FC = () => {
  const { showToast } = useToast();
  const [wishlistData, setWishlistData] = useState<PagedResponse<WishlistResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await wishlistService.getWishlist(0, 50);
      setWishlistData(data);
    } catch (err) {
      showToast('Failed to load wishlist items', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleWishlistToggle = (productId: number, isWishlisted: boolean) => {
    if (!isWishlisted) {
      setWishlistData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          content: prev.content.filter((item) => item.product.id !== productId),
        };
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Saved Wishlist</h1>
          <p className="text-xs text-slate-500 mt-1">Keep track of items you are interested in buying</p>
        </div>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : wishlistData && wishlistData.content.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistData.content.map((item) => (
            <ProductCard
              key={item.id}
              product={item.product}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Heart className="w-12 h-12 text-rose-500" />}
          title="Your Wishlist is Empty"
          description="Browse campus items and click the heart icon on products to save them for later."
          actionText="Explore Campus Items"
          onAction={() => window.location.href = '/explore'}
        />
      )}

    </div>
  );
};
