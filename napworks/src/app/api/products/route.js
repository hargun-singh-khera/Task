import { NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import Product from "@/models/Product";


export async function POST(req) {
    try {
        await connectDB();

        const { name, price, images } = await req.json();

        // Validate name
        if (!name || !name.trim()) {
            return NextResponse.json(
                { message: "Product name is required" },
                { status: 400 }
            );
        }

        // Validate price
        const parsedPrice = parseFloat(price);
        if (!price || isNaN(parsedPrice) || parsedPrice < 0) {
            return NextResponse.json(
                { message: "A valid price is required" },
                { status: 400 }
            );
        }

        // Validate images
        if (!images || images.length === 0) {
            return NextResponse.json(
                { message: "At least one image is required" },
                { status: 400 }
            );
        }

        if (images.length > 4) {
            return NextResponse.json(
                { message: "Maximum 4 images allowed" },
                { status: 400 }
            );
        }

        // Validate each image is a valid Cloudinary URL
        const isValidUrl = (url) => {
            try {
                const parsed = new URL(url);
                return parsed.hostname.includes("cloudinary.com");
            } catch {
                return false;
            }
        };

        if (!images.every(isValidUrl)) {
            return NextResponse.json(
                { message: "Invalid image URLs provided" },
                { status: 400 }
            );
        }

        const product = await Product.create({
            name: name.trim(),
            price: parsedPrice,
            images, // already Cloudinary URLs, just save directly
        });

        return NextResponse.json(
            { success: true, product, message: "Product created successfully" },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const pageNumber = Number(searchParams.get("pageNumber")) || 1;
        const pageSize = Number(searchParams.get("pageSize")) || 10;

        const search = searchParams.get("search") || "";
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Build filter query dynamically
        const query = {};

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: "i" }; // case-insensitive
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        // Date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // include the full end day
                query.createdAt.$lte = end;
            }
        }

        const products = await Product.find(query)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 });

        const totalRecords = await Product.countDocuments(query); 

        return Response.json({
            success: true,
            message: "Products fetched successfully",
            data: products,
            totalRecords,
            pageNumber,
            pageSize,
            totalPages: Math.ceil(totalRecords / pageSize),
        });
    } catch (error) {
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}