import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';
import { Product } from '../../types';
import { Badge } from './Badge';
import { wishlistService } from '../../services/wishlistService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (productId: number, isWishlisted: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onWishlistToggle }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(product.wishlistedByCurrentUser);
  const [isWishlisting, setIsWishlisting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add items to your wishlist', 'info');
      return;
    }

    if (isWishlisting) return;

    // Optimistic UI update
    const previousState = isWishlisted;
    const newState = !previousState;
    setIsWishlisted(newState);
    setIsWishlisting(true);

    try {
      if (newState) {
        await wishlistService.addToWishlist(product.id);
        showToast('Added to wishlist!', 'success');
      } else {
        await wishlistService.removeFromWishlist(product.id);
        showToast('Removed from wishlist', 'info');
      }
      if (onWishlistToggle) {
        onWishlistToggle(product.id, newState);
      }
    } catch (err: any) {
      // Rollback on error
      setIsWishlisted(previousState);
      const msg = err?.response?.data?.message || 'Failed to update wishlist';
      showToast(msg, 'error');
    } finally {
      setIsWishlisting(false);
    }
  };

  const formattedCondition = product.condition ? product.condition.replace('_', ' ') : '';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Aspect Ratio Image Wrapper */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.imageUrl && !imgError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              !product.available ? 'opacity-50 grayscale' : ''
            }`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-slate-400 dark:text-slate-600 p-4 text-center">
            <Tag className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-semibold uppercase tracking-wider">{product.category}</span>
          </div>
        )}

        {/* Sold Badge Overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 text-white shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge category={product.category}>{product.category}</Badge>
        </div>

        {/* Wishlist Button Top Right */}
        <button
          onClick={handleWishlistClick}
          disabled={isWishlisting}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
            isWishlisted
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-110'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <Badge condition={product.condition}>{formattedCondition}</Badge>
            {product.location && (
              <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                <MapPin className="w-3.5 h-3.5 mr-1 shrink-0 text-slate-400" />
                <span className="truncate">{product.location}</span>
              </span>
            )}
          </div>

          <Link to={`/products/${product.id}`} className="block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Seller */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Price</span>
            <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.seller && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center overflow-hidden border border-brand-500/20">
                {product.seller.profileImage ? (
                  <img src={product.seller.profileImage} alt={product.seller.name} className="w-full h-full object-cover" />
                ) : (
                  product.seller.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300 max-w-[80px] truncate hidden sm:inline">
                {product.seller.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
