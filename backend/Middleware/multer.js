import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPG, JPEG, PNG, WEBP images and PDF files are allowed"),
            false
        );
    }
};


const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
});

// single upload
export const singleUpload = upload.single("file");

// multiple uploads (max 5)
export const multipleUpload = upload.array("file", 5);
