"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";

interface ChatRoomProps {
    orderId: string;
    orderStatus: string;
    userId: string;
    userType: string;
    onClose: () => void;
}

export default function ChatRoom({ orderId, orderStatus, userId, userType, onClose }: ChatRoomProps) {
    const [text, setText] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // live messages (query is now listByOrder)
    const messages = useQuery(api.messages.listByOrder, { orderId }) || [];

    // send message mutation
    const sendMessage = useMutation(api.messages.create);

    const handleSend = async () => {
        if (!text.trim()) return;
        await sendMessage({ orderId, senderId: userId, text });
        setText("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900 bg-opacity-50 backdrop-blur-sm">
            <div className="relative flex flex-col w-full max-w-lg h-full sm:h-3/4 md:h-[80vh] rounded-xl bg-white p-4 sm:p-6 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Order Chat with {(userType == 'Restaurant') ? 'NGO' : 'Restaurant'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <XCircle size={24} />
                    </button>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
                    {messages.map((m) => {
                        const time = new Date(m._creationTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        return (
                            <div
                                key={m._id}
                                className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"} animate-chat-in`}
                            >
                                <div
                                    className={`p-3 rounded-xl max-w-[75%] shadow-md flex flex-col transition-all duration-300 ease-in-out ${m.senderId === userId
                                        ? "bg-blue-500 text-white rounded-br-sm"
                                        : "bg-gray-200 text-gray-800 rounded-bl-sm"
                                        }`}
                                >
                                    <div className="text-sm">{m.text}</div>
                                    <div
                                        className={`self-end text-xs mt-1 leading-none ${m.senderId === userId ? "text-blue-100" : "text-gray-500"
                                            }`}
                                    >
                                        {time}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Container */}
                {orderStatus == 'accepted' &&
                    <div className="flex gap-2 mt-4">
                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 bg-gray-100 text-gray-900 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}