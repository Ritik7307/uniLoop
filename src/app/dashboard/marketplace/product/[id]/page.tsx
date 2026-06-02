"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, MessageCircle, MapPin, ShieldCheck, Heart, Clock, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useStore } from "@/store/useStore";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { user } = useStore();
  
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-gray-400">
        <h2 className="text-2xl font-bold mb-2 text-white">Item not found</h2>
        <p>This listing might have been removed or sold.</p>
        <button onClick={() => router.back()} className="mt-6 text-indigo-400 hover:text-white">Go back</button>
      </div>
    );
  }

  // Format date safely
  const dateObj = product.createdAt?.toDate ? product.createdAt.toDate() : new Date();
  const postedAt = dateObj.toLocaleDateString();

  const isOwner = user?.uid === product.sellerId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteDoc(doc(db, "products", product.id));
      router.push("/dashboard/marketplace");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition"
      >
        <ArrowLeft size={20} /> Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div className="space-y-4">
          <GlassCard className="p-0 overflow-hidden aspect-square border-gray-200 bg-gray-50" hoverEffect={false}>
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={product.images?.[activeImage] || "https://images.unsplash.com/photo-1594213114663-d94af78cbdb4"} 
              alt="Product" 
              className="w-full h-full object-cover"
            />
          </GlassCard>
          
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto">
              {product.images.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col items-start gap-2">
                {product.listingType === 'lost' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide">Lost Item</span>}
                {product.listingType === 'found' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Found Item</span>}
                {product.listingType === 'service' && <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wide">Service Offered</span>}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
              </div>
              {!isOwner && (
                <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-red-500 transition text-gray-500 shrink-0">
                  <Heart size={24} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 mt-4 text-sm text-gray-500">
              <span className="px-3 py-1 bg-indigo-50 rounded-full text-indigo-700 border border-indigo-100">{product.category}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {postedAt}</span>
              {product.status === "available" && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={14} /> Available</span>}
            </div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-4xl md:text-5xl font-extrabold text-gray-900">
              {product.listingType === 'sale' || !product.listingType ? `₹${product.price}` : product.listingType === 'service' ? `₹${product.price} / hr` : 'Reward Negotiable'}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-200 text-gray-900 pb-2">Description & Location</h3>
            <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {product.listingType === 'sale' && (
              <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1 border border-gray-200 bg-gray-50">
                <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Condition</span>
                <span className="text-gray-900 font-medium">{product.condition}</span>
              </div>
            )}
            <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1 border border-gray-200 bg-gray-50">
              <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Hostel / Location</span>
              <span className="text-gray-900 font-medium flex items-center gap-1">
                <MapPin size={14} className="text-indigo-600"/> {product.hostel}
              </span>
            </div>
          </div>

          <GlassCard className="mt-auto p-5 bg-indigo-50 border-indigo-100 flex items-center justify-between" hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 uppercase border border-indigo-200">
                {product.sellerName?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-gray-900 font-semibold flex items-center gap-1">
                  {product.sellerName} {isOwner && "(You)"} <ShieldCheck size={16} className="text-green-500" />
                </p>
                <p className="text-xs text-gray-500">Verified User</p>
              </div>
            </div>
            
            {isOwner ? (
              <div className="flex items-center gap-3">
                <Link href={`/dashboard/marketplace/edit/${product.id}`}>
                  <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-bold transition shadow-sm">
                    Edit
                  </button>
                </Link>
                <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition border border-red-200 shadow-sm">
                  Delete
                </button>
              </div>
            ) : (
              <Link href={`/dashboard/chat?product=${product.id}&seller=${product.sellerId}`}>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md">
                  <MessageCircle size={20} /> Message
                </button>
              </Link>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
