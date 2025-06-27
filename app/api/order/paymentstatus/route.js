import connectDB from "../../../../config/db";
import { NextResponse } from "next/server"
import Order from "../../../../models/Order.js";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { payment, orderId } = body;

        await Order.findByIdAndUpdate(orderId, { payment });
        return NextResponse.json({ success: true, message:'Payment Status Updated'});
    
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}