import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { User } from "@/models/User";
import dbConnect from "@/lib/mongodb";
import Link from "next/link";
import { Shield, Users, Package } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth");
  }

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-stone-900">Access Denied</h1>
          <p className="text-stone-500">You must be an administrator to view this page.</p>
          <Link href="/">
            <button className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 pb-20 bg-stone-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col gap-2">
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-2 px-2">Admin Panel</h2>
            <Link href="/admin">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 transition">
                <Users size={18} />
                <span className="font-medium">Users</span>
              </div>
            </Link>
            <Link href="/admin/content">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 transition">
                <Package size={18} />
                <span className="font-medium">Content</span>
              </div>
            </Link>
          </nav>
        </aside>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
