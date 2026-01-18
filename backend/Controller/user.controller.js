import { User } from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { verifyEmail } from "../emailVerify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailVerify/sendOTPMail.js";
import cloudinary from "../utils/cloudnary.js";
import streamifier from "streamifier";
import mongoose from "mongoose";
import userSupportMail from "../emailVerify/userSupport.js";



// register controller function
export const Register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        //  Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required !"
            });
        }

        //  Check existing user 
        const user = await User.findOne({ email: email.toLowerCase() })


        if (user) {
            return res.status(400).json({
                success: false,
                message: "User Already exist !"
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword
        })


        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
        verifyEmail(token, email);  //send email here

        newUser.token = token
        await newUser.save();

        // Safe response
        return res.status(201).json({
            success: true,
            message: "User Register Successfully !",
            User: newUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// verify controller function 
export const Verify = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization Token is Missing or  invalid !"
            })
        }

        const token = authHeader.split(" ")[1]

        let decoded
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "Registration token has expired!"
                })

            }
            return res.status(400).json({
                success: false,
                message: "Token Verification is Failed !"
            })
        }
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not Found !"
            })
        }

        // if its verifyed
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email already verified"
            });
        }


        user.token = null;
        user.isVerified = true
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully 🎉"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// reverify controller email
export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found 😵"
            });
        }

        // BLOCK already verified users
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10m" }
        );


        // send verification email
        await verifyEmail(token, user.email);

        user.token = token;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Verification email sent again successfully 🤘🏻",
            token: user.token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Login controller function
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required !"
            })
        }

        // checking user exist  
        const existingUser = await User.findOne({ email: email.toLowerCase() })

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User Not Exist 😵"
            })
        }


        // checking pass ( my db pass or user pass both are correct or not ?)
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)     // compair both pass user input or database pass 
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        if (!existingUser.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Verify your account before login !"
            });
        }


        // Generate token 
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '10d' })
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' })

        existingUser.isLoggedIn = true;
        await existingUser.save();


        // check session exist or not  and Deleting ? 
        const existingSession = await Session.findOne({ userId: existingUser._id })
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id })
        }

        // creating a new session  
        await Session.create({ userId: existingUser._id })

        // SAFE USER OBJECT
        const userData = {
            id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email
        };

        return res.status(200).json({
            success: true,
            message: `Welcome Back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Logout controller function 
export const Logout = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Foeget Password controller function
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });



        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found !"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)// 10 min expiry
        user.otp = otp
        user.otpExpiry = otpExpiry

        await user.save()

        await sendOTPMail(otp, user.email);


        return res.status(200).json({
            success: true,
            message: "OTP send to Email Successfully !"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// verify otp controller function 
export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body
        const email = req.params.email.toLowerCase();

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is required !"
            })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found !"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP is not Generated or already verify !"
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP Has Expired Please Request New One !"
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "OTP is Invalid "
            })
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified Successfully !"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//change Password controller function
export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const email = req.params.email.toLowerCase();
        const user = await User.findOne({ email });

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match!"
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found !"
            })
        }

        if (user.otp || user.otpExpiry) {
            return res.status(403).json({
                success: false,
                message: "Please verify OTP first!",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully 🎉"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// Admin - Get All Users controller function
export const allUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// admin get user controller 
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params // extract user id from request params 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid User ID"
            });
        }

        const user = await User.findById(userId).select("-password -otp -otpExpiry -token").lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}




// update user controller
export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;

        const { firstName, lastName, address, city, zipCode, phone, role } = req.body;

        // Authorization check
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile",
            });
        }

        let user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found or Exist 😵",
            });
        }

        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicID;

        // If new image uploaded
        if (req.file) {
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "profiles" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phone = phone || user.phone;

        // Only admin can update role
        if (loggedInUser.role === "admin" && role) {
            user.role = role;
        }

        user.profilePic = profilePicUrl;
        user.profilePicPublicID = profilePicPublicId;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// User support controller
export const userSupport = async (req, res) => {
    try {
        const { name, email, subject, number, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const mailres = await userSupportMail(name, email, subject, number, message);
        console.log(mailres);

        return res.status(200).json({
            success: true,
            message: "Your message was sent successfully ✅"
        });

    } catch (error) {
        console.error("Support error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};
