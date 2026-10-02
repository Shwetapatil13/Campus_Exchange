import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Tag, IndianRupee, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { Category, Condition } from '../types';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<Category>('ELECTRONICS');
  const [condition, setCondition] = useState<Condition>('LIKE_NEW');
  const [location, setLocation] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories: { label: string; value: Category }[] = [
    { label: 'Electronics & Laptops', value: 'ELECTRONICS' },
    { label: 'Books & Textbooks', value: 'BOOKS' },
    { label: 'Cycles & Gear', value: 'CYCLES' },
    { label: 'Hostel Furniture', value: 'FURNITURE' },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrlInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !location) {
      setErrorMsg('Please complete all required fields');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Price must be a valid positive number');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const created = await productService.createProduct({
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        category,
        condition,
        location: location.trim(),
        imageUrl: imageUrlInput.trim() || undefined,
        available: true,
      });

      // Upload file if selected
      if (imageFile) {
        await productService.uploadImage(created.id, imageFile);
      }

      showToast('Product listed successfully on campus!', 'success');
      navigate(`/products/${created.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to list product. Check your inputs.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          List an Item for Sale
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Reach fellow students on campus directly. Zero listing fees.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Product Photo
            </label>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-brand-500 transition-colors bg-slate-50/50 dark:bg-slate-900/50">
              {imagePreview || imageUrlInput ? (
                <div className="relative aspect-video max-w-sm mx-auto rounded-xl overflow-hidden shadow-md">
                  <img src={imagePreview || imageUrlInput} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                      setImageUrlInput('');
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-rose-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Click to upload photo</span>
                  <span className="text-[11px] text-slate-400">Supports JPG, PNG, WEBP up to 10MB</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <div className="text-center py-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">OR Enter Image URL</span>
            </div>

            <Input
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrlInput}
              onChange={(e) => {
                setImageUrlInput(e.target.value);
                setImagePreview('');
                setImageFile(null);
              }}
              icon={<ImageIcon className="w-4 h-4" />}
            />
          </div>

          {/* Details */}
          <Input
            label="Title / Product Name"
            placeholder="e.g. MacBook Air M1 2020 Space Gray"
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
              label="Item Condition"
              options={conditions}
              value={condition}
              onChange={(e) => setCondition(e.target.value as Condition)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Price (INR ₹)"
              type="number"
              placeholder="e.g. 1500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              icon={<IndianRupee className="w-4 h-4" />}
              required
            />

            <Input
              label="Hostel / Campus Location"
              placeholder="e.g. Hostel Block 4, Room 208"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Full Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe condition, reason for selling, accessories included, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Publish Campus Listing
          </Button>
        </form>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Preview</h3>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft p-4 space-y-3">
              <div className="aspect-[4/3] rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                {imagePreview || imageUrlInput ? (
                  <img src={imagePreview || imageUrlInput} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <Upload className="w-8 h-8 mb-1" />
                    <span className="text-xs">Photo Preview</span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge category={category}>{category}</Badge>
                </div>
              </div>

              <div className="space-y-1">
                <Badge condition={condition}>{condition.replace('_', ' ')}</Badge>
                <h4 className="font-bold text-slate-900 dark:text-white text-base truncate">{title || 'Product Title'}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{description || 'Product description will appear here...'}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">
                  ₹{price || '0'}
                </span>
                <span className="text-xs text-slate-400">{location || 'Campus Location'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
