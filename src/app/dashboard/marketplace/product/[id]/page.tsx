"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, MapPin, ShieldCheck, Heart, Clock, CheckCircle2, Loader2, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { user } = useStore();
  
  const [product, setProduct] = useState<any>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // Wait for user to avoid permission errors
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct({ id: data.product._id, ...data.product });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId, user]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-gray-500 space-y-4">
        <AlertCircle size={48} className="text-gray-400" />
        <h2 className="text-xl font-bold text-gray-900">Listing not found</h2>
        <p className="text-sm">This item might have been removed or sold.</p>
        <button onClick={() => router.back()} className="mt-4 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-medium">Go Back</button>
      </div>
    );
  }

  const dateObj = product.createdAt ? new Date(product.createdAt) : new Date();
  const postedAt = dateObj.toLocaleDateString();

  const isOwner = user && ((user as any).id === product.sellerId || user.uid === product.sellerId || user.name === product.sellerName);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'DELETE'
      });
      router.push("/dashboard/marketplace");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleToggleSold = async () => {
    if (!isOwner) return;
    setIsUpdatingStatus(true);
    const newStatus = product.status === "sold" ? "available" : "sold";
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      setProduct({ ...product, status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Marketplace
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="p-6 md:p-8 md:border-r border-gray-100 flex flex-col gap-4 bg-gray-50/50">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img 
                  src={product.images?.[activeImage] || "https://images.unsplash.com/photo-1594213114663-d94af78cbdb4"} 
                  alt={product.title} 
                  className="w-full h-full object-contain bg-white"
                />
                {product.status === 'sold' && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold tracking-wide shadow-sm">
                    SOLD
                  </div>
                )}
              </div>
              
              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img: string, idx: number) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-blue-600' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Actions */}
            <div className="p-6 md:p-10 flex flex-col h-full">
              
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Tag size={14} /> {product.category}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={14} /> {postedAt}
                </span>
              </div>

              <div className="flex justify-between items-start gap-4 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>
                {!isOwner && (
                  <button className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0">
                    <Heart size={22} />
                  </button>
                )}
              </div>

              <div className="mb-6">
                <span className="text-3xl font-extrabold text-gray-900">
                  {product.listingType === 'sale' || !product.listingType ? `₹${product.price}` : 'Reward Negotiable'}
                </span>
                {product.listingType === 'lost' && <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">Lost Item</span>}
                {product.listingType === 'found' && <span className="ml-3 px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold uppercase">Found Item</span>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.listingType === 'sale' && (
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-col gap-1">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Condition</span>
                    <span className="text-sm font-medium text-gray-900">{product.condition}</span>
                  </div>
                )}
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xs text-gray-500 uppercase font-semibold">Location</span>
                  <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-500"/> {product.hostel}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-10 flex-1">
                <h3 className="text-sm font-bold text-gray-900">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {/* Seller Info & Actions Card */}
              <div className="mt-auto border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700 uppercase">
                      {product.sellerName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        {product.sellerName} {isOwner && "(You)"} <ShieldCheck size={16} className="text-blue-600" />
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{product.sellerEmail}</p>
                      <p className="text-xs text-gray-400">Verified Student</p>
                    </div>
                  </div>
                </div>
                
                {isOwner ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={handleToggleSold}
                      disabled={isUpdatingStatus}
                      className={`flex-1 py-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                        product.status === 'sold' 
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {isUpdatingStatus ? <Loader2 className="animate-spin" size={18} /> : (product.status === 'sold' ? <><CheckCircle2 size={18}/> Relist as Available</> : "Mark as Sold")}
                    </button>
                    <div className="flex gap-3">
                      <Link href={`/dashboard/marketplace/edit/${product.id}`} className="flex-1">
                        <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-lg font-medium text-sm transition-colors shadow-sm">
                          Edit
                        </button>
                      </Link>
                      <button onClick={handleDelete} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 px-6 rounded-lg font-medium text-sm transition-colors shadow-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link href={`/dashboard/chat?product=${product.id}&seller=${product.sellerId}`}>
                    <button 
                      disabled={product.status === 'sold'}
                      className={`w-full py-3.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
                        product.status === 'sold' 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <MessageCircle size={18} /> 
                      {product.status === 'sold' ? 'Item Sold' : 'Message Seller'}
                    </button>
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
