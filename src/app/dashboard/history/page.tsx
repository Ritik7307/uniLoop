
"use client";

import React, { useEffect, useState } from "react";
import { Clock, Package, CheckCircle, Tag } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function UserHistoryPage() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<"posted" | "sold" | "bought">("posted");

  const [historyData, setHistoryData] = useState<any>({
    posted: [],
    sold: [],
    bought: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();

        if (res.ok) {
          const formatItem = (p: any) => ({
            id: p._id,
            title: p.title,
            price: p.price,
            date: new Date(p.createdAt).toLocaleDateString(),
            status: p.status
          });

          const userId = (user as any).id || (user as any).uid || user.email; // Fallbacks

          const posted = data.products.filter((p: any) => p.sellerId === userId || p.sellerName === user.name).map(formatItem);
          const sold = data.products.filter((p: any) => (p.sellerId === userId || p.sellerName === user.name) && p.status === 'sold').map(formatItem);

          setHistoryData({ posted, sold, bought: [] });
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const currentList = historyData[activeTab];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My History</h1>
        <p className="text-slate-500 font-medium">Track all your posted items, sales, and purchases on UniLoop.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => setActiveTab("posted")}
            className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === "posted" ? "text-brand border-b-2 border-brand" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Posted Items
          </button>
          <button
            onClick={() => setActiveTab("sold")}
            className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === "sold" ? "text-brand border-b-2 border-brand" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Items Sold
          </button>
          <button
            onClick={() => setActiveTab("bought")}
            className={`flex-1 min-w-[120px] py-4 px-4 text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === "bought" ? "text-brand border-b-2 border-brand" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Items Bought
          </button>
        </div>

        {/* List */}
        <div className="p-6 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full text-slate-400 py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand mb-4"></div>
              <p className="font-medium">Loading history...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="text-center py-16">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No items found</h3>
              <p className="text-slate-500 font-medium">You don't have any {activeTab} items yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentList.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${activeTab === 'sold' ? 'bg-emerald-100 text-emerald-600' : activeTab === 'bought' ? 'bg-blue-100 text-brand' : 'bg-slate-200 text-slate-600'}`}>
                      {activeTab === 'sold' ? <CheckCircle size={24} /> : activeTab === 'bought' ? <Package size={24} /> : <Tag size={24} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.date}</span>
                        {item.status && <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] uppercase tracking-wider">{item.status}</span>}
                        {item.buyer && <span>Sold to: {item.buyer}</span>}
                        {item.seller && <span>Bought from: {item.seller}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-xl">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

