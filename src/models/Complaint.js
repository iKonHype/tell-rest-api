/**
 * @module model/complaint
 * @requires module:helpers/Enumeration
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { status } = require("../helpers/Enumerations");

/**
 * Complaint schema
 */
const complaintSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
    },
    authority: {
      type: ObjectId,
      ref: "Authority",
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: "open",
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    location: {
      line: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      postal: {
        type: String,
        trim: true,
      },
      district: {
        type: String,
        trim: true,
      },
    },
    landmark: {
      type: String,
      trim: true,
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
    media: String
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema, "complaints");

module.exports = Complaint;
