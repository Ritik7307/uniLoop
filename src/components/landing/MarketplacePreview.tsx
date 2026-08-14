"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";

const mockListings = [
  { id: 1, title: "Scientific Calculator", price: "₹450", seller: "Aman", category: "Electronics", loc: "Hostel 1", time: "2h ago", color: "bg-blue-50" },
  { id: 2, title: "Engineering Books", price: "₹700", seller: "Priya", category: "Books", loc: "Library", time: "5h ago", color: "bg-orange-50" },
  { id: 3, title: "Study Table", price: "₹1,200", seller: "Rahul", category: "Furniture", loc: "Hostel 3", time: "1d ago", color: "bg-green-50" },
  { id: 4, title: "Cycle", price: "₹3,500", seller: "Sneha", category: "Cycles", loc: "Main Gate", time: "2d ago", color: "bg-gray-100" },
  { id: 5, title: "Mini Fridge", price: "₹4,500", seller: "Vikram", category: "Room Essentials", loc: "Hostel 2", time: "3d ago", color: "bg-blue-100" },
  { id: 6, title: "Desk Lamp", price: "₹350", seller: "Neha", category: "Electronics", loc: "Hostel 4", time: "4d ago", color: "bg-yellow-50" },
];

export const MarketplacePreview = () => {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto" id="marketplace">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-uniloop-text)] tracking-tight">
            Recently on Campus
          </h2>
        </div>
        <button className="hidden md:flex items-center gap-2 font-bold text-[var(--color-uniloop-secondary)] hover:text-[var(--color-uniloop-text)] transition-colors">
          View Marketplace <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {mockListings.map((listing, idx) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            {/* Image Placeholder */}
            <div className={`w-full aspect-[4/3] rounded-2xl ${listing.color} mb-4 relative overflow-hidden`}>
              <div className="absolute inset-0 flex items-center justify-center text-black/10 font-black text-4xl transform -rotate-12 select-none group-hover:scale-110 transition-transform duration-500">
                {listing.category}
              </div>
              
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-uniloop-text)]">
                {listing.category}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-[var(--color-uniloop-text)] group-hover:text-[#E76F51] transition-colors line-clamp-1">
                  {listing.title}
                </h3>
                <span className="text-lg font-black text-[var(--color-uniloop-text)]">
                  {listing.price}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm font-medium text-[var(--color-uniloop-secondary)]">
                <span className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-uniloop-text)] text-[#F5EAE0] flex items-center justify-center text-[10px]">
                    {listing.seller[0]}
                  </div>
                  {listing.seller}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {listing.loc}
                </span>
                <span className="flex items-center gap-1 ml-auto opacity-70">
                  <Clock size={14} /> {listing.time}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-12 w-full md:hidden py-4 rounded-xl bg-[#F4A261]/20 text-[var(--color-uniloop-text)] font-bold flex items-center justify-center gap-2">
        View Marketplace <ArrowRight size={18} />
      </button>
    </section>
  );
};
