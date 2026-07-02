"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { Camera, X, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default function ListProductPage() {
  const router = useRouter();
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [listingType, setListingType] = useState("sale");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 4 - images.length);
      setImages((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!user) {
      setErrorMsg("You must be logged in to post a listing.");
      return;
    }
    if (images.length === 0) {
      setErrorMsg("Please add at least one photo.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        
        let compressedFile = file;
        try {
          compressedFile = await imageCompression(file, options);
        } catch (error) {
          console.error("Compression failed", error);
        }
        
        const base64String = await blobToBase64(compressedFile);
        uploadedImageUrls.push(base64String);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          price: listingType === 'sale' ? Math.round(Number(price)) : 0,
          listingType,
          category,
          condition,
          description,
          images: uploadedImageUrls,
          sellerName: user.name,
          hostel: user.hostel,
          status: "available",
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create listing");
      }

      router.push("/dashboard/marketplace");
    } catch (error) {
      console.error(error);
      setErrorMsg("Something went wrong saving the post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard/marketplace" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft size={18} /> Cancel
          </Link>
          <h1 className="font-bold text-lg text-gray-900">Create Listing</h1>
          <div className="w-20"></div> {/* Spacer */}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Type */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Listing Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { id: "sale", label: "For Sale" },
                { id: "lost", label: "Lost Item" },
                { id: "found", label: "Found Item" },
                { id: "service", label: "Service / Gig" }
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setListingType(type.id)}
                  className={`py-3 px-2 rounded-lg border text-sm font-semibold transition-colors ${
                    listingType === type.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Photos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Photos</h2>
            <p className="text-gray-500 text-sm mb-4">Add up to 4 photos. The first photo will be your cover.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden relative group border border-gray-200">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-white text-gray-700 p-1.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-white text-[10px] font-bold text-center py-1">
                      COVER
                    </div>
                  )}
                </div>
              ))}
              
              {images.length < 4 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors"
                >
                  <Camera size={24} className="mb-2 text-gray-400" />
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Section 3: Details */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Item Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {listingType === 'sale' ? 'Title' : listingType === 'service' ? 'Service Title' : 'Item Name'}
              </label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder={listingType === 'sale' ? "e.g., Engineering Graphics Drafter" : "e.g., Blue Water Bottle"} 
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 text-sm"
              />
            </div>

            {listingType === 'sale' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input 
                    type="number" 
                    required 
                    value={price} 
                    onChange={e => setPrice(e.target.value)} 
                    placeholder="0" 
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 text-sm cursor-pointer"
                >
                  <option>Electronics</option>
                  <option>Books</option>
                  <option>Hostel Gear</option>
                  <option>Stationery</option>
                  <option>Clothing</option>
                  <option>Other</option>
                </select>
              </div>
              {listingType === 'sale' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
                  <select 
                    value={condition} 
                    onChange={e => setCondition(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 text-sm cursor-pointer"
                  >
                    <option>Like New</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Needs Repair</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea 
                required 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Add details such as brand, flaws, or pickup location..." 
                rows={5}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow text-gray-900 text-sm resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-8 py-3 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Publishing...
                </>
              ) : (
                "Publish Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
