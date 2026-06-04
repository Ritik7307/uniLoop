"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Wallet, Target, Plus, Receipt, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";

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

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort client-side since we need composite index for multiple where/orderBy
      data.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setExpenses(data);
      setIsLoading(false);
    });

    return () => unsub();
  }, [user]);

  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const percentSpent = Math.min((spent / monthlyBudget) * 100, 100);

  // Dynamic Chart Logic
  const categoryColors: Record<string, string> = {
    "Food": "#4f46e5", // indigo-600
    "Academics": "#818cf8", // indigo-400
    "Travel": "#c084fc", // purple-400
    "Other": "#fb923c", // orange-400
  };

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  let currentAngle = 0;
  const gradientStops = Object.entries(categoryTotals).map(([cat, amount]) => {
    const percentage = (amount/ spent) * 100;
    const color = categoryColors[cat] || "#6b7280";
    const stop = `${color} ${currentAngle}% ${currentAngle + percentage}%`;
    currentAngle += percentage;
    return stop;
  });

  const chartBackground = spent > 0 
    ? `conic-gradient(${gradientStops.join(", ")})` 
    : "#222";

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

    // Deduct from wallet balance
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

  if (!user) return <div className="text-white p-10">Please login.</div>;

  return (
    <div className="space-y-8 pt-9 animate-in fade-in duration-500 relative">
  <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

  <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full -z-10" />
  <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-400/10 blur-[120px] rounded-full -z-10" />
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Pocket Finance</h1>
        <p className="text-gray-500 mt-2">Track expenses, manage budgets, and hit savings goals.</p>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
  className="
    flex flex-col gap-4
    bg-white/80
    backdrop-blur-xl
    border border-white
    shadow-lg
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300">
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Current Balance</span>
            <Wallet size={20} className="text-indigo-600" />
          </div>
          <div className="flex justify-between items-end">
            <div className="text-4xl font-extrabold text-gray-900">₹{walletBalance}</div>
            <button onClick={() => setShowAddMoney(!showAddMoney)} className="bg-indigo-200/50 hover:bg-indigo-200 text-indigo-700 p-2 rounded-lg transition" title="Add Funds">
              <Plus size={16} />
            </button>
          </div>
          {showAddMoney ? (
             <div className="flex gap-2 mt-2 animate-in fade-in zoom-in duration-200">
               <input type="number" value={addAmount} onChange={e=>setAddAmount(e.target.value)} placeholder="Amount" className="w-full bg-white border border-gray-200 rounded-lg py-1.5 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
               <button onClick={handleAddMoney} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition">Add</button>
             </div>
          ) : (
             <div className="flex items-center gap-1 text-sm text-green-600 font-medium mt-1">
               <ArrowUpRight size={16} /> Tracked Live
             </div>
          )}
        </GlassCard>

       <GlassCard
  className="
    flex flex-col gap-4
    bg-white/80
    backdrop-blur-xl
    border border-white
    shadow-lg
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
          <div className="flex justify-between items-center text-gray-600">
            <span className="font-medium">Total Spent</span>
            <Receipt size={20} className="text-red-500" />
          </div>
          <div className="text-4xl font-extrabold text-gray-900">₹{spent}</div>
          <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
            of ₹{monthlyBudget} budget limit
          </div>
          
          <div className="h-2 w-full bg-gray-100 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentSpent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${percentSpent > 80 ? 'bg-red-500' : 'bg-indigo-600'}`}
            />
          </div>
        </GlassCard>

      <GlassCard
  className="
    flex flex-col gap-4
    bg-white/80
    backdrop-blur-xl
    border border-white
    shadow-lg
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
          <div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-medium">Savings Goal</span>
              <Target size={20} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-4">New Cycle Fund</div>
            <div className="text-sm text-gray-500 mt-1">₹1,500 saved of ₹4,500</div>
          </div>
          <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-sm shadow-sm">
            Deposit to Goal
          </button>
        </GlassCard>
      </div>

      {/* Smart Guidance Section */}
      <GlassCard
  className="
    bg-white/80
    backdrop-blur-xl
    border border-white
    shadow-lg
    hover:shadow-2xl
    hover:-translate-y-1
    transition-all
    duration-300
  "
  hoverEffect={false}
>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
            <TrendingUp size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Smart Guidance</h3>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              You have <strong className="text-gray-900">₹{walletBalance}</strong> left for the remaining <strong className="text-gray-900">{remainingDays} days</strong> of this month. 
              To avoid going broke, you should strictly limit your spending to a bare minimum of <strong className="text-green-600 font-bold">₹{dailySafeSpend} per day</strong>.
            </p>
            {highestCategory && (
              <p className="text-gray-600 text-sm mt-2 p-3 bg-white rounded-lg border border-gray-200">
                💡 <strong className="text-indigo-600">Insight:</strong> Your highest expense category is <strong className="text-gray-900">{highestCategory}</strong> (₹{categoryTotals[highestCategory]}). Consider finding cheaper alternatives here to extend your runway.
              </p>
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
        <GlassCard hoverEffect={false} className="flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
            <button onClick={() => setShowForm(!showForm)} className="text-indigo-600 hover:text-indigo-800 transition font-medium text-sm flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <Plus size={16} /> Add Entry
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAddExpense} className="mb-6 space-y-4 p-4 border border-gray-200 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                <input required type="number" placeholder="Amount (₹)" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-4">
                <select value={category} onChange={e=>setCategory(e.target.value)} className="flex-1 bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  <option value="Food">Food</option>
                  <option value="Academics">Academics</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition">Save</button>
              </div>
              <div className="flex flex-col gap-2 pt-3 border-t border-gray-200 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-pointer">
                  <input type="checkbox" checked={isSplit} onChange={e=>setIsSplit(e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                  Split this expense 50/50 with a roommate
                </label>
                {isSplit && (
                  <input required type="text" placeholder="Roommate's Name (e.g. Rahul)" value={roommateName} onChange={e=>setRoommateName(e.target.value)} className="w-full bg-white border border-indigo-300 rounded-lg py-2 px-3 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 mt-1 shadow-sm" />
                )}
              </div>
            </form>
          )}

          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {isLoading && <Loader2 className="animate-spin text-indigo-500 mx-auto mt-10" />}
            {!isLoading && expenses.length === 0 && <p className="text-center text-gray-500 mt-10">No expenses recorded yet.</p>}
            
            {expenses.map(exp => {
              const dateStr = exp.createdAt?.toDate ? exp.createdAt.toDate().toLocaleDateString() : "Just now";
              return (
                <div key={exp.id} className="
flex items-center justify-between
p-4
bg-white/80
backdrop-blur-lg
rounded-2xl
border border-white
shadow-sm
hover:shadow-lg
hover:-translate-y-1
hover:border-indigo-200
transition-all
duration-300
"> 
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 border border-gray-200 shadow-sm">
                      <ArrowDownRight size={18} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-semibold">{exp.title}</h3>
                      <p className="text-xs text-gray-500">{exp.category} • {dateStr}</p>
                    </div>
                  </div>
                  <div className="text-gray-900 font-bold">-₹{exp.amount}</div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Analytics Breakdown */}
        <GlassCard hoverEffect={false} className="flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Spending Analytics</h2>
          <div className="flex-1 flex items-center justify-center relative min-h-[250px]">
             {/* Dynamic CSS pie-chart */}
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ type: "spring" }}
               className="w-48 h-48 rounded-full shadow-md border-4 border-white relative transition-all duration-700"
               style={{ background: spent > 0 ? chartBackground : "#e5e7eb" }}
             >
               <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                 <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Total</span>
                 <span className="text-xl font-bold text-gray-900">₹{spent}</span>
               </div>
             </motion.div>
          </div>
          
          {/* Legend */}
          {spent > 0 && (
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {Object.entries(categoryTotals).map(([cat, amount]) => (
                <div key={cat} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: categoryColors[cat] || "#6b7280" }} /> 
                  <span className="font-medium">{cat}</span>
                  <span className="text-gray-500">₹{amount}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
