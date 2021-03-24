/**
 * @module model/complaint
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const complaintSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      default: "open",
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    location: {
      landmark: {
        type: String,
        trim: true,
      },
      line: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
    },
    votes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        commentor: {
          type: ObjectId,
          ref: "User",
        },
        content: String,
      },
    ],
    media: [
      {
        uri: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema, "complaints");

module.exports = Complaint;
