"use client";

import React, { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  
  const router = useRouter();
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [condition, setCondition] = useState("Good");
  const [description, setDescription] = useState("");
  
  // Existing Images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // New Images added during edit
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.sellerId !== user?.uid) {
            alert("You are not authorized to edit this listing.");
            router.push("/dashboard/marketplace");
            return;
          }
          setTitle(data.title);
          setPrice(data.price.toString());
          setCategory(data.category);
          setCondition(data.condition);
          setDescription(data.description);
          setExistingImages(data.images || []);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsFetching(false);
      }
    };
    if (user?.uid) {
      fetchProduct();
    }
  }, [productId, user?.uid, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const totalImages = existingImages.length + newImages.length;
      const selectedFiles = Array.from(e.target.files).slice(0, 4 - totalImages);
      setNewImages((prev) => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
      setNewPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
    setNewPreviewUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in.");
    if (existingImages.length === 0 && newImages.length === 0) return alert("Please add at least one photo.");

    setIsLoading(true);
    try {
      const uploadedImageUrls: string[] = [...existingImages];

      // Compress and convert new images to Base64
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        
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

      await updateDoc(doc(db, "products", productId), {
        title,
        price: Math.round(Number(price)),
        category,
        condition,
        description,
        images: uploadedImageUrls,
      });

      router.push(`/dashboard/marketplace/product/${productId}`);
    } catch (error) {
      console.error(error);
      alert("Something went wrong saving the post.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 font-sans">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/dashboard/marketplace/product/${productId}`} className="text-gray-500 hover:text-gray-900 flex items-center gap-1 font-medium transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>
          <h1 className="font-bold text-lg text-gray-900">Edit Item</h1>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Photos</h2>
            <p className="text-gray-500 text-sm mb-4">Add up to 4 photos. The first photo will be your cover.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Existing Images */}
              {existingImages.map((url, idx) => (
                <div key={`existing-${idx}`} className="aspect-square rounded-xl overflow-hidden relative group bg-gray-100 border border-gray-200">
                  <img src={url} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeExistingImage(idx)}
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

              {/* New Images */}
              {newPreviewUrls.map((url, idx) => (
                <div key={`new-${idx}`} className="aspect-square rounded-xl overflow-hidden relative group bg-gray-100 border border-gray-200">
                  <img src={url} alt={`New Preview ${idx}`} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-2 right-2 bg-white/90 text-gray-900 p-1.5 rounded-full shadow-sm hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              
              {totalImages < 4 && (
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">What are you selling?</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., Engineering Drafter, Mini Fridge" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <input 
                type="number" 
                required 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="0" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-medium text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 cursor-pointer"
                >
                  <option>Electronics</option>
                  <option>Books</option>
                  <option>Hostel Gear</option>
                  <option>Stationery</option>
                  <option>Clothing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Condition</label>
                <select 
                  value={condition} 
                  onChange={e => setCondition(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 cursor-pointer"
                >
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>Needs Repair</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea 
                required 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Describe the item (any flaws, how old it is, reason for selling)..." 
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Saving Changes...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
