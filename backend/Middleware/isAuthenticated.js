import jwt from 'jsonwebtoken'
import { User } from "../models/userModel.js"

export const isAuthenticated = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(400).json({
                success: false,
                message: "Autherization token is missing or invalid !"
            })
        }

        const token = authHeader.split(" ")[1]
        let decoded

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        } catch (error) {
            if (error === "TokenEpiresError") {
                res.status(400).json({
                    success: false,
                    message: "The Registration token is expire !"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Access Token is Missing or invalid!"
            })
        }



        const user = await User.findById(decoded.id);


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found !"
            })
        }

        req.user = user
        req.id = user._id
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}





// is Admin Authenticated  middleware
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: "Access denied: Admin only",
    });
};