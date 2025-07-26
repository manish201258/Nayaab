const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    lastLogin: { type: Date },
    joiningDate: { type: Date, default: Date.now },
    phone: { type: String, required: false }, // Optional, as per profile page
    preferredEra: { type: String, required: false }, // Added from profile page
    avatar: { type: String, required: false }, // Added from profile page
    address: { type: String, default: "Sharma PG near ryan international school , sitapura" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
