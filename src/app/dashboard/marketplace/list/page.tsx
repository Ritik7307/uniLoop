"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Camera, X, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import imageCompression from 'browser-image-compression';

// Base64 helper to bypass Firebase Storage
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [listingType, setListingType] = useState("sale"); // sale, lost, found, service
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
    if (!user) return alert("You must be logged in.");
    if (images.length === 0) return alert("Please add at least one photo.");

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

      await addDoc(collection(db, "products"), {
        title,
        price: listingType === 'sale' ? Math.round(Number(price)) : 0,
        listingType,
        category,
        condition,
        description,
        images: uploadedImageUrls,
        sellerId: user.uid,
        sellerName: user.name,
        hostel: user.hostel,
        status: "available",
        createdAt: serverTimestamp()
      });

      router.push("/dashboard/marketplace");
    } catch (error) {
      console.error(error);
      alert("Something went wrong saving the post.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard/marketplace" className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="font-bold text-lg text-gray-900">Create Listing</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Listing Type Selection */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">What are you posting?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                  className={`py-3 px-2 rounded-xl border text-sm font-semibold transition ${
                    listingType === type.id 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Photos</h2>
            <p className="text-gray-500 text-sm mb-4">Add up to 4 photos. The first photo will be your cover.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden relative group bg-gray-100 border border-gray-200">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-white/90 text-gray-900 p-1.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] font-bold text-center py-1">
                      COVER
                    </div>
                  )}
                </div>
              ))}
              
              {images.length < 4 && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition"
                >
                  <Camera size={28} className="mb-2 text-gray-400" />
                  <span className="text-sm font-medium">Add Photo</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>

          {/* Details Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Item Details</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {listingType === 'sale' ? 'What are you selling?' : listingType === 'service' ? 'What service are you offering?' : 'What item?'}
              </label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder={listingType === 'sale' ? "e.g., Engineering Drafter" : "e.g., Blue Water Bottle"} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {listingType === 'sale' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  value={price} 
                  onChange={e => setPrice(e.target.value)} 
                  placeholder="0" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-lg font-medium text-gray-900 placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 cursor-pointer"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
                  <select 
                    value={condition} 
                    onChange={e => setCondition(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-gray-900 cursor-pointer"
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description / Location</label>
              <textarea 
                required 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Add more details (flaws, exact location where lost/found)..." 
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Publishing...
              </>
            ) : (
              "Post Listing"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
