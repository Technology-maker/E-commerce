import mongoose from "mongoose";


// this is my db schema  
const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profilePic: { type: String, default: "" },  //  cloudanary image  url 
    profilePicPublicID: { type: String, default: "" },  //  cloudanary public id for deletation
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNo: { type: String },
}, { timestamps: true });


export const User = mongoose.model("User", userSchema); 