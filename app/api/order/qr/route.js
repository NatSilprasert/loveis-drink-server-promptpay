import connectDB from "../../../../config/db";
import { NextResponse } from "next/server"
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();
        const { amount } = body;
        const mobileNumber = '0972373366'
        const payload = generatePayload(mobileNumber, { amount })
        const option = {
            color: {
                type: 'image/png',
            }
        }   
        

        try {
            const url = await QRCode.toDataURL(payload, option)
            return NextResponse.json({ success: true, qr: url })
        } catch (error) {
            console.log(error)
            return NextResponse.json({ success: false, message: error.message })
        }
    
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}