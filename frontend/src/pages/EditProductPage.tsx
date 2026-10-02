import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tag, IndianRupee, MapPin, Edit3 } from 'lucide-react';
import { Category, Condition, Product } from '../types';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('ELECTRONICS');
  const [condition, setCondition] = useState<Condition>('LIKE_NEW');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const p = await productService.getProductById(productId);
        setTitle(p.title);
        setDescription(p.description);
        setPrice(p.price.toString());
        setCategory(p.category);
        setCondition(p.condition);
        setLocation(p.location);
        setImageUrl(p.imageUrl || '');
        setAvailable(p.available);
      } catch (err) {
        showToast('Failed to load product', 'error');
        navigate('/my-products');
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) loadProduct();
  }, [productId, navigate, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      setErrorMsg('Please complete all required fields');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      await productService.updateProduct(productId, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        condition,
        location: location.trim(),
        imageUrl: imageUrl.trim() || undefined,
        available,
      });

      showToast('Product updated successfully!', 'success');
      navigate(`/products/${productId}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update product';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center">Loading product data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600">
          <Edit3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Edit Product Details</h1>
          <p className="text-xs text-slate-500">Update listing info, price or availability status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Tag className="w-4 h-4" />}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            options={categories}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          />
          <Select
            label="Condition"
            options={conditions}
            value={condition}
            onChange={(e) => setCondition(e.target.value as Condition)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Price (INR ₹)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            icon={<IndianRupee className="w-4 h-4" />}
            required
          />
          <Input
            label="Hostel / Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
            required
          />
        </div>

        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="available-check"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="w-4 h-4 text-brand-600 rounded"
          />
          <label htmlFor="available-check" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Available for purchase (Uncheck if sold)
          </label>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm"
            required
          />
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-1/2">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSaving} className="w-1/2">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
