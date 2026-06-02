"use client";

import { useState, useEffect, Suspense } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, Image as ImageIcon, CheckCircle2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, getDocs, doc, setDoc } from "firebase/firestore";
import { useSearchParams, useRouter } from "next/navigation";

function ChatContent() {
  const { user } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initProductId = searchParams.get("product");
  const initSellerId = searchParams.get("seller");

  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgInput, setMsgInput] = useState("");

  // Load Chats
  useEffect(() => {
    if (!user) return;
    
    // In a real app we query where buyerId == uid OR sellerId == uid
    // Firestore OR queries are complex, for simplicity we listen to all where user is involved
    const q1 = query(collection(db, "chats"), where("buyerId", "==", user.uid));
    const q2 = query(collection(db, "chats"), where("sellerId", "==", user.uid));
    
    const unsubs: any[] = [];
    const chatMap = new Map();

    const handleSnap = (snapshot: any) => {
      snapshot.docs.forEach((doc: any) => {
        chatMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
      setChats(Array.from(chatMap.values()).sort((a,b) => b.lastMessageTime?.toMillis() - a.lastMessageTime?.toMillis()));
    };

    unsubs.push(onSnapshot(q1, handleSnap));
    unsubs.push(onSnapshot(q2, handleSnap));

    return () => unsubs.forEach(u => u());
  }, [user]);

  // Handle Initial Routing (Chat to Buy)
  useEffect(() => {
    if (initProductId && initSellerId && user && chats.length > 0) {
      // Check if chat exists
      const existing = chats.find(c => c.productId === initProductId && (c.buyerId === user.uid || c.sellerId === user.uid));
      if (existing) {
        setActiveChat(existing);
      } else {
        // Create new chat
        const createChat = async () => {
           const newChatId = `${initProductId}_${user.uid}`;
           await setDoc(doc(db, "chats", newChatId), {
             productId: initProductId,
             buyerId: user.uid,
             sellerId: initSellerId,
             buyerName: user.name,
             productName: "Item via Marketplace",
             lastMessage: "Interested!",
             lastMessageTime: serverTimestamp()
           });
        };
        createChat();
      }
    }
  }, [initProductId, initSellerId, user, chats]);

  // Load Messages for Active Chat
  useEffect(() => {
    if (!activeChat) return;
    const q = query(collection(db, "chats", activeChat.id, "messages"), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsub();
  }, [activeChat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeChat || !user) return;
    
    const text = msgInput;
    setMsgInput("");

    await addDoc(collection(db, "chats", activeChat.id, "messages"), {
      text,
      senderId: user.uid,
      timestamp: serverTimestamp()
    });

    // Update last message
    await setDoc(doc(db, "chats", activeChat.id), {
      lastMessage: text,
      lastMessageTime: serverTimestamp()
    }, { merge: true });
  };

  if (!user) return <div className="p-10 text-white">Please login to access chats.</div>;

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      {/* Left: Chat List */}
      <GlassCard className="w-full md:w-1/3 h-full flex flex-col p-0 overflow-hidden" hoverEffect={false}>
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => {
            const isMeBuyer = chat.buyerId === user.uid;
            const displayName = isMeBuyer ? "Seller" : chat.buyerName;
            
            return (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${activeChat?.id === chat.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{displayName}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate max-w-[80%]">{chat.lastMessage}</p>
                </div>
                <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"/> {chat.productName}
                </p>
              </div>
            );
          })}
          {chats.length === 0 && <div className="p-6 text-gray-500 text-center">No active chats.</div>}
        </div>
      </GlassCard>

      {/* Right: Active Chat Thread */}
      {activeChat ? (
        <GlassCard className="hidden md:flex w-2/3 h-full flex-col p-0 overflow-hidden relative" hoverEffect={false}>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center z-10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                {(activeChat.buyerId === user.uid ? "S" : activeChat.buyerName?.charAt(0)) || "U"}
              </div>
              <div>
                <h2 className="font-bold text-gray-900 flex items-center gap-1">
                  {activeChat.buyerId === user.uid ? "Seller" : activeChat.buyerName} <CheckCircle2 size={14} className="text-green-500"/>
                </h2>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-500 transition" title="Report/Block User">
              <ShieldAlert size={20} />
            </button>
          </div>

          <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-indigo-600">Negotiating: {activeChat.productName}</span>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col bg-gray-50/50">
            <AnimatePresence>
              {messages.map(msg => {
                const isMe = msg.senderId === user.uid;
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    layout
                    className={`flex flex-col max-w-[70%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                  >
                    <div className={`p-3 rounded-2xl shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white z-10">
            <form onSubmit={handleSend} className="flex gap-2 items-center">
              <button type="button" className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition shrink-0">
                <ImageIcon size={20} />
              </button>
              <input 
                type="text" 
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-gray-100 border border-gray-200 rounded-full py-3 px-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <button 
                type="submit" 
                disabled={!msgInput.trim()}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition shrink-0 shadow-sm"
              >
                <Send size={18} className="ml-1" />
              </button>
            </form>
          </div>

        </GlassCard>
      ) : (
        <div className="hidden md:flex w-2/3 h-full items-center justify-center text-gray-500 bg-gray-50/50 rounded-2xl border border-gray-200">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
