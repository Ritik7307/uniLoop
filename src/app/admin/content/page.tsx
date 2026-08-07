"use client";

import { useEffect, useState } from "react";
import { Trash2, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminContentPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}? This cannot be undone.`)) return;
    
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", targetId: id, type })
      });
      if (res.ok) {
        toast.success(`${type} deleted`);
        if (type === 'product') {
          setProducts(products.filter(p => p._id !== id));
        } else {
          setProjects(projects.filter(p => p._id !== id));
        }
      } else {
        toast.error("Failed to delete content");
      }
    } catch (err) {
      toast.error("Error occurred");
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading content...</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <Package className="text-brand" /> Manage Content
      </h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-3 px-4 font-semibold text-sm">Title</th>
                <th className="py-3 px-4 font-semibold text-sm">Seller ID</th>
                <th className="py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-stone-900">{item.title}</td>
                  <td className="py-3 px-4 text-stone-600 text-sm truncate max-w-[150px]">{item.sellerId}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleDelete(item._id, 'product')}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-stone-500">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-4">Projects</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="py-3 px-4 font-semibold text-sm">Title</th>
                <th className="py-3 px-4 font-semibold text-sm">Author ID</th>
                <th className="py-3 px-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((item) => (
                <tr key={item._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="py-3 px-4 font-medium text-stone-900">{item.title}</td>
                  <td className="py-3 px-4 text-stone-600 text-sm truncate max-w-[150px]">{item.userId}</td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => handleDelete(item._id, 'project')}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Delete Project"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-stone-500">No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
