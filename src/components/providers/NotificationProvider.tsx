"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import toast, { Toaster } from "react-hot-toast";

export default function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const [lastCheck, setLastCheck] = useState<number>(Date.now());

  useEffect(() => {
    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const checkForNewMessages = async () => {
      try {
        const res = await fetch('/api/chats');
        
        if (!res.ok) return;
        
        const data = await res.json();
        let newestMessageTime = lastCheck;
        let hasNew = false;
        
        data.chats.forEach((chat: any) => {
          if (chat.messages && chat.messages.length > 0) {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const msgTime = new Date(lastMsg.timestamp).getTime();
            
            // Check if message is newer than our last check and NOT sent by us
            if (msgTime > lastCheck && lastMsg.senderId !== user.uid) {
              hasNew = true;
              if (msgTime > newestMessageTime) {
                newestMessageTime = msgTime;
              }
              
              const senderName = chat.buyerId === user.uid ? chat.sellerName || "Seller" : chat.buyerName;
              
              // In-app Toast Notification
              toast.success(`New message from ${senderName}`, {
                icon: '💬',
                duration: 4000,
                position: 'top-right'
              });

              // Browser Notification
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification(`New message from ${senderName}`, {
                  body: lastMsg.text || (lastMsg.type === 'image' ? "Sent an image" : "New message"),
                  icon: '/favicon.ico'
                });
              }
            }
          }
        });

        if (hasNew) {
          setLastCheck(newestMessageTime);
        }

      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };

    // Poll every 10 seconds for new messages
    const intervalId = setInterval(checkForNewMessages, 10000);
    return () => clearInterval(intervalId);
  }, [user, lastCheck]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
}
