"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Heart, MapPin, Loader2, Tag } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

const CATEGORIES = ["All", "Electronics", "Books", "Stationery", "Vehicles", "Hostel Gear"];

export default function MarketplacePage() {
  const { user } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("sale"); // "sale", "lost_found", "gigs"
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return; 
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok) {
          // Map _id to id for frontend compatibility
          const formatted = data.products.map((p: any) => ({ ...p, id: p._id }));
          setProducts(formatted);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    
    const lType = p.listingType || 'sale';
    
    let matchViewMode = false;
    if (viewMode === "sale") matchViewMode = lType === "sale" && p.status !== "sold";
    if (viewMode === "lost_found") matchViewMode = (lType === "lost" || lType === "found") && p.status !== "sold";
    if (viewMode === "gigs") matchViewMode = lType === "service" && p.status !== "sold";
    if (viewMode === "sold") matchViewMode = p.status === "sold";

    return matchCategory && matchSearch && matchViewMode;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Page Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Marketplace</h1>
              <p className="text-sm text-slate-500 mt-1 font-medium">Discover items, find lost goods, and hire talented students.</p>
            </div>
            <Link href="/dashboard/marketplace/list">
              <button className="bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-brand/20 hover:shadow-brand/40">
                <Plus size={18} />
                Create Listing
              </button>
            </Link>
          </div>

          {/* Main Navigation Tabs */}
          <div className="flex gap-4 md:gap-8 mt-8 border-b border-slate-100 overflow-x-auto scrollbar-hide whitespace-nowrap">
            {[
              { id: "sale", label: "For Sale" },
              { id: "lost_found", label: "Lost & Found" },
              { id: "gigs", label: "Gigs & Services" },
              { id: "sold", label: "Sold Items" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`pb-3 text-sm font-bold transition-colors relative ${
                  viewMode === tab.id 
                    ? "text-brand" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
                {viewMode === tab.id && (
                  <motion.span layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search listings..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/80 border border-slate-200 py-3 pl-10 pr-4 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all shadow-sm"
            />
          </div>

        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                activeCategory === cat 
                ? "bg-slate-800 text-white shadow-slate-200" 
                : "bg-white/80 border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white border border-slate-100 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 w-full" />
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-6 bg-slate-200 rounded-md w-1/3" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} key={product.id}>
              <Link href={`/dashboard/marketplace/product/${product.id}`} className="group">
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20 transition-all duration-300 h-full flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img 
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1594213114663-d94af78cbdb4?auto=format&fit=crop&q=80&w=400"} 
                      alt={product.title} 
                      className={`object-cover w-full h-full ${product.status !== 'sold' ? 'group-hover:scale-105 transition-transform duration-500' : 'opacity-80 grayscale-[50%]'}`}
                    />
                    
                    {/* Big Sold Overlay */}
                    {product.status === 'sold' && (
                      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] flex items-center justify-center z-20">
                        <div className="bg-white/95 px-6 py-2 rounded-2xl text-slate-900 text-xl font-black tracking-[0.2em] uppercase rotate-[-12deg] shadow-2xl border-4 border-slate-900/10">
                          SOLD
                        </div>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      {product.status !== 'sold' && product.listingType === 'lost' && (
                        <div className="px-2.5 py-1 bg-rose-500 text-white rounded-md text-[10px] font-bold tracking-wider shadow-sm">LOST</div>
                      )}
                      {product.status !== 'sold' && product.listingType === 'found' && (
                        <div className="px-2.5 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-bold tracking-wider shadow-sm">FOUND</div>
                      )}
                      {product.status !== 'sold' && product.listingType === 'service' && (
                        <div className="px-2.5 py-1 bg-brand text-white rounded-md text-[10px] font-bold tracking-wider shadow-sm">SERVICE</div>
                      )}
                    </div>
                    
                    {product.status !== 'sold' && (
                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10" onClick={(e) => { e.preventDefault(); }}>
                        <Heart size={16} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                      <Tag size={12} strokeWidth={2.5} /> {product.category}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-snug line-clamp-2 mb-1 group-hover:text-brand transition-colors">{product.title}</h3>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div className="font-extrabold text-xl text-slate-900 tracking-tight">
                        {product.listingType === 'sale' ? `₹${product.price}` : product.listingType === 'service' ? `₹${product.price}/hr` : 'Reward info'}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <MapPin size={14} /> {product.hostel}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              </motion.div>
            ))}
          </div>
        )}
        
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-32 bg-white/50 border border-slate-200 rounded-2xl border-dashed">
            <h3 className="text-base font-bold text-slate-900 mb-1">No listings found</h3>
            <p className="text-sm font-medium text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
