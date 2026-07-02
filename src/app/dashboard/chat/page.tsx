"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { Send, Image as ImageIcon, CheckCircle2, ShieldAlert, ArrowLeft, Loader2, X, MessageCircle, MoreVertical, Trash2, UserX } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useSearchParams, useRouter } from "next/navigation";
import imageCompression from 'browser-image-compression';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

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
  const [isUploading, setIsUploading] = useState(false);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chats on mount and poll
  const fetchChats = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/chats');
      if (res.ok) {
        const data = await res.json();
        const formatted = data.chats.map((c: any) => ({ ...c, id: c._id }));
        setChats(formatted);
        
        // Update activeChat messages if it's currently selected
        if (activeChat) {
          const updatedChat = formatted.find((c: any) => c.id === activeChat.id);
          if (updatedChat) {
            setMessages(updatedChat.messages || []);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
    // Poll every 5 seconds for new messages
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [user, activeChat?.id]);

  // Handle Initializing New Chat from URL Params
  useEffect(() => {
    const initChat = async () => {
      if (!user || !initProductId || !initSellerId) return;
      try {
        // Fetch product details to get name
        const prodRes = await fetch(`/api/products/${initProductId}`);
        let productName = "Item";
        if (prodRes.ok) {
          const pData = await prodRes.json();
          productName = pData.product?.title || "Item";
        }

        const res = await fetch('/api/chats', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: initProductId,
            sellerId: initSellerId,
            buyerName: user.name,
            productName: productName
          })
        });
        if (res.ok) {
          const data = await res.json();
          const chatData = { ...data.chat, id: data.chat._id };
          setActiveChat(chatData);
          setMessages(chatData.messages || []);
          setIsMobileListVisible(false);
          // Remove URL params to avoid re-triggering
          router.replace('/dashboard/chat');
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error);
      }
    };
    initChat();
  }, [user, initProductId, initSellerId, router]);

  // Load Messages for Active Chat when manually selected
  useEffect(() => {
    if (!activeChat) return;
    setMessages(activeChat.messages || []);
  }, [activeChat]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim() || !activeChat || !user) return;

    const text = msgInput.trim();
    setMsgInput("");

    // Optimistic UI Update
    const optimisticMsg = { id: Date.now().toString(), text, type: "text", senderId: user.id, timestamp: new Date() };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text, type: "text" })
      });
      fetchChats(); // Refresh to get official timestamp & sync
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !activeChat || !user) return;

    setIsUploading(true);
    const file = e.target.files[0];

    try {
      const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const base64String = await blobToBase64(compressedFile);

      // Optimistic Update
      const optimisticMsg = { id: Date.now().toString(), imageUrl: base64String, type: "image", senderId: user.id, timestamp: new Date() };
      setMessages(prev => [...prev, optimisticMsg]);

      await fetch(`/api/chats/${activeChat.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: base64String, type: "image" })
      });
      fetchChats();
    } catch (error) {
      console.error("Error sending image:", error);
      alert("Failed to send image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectChat = (chat: any) => {
    setActiveChat(chat);
    setIsMobileListVisible(false);
    setIsMenuOpen(false);
  };

  const handleDeleteChat = async () => {
    if (!activeChat || !user) return;
    if (!confirm("Are you sure you want to delete this chat? It will be hidden until a new message arrives.")) return;

    try {
      await fetch(`/api/chats/${activeChat.id}/delete`, {
        method: 'POST'
      });
      setActiveChat(null);
      setIsMenuOpen(false);
      fetchChats();
    } catch (err) {
      console.error(err);
      alert("Failed to delete chat.");
    }
  };

  const handleBlockUser = async () => {
    if (!activeChat || !user) return;
    const targetUserId = activeChat.buyerId === user.id ? activeChat.sellerId : activeChat.buyerId;
    if (!confirm("Are you sure you want to block this user? They will not be able to message you.")) return;

    try {
      const res = await fetch(`/api/users/block`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ targetUserId })
      });
      if (res.ok) {
        alert("User blocked successfully.");
        setIsMenuOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to block user.");
    }
  };

  if (!user) return <div className="p-10 text-slate-700 bg-slate-50 min-h-screen text-center font-bold">Please login to access chats.</div>;

  return (
    <div className="h-full w-full bg-slate-50 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto h-full flex bg-white sm:border border-slate-200 sm:rounded-3xl shadow-sm overflow-hidden">

        {/* Left: Chat List */}
        <div className={`w-full md:w-1/3 flex-col border-r border-slate-200 ${isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
          <div className="p-5 border-b border-slate-100 bg-white/80 backdrop-blur-md">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto bg-white scrollbar-hide">
            {chats.map(chat => {
              const isMeBuyer = chat.buyerId === user.id;
              const displayName = isMeBuyer ? "Seller" : chat.buyerName;
              const isActive = activeChat?.id === chat.id;

              const date = chat.lastMessageTime ? new Date(chat.lastMessageTime) : null;
              const timeString = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

              return (
                <div
                  key={chat.id}
                  onClick={() => selectChat(chat)}
                  className={`p-5 border-b border-slate-50 cursor-pointer transition-all ${isActive ? 'bg-brand/5 border-l-4 border-l-brand' : 'hover:bg-slate-50 bg-white border-l-4 border-l-transparent'}`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className={`font-bold truncate ${isActive ? 'text-brand' : 'text-slate-900'}`}>{displayName}</h3>
                    {timeString && <span className="text-[10px] font-bold text-slate-400 shrink-0 uppercase">{timeString}</span>}
                  </div>
                  <p className="text-sm font-medium text-slate-500 truncate mb-3">{chat.lastMessage}</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 tracking-wide uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    <span className="truncate">{chat.productName}</span>
                  </div>
                </div>
              );
            })}
            {chats.length === 0 && <div className="p-8 text-slate-500 text-center text-sm font-medium">No active conversations.</div>}
          </div>
        </div>

        {/* Right: Active Chat Thread */}
        <div className={`w-full md:w-2/3 flex-col bg-slate-50 ${!isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 sm:px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsMobileListVisible(true)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center text-lg font-extrabold text-brand relative">
                    {(activeChat.buyerId === user.id ? "S" : activeChat.buyerName?.charAt(0)) || "U"}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-lg tracking-tight">
                      {activeChat.buyerId === user.id ? "Seller" : activeChat.buyerName}
                      <CheckCircle2 size={16} className="text-brand" />
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mt-0.5">
                      {activeChat.buyerId === user.id ? activeChat.sellerEmail : activeChat.buyerEmail}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mt-0.5">
                      Discussing <span className="text-slate-900">{activeChat.productName}</span>
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shadow-sm border border-transparent"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <button 
                        onClick={handleDeleteChat}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium border-b border-slate-100"
                      >
                        <Trash2 size={16} />
                        Delete Chat
                      </button>
                      <button 
                        onClick={handleBlockUser}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
                      >
                        <UserX size={16} />
                        Block User
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 flex flex-col scrollbar-hide">
                {messages.length === 0 && (
                  <div className="m-auto text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-sm">
                    <h3 className="font-extrabold text-slate-900 mb-2 text-lg">Start the conversation</h3>
                    <p className="text-sm font-medium text-slate-500">Send a message or make an offer for {activeChat.productName}.</p>
                  </div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.id;
                  const showTimestamp = idx === messages.length - 1 || messages[idx + 1]?.senderId !== msg.senderId;
                  const date = msg.timestamp ? new Date(msg.timestamp) : null;
                  const timeStr = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

                  return (
                    <div key={msg.id} className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                      <div className={`px-5 py-3.5 rounded-2xl shadow-sm ${isMe
                        ? 'bg-brand text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                        }`}>
                        {msg.type === 'image' && msg.imageUrl ? (
                          <img src={msg.imageUrl} alt="Sent image" className="max-w-full rounded-xl mb-1 cursor-pointer hover:opacity-90 transition-opacity border border-black/5" />
                        ) : (
                          <p className="text-[15px] font-medium leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                        )}
                      </div>
                      {showTimestamp && timeStr && (
                        <span className={`text-[10px] font-bold uppercase text-slate-400 mt-1 ${isMe ? 'mr-1' : 'ml-1'}`}>{timeStr}</span>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:px-6 border-t border-slate-200 bg-white">
                <form onSubmit={handleSendText} className="flex gap-3 items-center bg-slate-50 border border-slate-200 rounded-full pl-3 pr-2 py-2 focus-within:ring-2 focus-within:ring-brand/50 focus-within:border-brand transition-all shadow-inner">
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleSendImage} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2.5 text-slate-400 hover:text-brand hover:bg-brand/10 rounded-full transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
                  </button>
                  <input
                    type="text"
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-[15px] text-slate-900 placeholder-slate-400 py-2 px-2 min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={!msgInput.trim()}
                    className="p-3 bg-brand hover:bg-brand-dark disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shrink-0 shadow-sm flex items-center justify-center"
                  >
                    <Send size={18} className="-ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50">
              <div className="w-20 h-20 bg-slate-200 rounded-2xl flex items-center justify-center mb-6 text-slate-400 shadow-sm">
                <MessageCircle size={36} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Your Messages</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">Select a conversation from the list to start chatting with buyers or sellers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
