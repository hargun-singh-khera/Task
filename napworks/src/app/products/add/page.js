"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { DashboardShell, Icon } from "../../components/DashboardShell";
import { uploadImage, deleteImage } from "@/services/upload.service";
import { createProduct } from "@/services/product.service";
import { PrimaryButton } from "@/app/components/PrimaryButton";
import { ImageSlot } from "@/app/components/ImageSlot";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([null, null, null, null]);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  // ─── Upload single image on select ───────────────────────────────────────────
  const handleImageSelect = async (index, file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and SVG images are allowed");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Each image must be less than 4MB");
      return;
    }

    const updated = [...images];
    updated[index] = { url: null, uploading: true };
    setImages([...updated]);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await uploadImage(formData);

      updated[index] = { url: data.url, uploading: false };
      setImages([...updated]);
      toast.success("Image uploaded");
    } catch (err) {
      updated[index] = null;
      setImages([...updated]);
      toast.error(err.response?.data?.message || "Image upload failed");
    }
  };

  // ─── Delete image ─────────────────────────────────────────────────────────────
  const handleDelete = async (index) => {
    const image = images[index];
    if (!image?.url) return;

    const updated = [...images];
    updated[index] = null;
    setImages([...updated]); // optimistic update

    try {
      await deleteImage(image.url);
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    console.log("submit clicked");
    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      toast.error("A valid price is required");
      return;
    }

    const stillUploading = images.some((img) => img?.uploading);
    if (stillUploading) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    const imageUrls = images.filter((img) => img?.url).map((img) => img.url);
    if (imageUrls.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setSubmitting(true);
    try {
      await createProduct({
        name: name.trim(),
        price: parseFloat(price),
        images: imageUrls,
      });

      toast.success("Product created successfully!");
      setName("");
      setPrice("");
      setImages([null, null, null, null]);

      setTimeout(() => {
        router.push("/products");
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────────
  return (
    <DashboardShell>
      <Toaster position="bottom-right" />
      <div className="mx-auto max-w-[980px]">
        <h1 className="text-2xl font-semibold tracking-tight">Add Product</h1>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.95fr]">
          {/* ── Product Information ── */}
          <section className="rounded-2xl border border-[#d9dde3] bg-white p-5">
            <h2 className="text-xl font-semibold">Product Information</h2>
            <p className="mt-2 text-xs text-[#9aa0a9]">Fill Details of the product</p>

            <div className="mt-5 flex flex-col gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Product Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-lg border border-[#b8bdc5] px-4 text-sm outline-none transition placeholder:text-[#8f949c] focus:border-[#246bfe] focus:ring-4 focus:ring-[#246bfe]/10"
                  placeholder="Input product name"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Price</span>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-12 rounded-lg border border-[#b8bdc5] px-4 text-sm outline-none transition placeholder:text-[#8f949c] focus:border-[#246bfe] focus:ring-4 focus:ring-[#246bfe]/10"
                  placeholder="Enter Price"
                  type="number"
                  min="0"
                />
              </label>
            </div>
          </section>

          {/* ── Image Upload ── */}
          <section className="rounded-2xl border border-[#d9dde3] bg-white p-5">
            <h2 className="text-xl font-semibold">Image Product</h2>
            <p className="mt-2 text-xs">
              <span className="font-semibold text-[#246bfe]">Note :</span>{" "}
              <span className="text-[#323640]">Format photos SVG, PNG, or JPG (Max size 4mb)</span>
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-4">
              {images.map((image, index) => (
                <ImageSlot
                  key={index}
                  index={index}
                  image={image}
                  onUpload={handleImageSelect}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ── Save Button ── */}
        <div className="mt-5 flex justify-end">
          <PrimaryButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save Product"}
          </PrimaryButton>
        </div>
      </div>
    </DashboardShell>
  );
}