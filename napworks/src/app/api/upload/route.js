import { uploadToCloudinary } from "@/lib/cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type))
        return NextResponse.json({ message: "Invalid file type" }, { status: 400 });

    // Validating for 4 MB size
    if (file.size > 4 * 1024 * 1024)
        return NextResponse.json({ message: "File too large" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary(buffer);

    return NextResponse.json({ url: uploaded.secure_url });
}


// Helper to extract public_id from Cloudinary URL
// e.g. "https://res.cloudinary.com/demo/image/upload/v123/products/abc123.jpg"
//       → "products/abc123"
function getPublicId(url) {
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    // Skip "upload" and the version segment (v123...)
    const relevantParts = parts.slice(uploadIndex + 2);
    const filename = relevantParts[relevantParts.length - 1].split(".")[0]; // remove extension
    relevantParts[relevantParts.length - 1] = filename;
    return relevantParts.join("/");
}

export async function DELETE(req) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { message: "Image URL is required" },
                { status: 400 }
            );
        }

        const publicId = getPublicId(url);
        await cloudinary.uploader.destroy(publicId);

        return NextResponse.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}