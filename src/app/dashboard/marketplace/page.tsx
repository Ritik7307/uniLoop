"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, Plus, Heart, MapPin, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const CATEGORIES = ["All", "Electronics", "Books", "Stationery", "Vehicles", "Hostel Gear"];

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState("sale"); // "sale", "lost_found", "gigs"
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(docs);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    
    // Default backward compatibility: if listingType is undefined, assume 'sale'
    const lType = p.listingType || 'sale';
    
    let matchViewMode = false;
    if (viewMode === "sale") matchViewMode = lType === "sale";
    if (viewMode === "lost_found") matchViewMode = lType === "lost" || lType === "found";
    if (viewMode === "gigs") matchViewMode = lType === "service";

    return matchCategory && matchSearch && matchViewMode && p.status === "available";
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Campus Hub</h1>
          <p className="text-gray-500 mt-2">Discover items, find lost goods, or hire skills.</p>
        </div>
        
        <Link href="/dashboard/marketplace/list">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition shadow-md">
            <Plus size={20} /> Create Post
          </button>
        </Link>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {[
          { id: "sale", label: "Marketplace" },
          { id: "lost_found", label: "Lost & Found" },
          { id: "gigs", label: "Gigs & Services" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id)}
            className={`py-3 px-4 text-sm font-bold border-b-2 transition ${
              viewMode === tab.id 
                ? "border-indigo-600 text-indigo-600" 
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text" 
            placeholder="Search..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 py-3 pl-12 pr-4 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
          />
        </div>
        <button className="bg-white border border-gray-200 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition flex items-center gap-2 shrink-0 shadow-sm">
          <Filter size={20} /> Filters
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat 
              ? "bg-indigo-600 text-white shadow-md" 
              : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={product.id}
              >
                <Link href={`/dashboard/marketplace/product/${product.id}`}>
                  <GlassCard className="p-0 overflow-hidden group cursor-pointer h-full flex flex-col bg-white border-gray-200 shadow-sm hover:shadow-md transition" hoverEffect={false}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100 border-b border-gray-200">
                      <img 
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1594213114663-d94af78cbdb4?auto=format&fit=crop&q=80&w=400"} 
                        alt={product.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {product.listingType === 'lost' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold shadow-sm">LOST</div>
                      )}
                      {product.listingType === 'found' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-bold shadow-sm">FOUND</div>
                      )}
                      {product.listingType === 'service' && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold shadow-sm">SERVICE</div>
                      )}

                      <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 transition shadow-sm" onClick={(e) => { e.preventDefault(); /* Handle Wishlist */ }}>
                        <Heart size={18} />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-gray-900 flex items-center gap-1 border border-gray-200 shadow-sm">
                        <MapPin size={12} className="text-indigo-600" /> {product.hostel}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                      </div>
                      <div className="text-xl font-extrabold text-gray-900">
                        {product.listingType === 'sale' ? `₹${product.price}` : product.listingType === 'service' ? `₹${product.price} / hr` : 'Reward info inside'}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No items found in this section.
        </div>
      )}
    </div>
  );
}
