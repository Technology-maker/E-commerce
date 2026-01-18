import multer from "multer";

export const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {

        // 🔴 too many files uploaded
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images are allowed",
            });
        }

        // 🔴 file size limit
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Max image size allowed is 5MB",
            });
        }

        // 🔴 fallback for other multer errors
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Custom errors (fileFilter, etc.)
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next();
};
