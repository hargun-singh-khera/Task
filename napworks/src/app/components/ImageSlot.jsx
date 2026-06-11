"use client";

export function ImageSlot({
  index,
  image,
  onUpload,
  onDelete,
}) {
  const inputId = `product-image-${index}`;

  return (
    <div className="relative aspect-square min-h-20">
      {/* Empty Slot */}
      {!image && (
        <>
          <input
            id={inputId}
            type="file"
            accept=".jpg,.jpeg,.png,.svg"
            className="hidden"
            onChange={(e) => onUpload(index, e.target.files?.[0])}
          />

          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#246bfe] bg-[#f8fbff] transition hover:bg-[#eef5ff]"
          >
            <span className="grid size-6 place-items-center rounded-md border border-[#246bfe] text-sm text-[#246bfe]">
              ▧
            </span>

            <span className="text-xs font-medium text-[#313640]">
              Photo {index + 1}
            </span>
          </label>
        </>
      )}

      {/* Uploading */}
      {image?.uploading && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#246bfe] bg-[#f8fbff]">
          <div className="size-6 animate-spin rounded-full border-2 border-[#246bfe] border-t-transparent" />
          <span className="text-xs text-[#246bfe]">
            Uploading...
          </span>
        </div>
      )}

      {/* Uploaded */}
      {image?.url && !image?.uploading && (
        <>
          <img
            src={image.url}
            alt={`Product ${index + 1}`}
            className="h-full w-full rounded-lg object-cover"
          />

          <button
            type="button"
            onClick={() => onDelete(index)}
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md transition hover:bg-red-600"
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}