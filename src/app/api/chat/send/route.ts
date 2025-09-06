import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { orderId, text } = await req.json();

        const senderId = req.headers.get("x-user-id");
        const userType = req.headers.get("x-user-type");

        if (!senderId || !userType) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Call Convex internal mutation via deploy key
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
        const deployKey = process.env.CONVEX_DEPLOY_KEY!;
        const res = await fetch(`${convexUrl}/api/run/internal/messages/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Convex ${deployKey}`,
            },
            body: JSON.stringify({
                args: { orderId, senderId, text },
                format: "json",
            }),
        });

        const data = await res.json();
        if (data.status !== "success") {
            console.error("Convex error:", data);
            return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
        }

        return NextResponse.json({ id: data.value }, { status: 200 });
    } catch (err: any) {
        console.error("Chat send error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
