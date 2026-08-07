"use client";

import { useEffect, useState } from "react";
import { Trash2, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", targetUserId: id })
      });
      if (res.ok) {
        toast.success("User deleted");
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error("Failed to delete user");
      }
    } catch (err) {
      toast.error("Error occurred");
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-500">Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
      <h1 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
        <UserIcon className="text-brand" /> Manage Users
      </h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="py-3 px-4 font-semibold text-sm">Name</th>
              <th className="py-3 px-4 font-semibold text-sm">Email</th>
              <th className="py-3 px-4 font-semibold text-sm">Role</th>
              <th className="py-3 px-4 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="py-3 px-4 font-medium text-stone-900">{user.name}</td>
                <td className="py-3 px-4 text-stone-600 text-sm">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-xs font-bold uppercase rounded-full ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-600'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-stone-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
