import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Calendar,
  User as UserIcon,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  ChevronRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  // Modals
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user && product && user.id === product.seller.id;

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
      setIsWishlisted(data.wishlistedByCurrentUser);

      // Fetch related items from same category
      const related = await productService.getProducts({ category: data.category, size: 4 });
      setRelatedProducts(related.content.filter((p) => p.id !== data.id));
    } catch (err: any) {
      showToast('Product not found', 'error');
      navigate('/explore');
    } finally {
      setIsLoading(false);
    }
  }, [productId, navigate, showToast]);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId, fetchProduct]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please login to wishlist items', 'info');
      navigate('/login');
      return;
    }

    if (!product || isWishlisting) return;

    const previousState = isWishlisted;
    setIsWishlisted(!previousState);
    setIsWishlisting(true);

    try {
      if (!previousState) {
        await wishlistService.addToWishlist(product.id);
        showToast('Added to wishlist!', 'success');
      } else {
        await wishlistService.removeFromWishlist(product.id);
        showToast('Removed from wishlist', 'info');
      }
    } catch (err) {
      setIsWishlisted(previousState);
      showToast('Failed to update wishlist', 'error');
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleToggleAvailability = async () => {
    if (!product) return;
    try {
      const updated = await productService.toggleAvailability(product.id);
      setProduct(updated);
      showToast(updated.available ? 'Product marked as available' : 'Product marked as sold', 'success');
    } catch (err) {
      showToast('Failed to update product status', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(product.id);
      showToast('Product deleted successfully', 'success');
      navigate('/my-products');
    } catch (err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/explore" className="hover:text-brand-600 transition-colors">Explore</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Display */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-soft">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className={`w-full h-full object-cover ${!product.available ? 'opacity-60 grayscale' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-500/10 to-purple-500/10 text-slate-400">
                <Tag className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-semibold uppercase">{product.category}</span>
              </div>
            )}

            {!product.available && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xl">
                  Product Sold
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details & Seller Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
            
            {/* Badges & Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge category={product.category}>{product.category}</Badge>
                <Badge condition={product.condition}>{product.condition.replace('_', ' ')}</Badge>
              </div>

              <button
                onClick={handleWishlistToggle}
                disabled={isWishlisting}
                className={`p-2.5 rounded-full border transition-all ${
                  isWishlisted
                    ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Title & Price */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                  {formatPrice(product.price)}
                </span>
                <Badge available={product.available}>
                  {product.available ? 'Available' : 'Sold'}
                </Badge>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="truncate">{product.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Listed: {formatDate(product.createdAt)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Item Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Owner Actions vs Buyer Actions */}
            {isOwner ? (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Seller Controls</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4" /> Edit Details
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleToggleAvailability}
                    className="w-full"
                  >
                    {product.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    {product.available ? 'Mark as Sold' : 'Mark Available'}
                  </Button>
                </div>
                <Button
                  variant="danger"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4" /> Delete Listing
                </Button>
              </div>
            ) : (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      showToast('Please log in to contact seller', 'info');
                      navigate('/login');
                    } else {
                      setIsContactModalOpen(true);
                    }
                  }}
                  disabled={!product.available}
                  className="w-full shadow-lg"
                >
                  {product.available ? 'Contact Seller / Reveal Details' : 'Product Unavailable'}
                </Button>
              </div>
            )}
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold text-lg flex items-center justify-center shrink-0 overflow-hidden border border-brand-500/30">
              {product.seller.profileImage ? (
                <img src={product.seller.profileImage} alt={product.seller.name} className="w-full h-full object-cover" />
              ) : (
                product.seller.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.seller.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{product.seller.college || 'Campus Student'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Campus Seller
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-slate-200/80 dark:border-slate-800 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">More from {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Contact Seller Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Seller Contact Details"
      >
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300">
            <p className="font-semibold">Safety Tip for Students:</p>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Always schedule meetups in well-lit public campus areas (e.g., Central Library, Student Union, Canteen).
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <UserIcon className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Seller Name</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{product.seller.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <Mail className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-medium">Email Address</p>
                <a href={`mailto:${product.seller.email}`} className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline">
                  {product.seller.email}
                </a>
              </div>
            </div>

            {product.seller.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-medium">Phone Number / WhatsApp</p>
                  <a href={`tel:${product.seller.phone}`} className="text-sm font-bold text-slate-900 dark:text-white hover:underline">
                    {product.seller.phone}
                  </a>
                </div>
              </div>
            )}
          </div>

          <Button onClick={() => setIsContactModalOpen(false)} variant="primary" className="w-full">
            Done
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product Listing?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{product.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="w-1/2">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteProduct} isLoading={isDeleting} className="w-1/2">
              Delete Listing
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
