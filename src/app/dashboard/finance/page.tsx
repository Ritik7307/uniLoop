"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, Target, Plus, Receipt, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function FinanceDashboard() {
  const { user, walletBalance, monthlyBudget, setWalletBalance } = useStore();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Money State
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  // New Expense Form State
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [isSplit, setIsSplit] = useState(false);
  const [roommateName, setRoommateName] = useState("");

  // Filter State
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setExpenses(data);
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const percentSpent = Math.min((spent / monthlyBudget) * 100, 100);

  // Recharts Data Logic
  const categoryColors: Record<string, string> = {
    "Food": "#000000",      // Black
    "Academics": "#ef4444", // Red
    "Travel": "#9ca3af",    // Gray-400
    "Other": "#e5e7eb",     // Gray-200
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: categoryTotals[key],
  }));

  const filteredExpenses = filterCategory === "All" 
    ? expenses 
    : expenses.filter(exp => exp.category === filterCategory);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const expenseAmount = Number(amount);
    if (expenseAmount <= 0) return;

    let finalAmount = expenseAmount;
    let titleSuffix = "";

    if (isSplit && roommateName.trim()) {
      finalAmount = expenseAmount / 2;
      titleSuffix = ` (Split 50/50 with ${roommateName})`;
    }

    await addDoc(collection(db, "expenses"), {
      userId: user.uid,
      title: title + titleSuffix,
      amount: finalAmount,
      originalAmount: expenseAmount,
      isSplit,
      roommateName: isSplit ? roommateName : null,
      category,
      createdAt: serverTimestamp()
    });

    const newBalance = walletBalance - finalAmount;
    await updateDoc(doc(db, "users", user.uid), { walletBalance: newBalance });
    setWalletBalance(newBalance);

    setTitle("");
    setAmount("");
    setIsSplit(false);
    setRoommateName("");
    setShowForm(false);
  };

  const handleAddMoney = async () => {
    if (!user || !addAmount) return;
    const amountToAdd = Number(addAmount);
    if (amountToAdd <= 0) return;

    const newBalance = walletBalance + amountToAdd;
    await updateDoc(doc(db, "users", user.uid), { walletBalance: newBalance });
    setWalletBalance(newBalance);
    
    setAddAmount("");
    setShowAddMoney(false);
  };

  // Guidance Calculations
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const remainingDays = daysInMonth - currentDay + 1;
  const dailySafeSpend = remainingDays > 0 ? (walletBalance / remainingDays).toFixed(0) : walletBalance;
  
  const highestCategory = Object.keys(categoryTotals).length > 0 
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
    : null;

  if (!user) return <div className="text-gray-900 p-10 font-bold">Please login to view finance tracking.</div>;

  return (
    <div className="space-y-8 pt-9 animate-in fade-in duration-500 relative">
      <div className="fixed inset-0 -z-10 bg-gray-50" />
      
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Pocket Finance</h1>
        <p className="text-gray-500 mt-2">Track expenses, analyze your spending, and hit savings goals.</p>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col gap-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-xs">Current Balance</span>
            <Wallet size={18} className="text-gray-900" />
          </div>
          <div className="flex justify-between items-end mt-2">
            <div className="text-4xl font-extrabold text-gray-900">₹{walletBalance}</div>
            <button onClick={() => setShowAddMoney(!showAddMoney)} className="bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-lg transition" title="Add Funds">
              <Plus size={16} />
            </button>
          </div>
          {showAddMoney ? (
             <div className="flex gap-2 mt-2 animate-in fade-in zoom-in duration-200">
               <input type="number" value={addAmount} onChange={e=>setAddAmount(e.target.value)} placeholder="Amount" className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black" />
               <button onClick={handleAddMoney} className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition">Add</button>
             </div>
          ) : (
             <div className="flex items-center gap-1 text-sm text-green-600 font-medium mt-1">
               <ArrowUpRight size={16} /> Tracked Live
             </div>
          )}
        </GlassCard>

        <GlassCard className="flex flex-col gap-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center text-gray-500">
            <span className="font-semibold uppercase tracking-wider text-xs">Total Spent</span>
            <Receipt size={18} className="text-red-500" />
          </div>
          <div className="text-4xl font-extrabold text-gray-900 mt-2">₹{spent}</div>
          <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
            of ₹{monthlyBudget} monthly budget
          </div>
          
          <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentSpent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${percentSpent > 80 ? 'bg-red-500' : 'bg-black'}`}
            />
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex justify-between items-center text-gray-500">
              <span className="font-semibold uppercase tracking-wider text-xs">Savings Goal</span>
              <Target size={18} className="text-gray-900" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-4">New Cycle Fund</div>
            <div className="text-sm text-gray-500 mt-1">₹1,500 saved of ₹4,500</div>
          </div>
          <button className="w-full mt-auto py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition text-sm shadow-sm">
            Deposit to Goal
          </button>
        </GlassCard>
      </div>

      {/* Smart Guidance Section */}
      <GlassCard className="border border-gray-200 shadow-sm bg-white" hoverEffect={false}>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-gray-100 rounded-xl text-gray-900 shrink-0 shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Smart Guidance</h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              You have <strong className="text-gray-900 font-bold">₹{walletBalance}</strong> left for the remaining <strong className="text-gray-900 font-bold">{remainingDays} days</strong> of this month. 
              To avoid going broke, you should strictly limit your spending to a bare minimum of <strong className="text-red-500 font-bold">₹{dailySafeSpend} per day</strong>.
            </p>
            {highestCategory && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm">
                <strong className="text-gray-900">Insight:</strong> Your highest expense category is <strong className="text-red-500">{highestCategory}</strong> (₹{categoryTotals[highestCategory]}). Consider finding cheaper alternatives here to extend your runway.
              </div>
            )}
            {walletBalance < 500 && walletBalance > 0 && (
              <div className="mt-3 text-red-600 text-sm font-medium flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle size={18} /> Emergency: Low balance detected. Freeze all non-essential spending.
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Transactions */}
        <GlassCard hoverEffect={false} className="flex flex-col h-full min-h-[400px] border border-gray-200 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <button onClick={() => setShowForm(!showForm)} className="text-gray-900 hover:text-white hover:bg-black transition font-medium text-sm flex items-center gap-1 bg-white px-3 py-1.5 rounded-full border border-gray-300 shadow-sm">
              <Plus size={16} /> Add Entry
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {["All", "Food", "Academics", "Travel", "Other"].map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${filterCategory === cat ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {showForm && (
            <form onSubmit={handleAddExpense} className="mb-6 space-y-4 p-4 border border-gray-200 bg-gray-50 rounded-xl shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black shadow-sm" />
                <input required type="number" placeholder="Amount (₹)" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black shadow-sm" />
              </div>
              <div className="flex gap-4">
                <select value={category} onChange={e=>setCategory(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black shadow-sm">
                  <option value="Food">Food</option>
                  <option value="Academics">Academics</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg text-sm transition shadow-sm">Save</button>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={isSplit} onChange={e=>setIsSplit(e.target.checked)} className="rounded border-gray-300 text-black focus:ring-black w-4 h-4 cursor-pointer" />
                  Split this expense 50/50 with a roommate
                </label>
                {isSplit && (
                  <input required type="text" placeholder="Roommate's Name (e.g. Rahul)" value={roommateName} onChange={e=>setRoommateName(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-black mt-1 shadow-sm" />
                )}
              </div>
            </form>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {isLoading && <Loader2 className="animate-spin text-gray-400 mx-auto mt-10" />}
            {!isLoading && filteredExpenses.length === 0 && <p className="text-center text-gray-500 mt-10">No expenses found for {filterCategory}.</p>}
            
            {filteredExpenses.map((exp: any) => {
              const dateStr = exp.createdAt?.toDate ? exp.createdAt.toDate().toLocaleDateString() : "Just now";
              return (
                <div key={exp.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-300 transition-colors"> 
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 border border-gray-200 shadow-sm">
                      <ArrowDownRight size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold">{exp.title}</h3>
                      <p className="text-xs text-gray-500 font-medium">{exp.category} • {dateStr}</p>
                    </div>
                  </div>
                  <div className="text-gray-900 font-extrabold">-₹{exp.amount}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Analytics Breakdown */}
        <GlassCard hoverEffect={false} className="flex flex-col h-full min-h-[400px] border border-gray-200 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Monthly Breakdown</h2>
          <p className="text-sm text-gray-500 mb-6">Interactive view of your categorical spending.</p>
          
          <div className="flex-1 w-full min-h-[250px]">
            {spent > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={categoryColors[entry.name] || "#000"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₹${value}`, "Spent"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium">No data to display.</div>
            )}
          </div>
          
          {/* Legend */}
          {spent > 0 && (
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {Object.entries(categoryTotals).map(([cat, amount]: [string, any]) => {
                const percentage = ((amount / spent) * 100).toFixed(0);
                return (
                  <div key={cat} className="flex items-center gap-2 text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: categoryColors[cat] || "#6b7280" }} /> 
                    <span className="font-bold">{cat}</span>
                    <span className="text-gray-500 ml-2">₹{amount} <span className="text-xs text-gray-400">({percentage}%)</span></span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
