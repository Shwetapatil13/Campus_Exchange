import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Product, PagedResponse } from '../types';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const MyProductsPage: React.FC = () => {
  const { showToast } = useToast();
  const [productsData, setProductsData] = useState<PagedResponse<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'SOLD'>('ALL');

  const [deleteProductTarget, setDeleteProductTarget] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getMyProducts(0, 50);
      setProductsData(data);
    } catch (err) {
      showToast('Failed to load your products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleToggleStatus = async (product: Product) => {
    try {
      const updated = await productService.toggleAvailability(product.id);
      showToast(updated.available ? 'Marked as active' : 'Marked as sold', 'success');
      setProductsData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          content: prev.content.map((p) => (p.id === product.id ? updated : p)),
        };
      });
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deleteProductTarget.id);
      showToast('Product deleted', 'success');
      setProductsData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          content: prev.content.filter((p) => p.id !== deleteProductTarget.id),
        };
      });
    } catch (err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteProductTarget(null);
    }
  };

  const allItems = productsData?.content || [];
  const activeItems = allItems.filter((p) => p.available);
  const soldItems = allItems.filter((p) => !p.available);

  const displayedItems =
    activeTab === 'ACTIVE' ? activeItems : activeTab === 'SOLD' ? soldItems : allItems;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">My Listed Products</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your active campus listings and sales history</p>
        </div>
        <Link to="/add-product">
          <Button variant="primary" size="md">
            <PlusCircle className="w-4 h-4" /> Add New Product
          </Button>
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Listed</span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{allItems.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-bold text-emerald-500 uppercase">Active Listings</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{activeItems.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="text-xs font-bold text-rose-500 uppercase">Items Sold</span>
          <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{soldItems.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 px-4 text-xs font-bold transition-colors relative ${
            activeTab === 'ALL'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          All Items ({allItems.length})
        </button>
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`pb-3 px-4 text-xs font-bold transition-colors relative ${
            activeTab === 'ACTIVE'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Active ({activeItems.length})
        </button>
        <button
          onClick={() => setActiveTab('SOLD')}
          className={`pb-3 px-4 text-xs font-bold transition-colors relative ${
            activeTab === 'SOLD'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Sold ({soldItems.length})
        </button>
      </div>

      {/* Product List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500">Loading your listed items...</div>
      ) : displayedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge category={item.category}>{item.category}</Badge>
                  <Badge available={item.available}>{item.available ? 'Active' : 'Sold'}</Badge>
                </div>
                <Link to={`/products/${item.id}`} className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-brand-600">
                  {item.title}
                </Link>
                <p className="text-xs text-slate-500 mt-1">₹{item.price} • {item.location}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(item)}
                  title={item.available ? 'Mark as Sold' : 'Mark Active'}
                >
                  {item.available ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  {item.available ? 'Mark Sold' : 'Activate'}
                </Button>

                <div className="flex items-center gap-1">
                  <Link to={`/edit-product/${item.id}`}>
                    <Button variant="ghost" size="sm" title="Edit">
                      <Edit className="w-4 h-4 text-brand-600" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteProductTarget(item)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products listed"
          description="You haven't listed any items in this tab yet. Start selling second-hand items today."
          actionText="List an Item Now"
          onAction={() => window.location.href = '/add-product'}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteProductTarget}
        onClose={() => setDeleteProductTarget(null)}
        title="Delete Listing?"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete <span className="font-bold text-slate-900 dark:text-white">"{deleteProductTarget?.title}"</span>?
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDeleteProductTarget(null)} className="w-1/2">
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting} className="w-1/2">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
