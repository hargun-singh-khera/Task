const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    images: {
      type: [String],
      validate: {
        validator: (images) => images.length <= 4,
        message: "Maximum 4 images allowed",
      },
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);