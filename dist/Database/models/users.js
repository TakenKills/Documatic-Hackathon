"use strict";
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    userID: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose_1.model("User", UserSchema, "users");
