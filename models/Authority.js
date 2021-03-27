/**
 * @module model/authority
 */

const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

/**
 * Authority schema
 */
const authoritySchema = new mongoose.Schema(
  {
    authorityName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    encry_password: {
      type: String,
      require: true,
    },
    contact: {
      type: String,
    },
    district: {
      type: String,
    },
    salt: String,
  },
  { timestamps: true }
);

/**
 * Mongoose virtual for password encryption
 */
authoritySchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Mongoose schema methods
 */
authoritySchema.methods = {
  /**
   * Hash password
   * @param {string} plainpass
   * @returns {string} hashed password
   */
  securePassword: function (plainpass) {
    if (!plainpass) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpass)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  /**
   * Authenticate authority by password
   * @param {string} plainpass
   * @returns {boolean} Returns password match is true or false
   */
  authenticate: function (plainpass) {
    return this.securePassword(plainpass) === this.encry_password;
  },
};

const Authority = mongoose.model("Authority", authoritySchema, "authorities");

module.exports = Authority;
