"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";

interface ChatRoomProps {
    orderId: string;
    userId: string;
}

export default function ChatRoom({ orderId, userId }: ChatRoomProps) {
    const [text, setText] = useState("");

    // live messages (query is now listByOrder)
    const messages = useQuery(api.messages.listByOrder, { orderId }) || [];

    // send message mutation
    const sendMessage = useMutation(api.messages.create);

    const handleSend = async () => {
        if (!text.trim()) return;
        await sendMessage({ orderId, senderId: userId, text });
        setText("");
    };

    return (
        <div className="flex flex-col h-full border rounded p-2">
            <div className="flex-1 overflow-y-auto space-y-2">
                {messages.map((m) => (
                    <div key={m._id} className="p-2 text-black border rounded">
                        <b>{m.senderId}</b>: {m.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 text-black border rounded px-2"
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
