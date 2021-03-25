const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: String,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
