const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: String,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
