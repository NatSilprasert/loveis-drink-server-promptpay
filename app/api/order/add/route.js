import { v2 as cloudinary } from "cloudinary";
import connectDB from "../../../../config/db";
import { NextResponse } from "next/server"
import Order from "../../../../models/Order.js";
import User from "../../../../models/User.js";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export async function POST(request) {
    try {
        await connectDB();

        const formData = await request.formData();

        const seat = formData.get('seat');
        const round = formData.get('round');
        const amount = formData.get('amount');
        const orderItems = formData.get('orderItems')
        const username = formData.get('username');
        const time = formData.get('time');
        const slip = formData.get('slip');
        
        let slipUrl = "";

        if (slip) {
            // แปลง Blob เป็น Buffer
            const arrayBuffer = await slip.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // อัปโหลดขึ้น Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "slips" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            slipUrl = uploadResult.secure_url;
        }
        
        const paymentInfo = {
            username,
            time,
            slipUrl
        }

        const orderData = {
            seat,
            round,
            allOrder: JSON.parse(orderItems),
            amount: Number(amount),
            paymentInfo,
            payment: 'Unchecked',
            date: Date.now()
        }

        const newOrder = new Order(orderData)
        await newOrder.save()

        const orderId = newOrder._id; 
        const { allOrder } = await Order.findById(orderId);

        await User.findOneAndUpdate(
            { seat, round },
            {
                $set: { cartData: [] },
                $push: { orderData: { $each: allOrder } }
            }
        );

        return NextResponse.json({ success: true, message: 'ชำระเงินสำเร็จ'});
    
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}