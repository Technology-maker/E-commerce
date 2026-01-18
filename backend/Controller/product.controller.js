import { Product } from "../models/products.js";
import cloudinary from "../utils/cloudnary.js";
import getDataUri from "../utils/dataUri.js";
import mongoose from "mongoose";



// Add Products controller 
export const addProduct = async (req, res) => {

    try {

        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;



        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized user!",
            });
        }


        // Product Validation  
        if (!productName || !productDesc || productPrice === undefined || !category) {
            return res.status(400).json({
                success: false,
                message: "All required fields are required 👇🏻",
            });
        }


        // IMAGE VALIDATION 
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }


        // ✅ Image limit (MAX 5)
        if (req.files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images are allowed",
            });
        }

        // Upload images to Cloudinary handel multiple image uploads 
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file)

                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "MERN_PRODUCTS",     //cloudnary folder name 

                });

                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                })
            }
        }


        // Create product in DB
        const newProduct = await Product.create(
            {
                userId,
                productName,
                productDesc,
                productPrice,
                category,
                brand,
                productImg // array of objects ( it look like ->[ {url,public_id}, {url,public_id}] )

            }
        )

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: newProduct,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// get all product controller
export const getAllProduct = async (req, res) => {
    try {


        const products = await Product.find()

        if (products.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No products available",
                products: [],
            });
        }
        return res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// delete products controller 
export const deleteProducts = async (req, res) => {
    try {
        const { productId } = req.params;

        //validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        // find product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "product was not Found 😵"
            })
        }

        // deleting images from cloudnary 
        if (product.productImg && product.productImg.length > 0) {
            for (const img of product.productImg) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (err) {
                    console.error("Cloudinary delete failed:", img.public_id);
                }
            }
        }

        // deleting product from mongo DB
        await product.deleteOne();


        // all ok then we showing
        return res.status(200).json({
            success: true,
            message: "Product Was Deleted Successfully ✅"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message

        });
    }
}



// update product controller  
export const updateProducts = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(productId);

        // product not found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Oops Product was not found 😵"
            })
        }


        // ---------- IMAGE UPDATE LOGIC ----------
        let updatedImages = []

        // keep selected old images 
        if (existingImages) {
            const keepIds = JSON.parse(existingImages);

            // images to keep
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            );

            // delete only removed images 
            const removedImages = product.productImg.filter(
                (img) => !keepIds.includes(img.public_id)
            )
            for (let img of removedImages) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (err) {
                    console.error("Failed to delete image:", img.public_id);
                }
            }
        }
        else {
            updatedImages = product.productImg // keep all img if user not update image
        }



        //upload new images if any

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "Products",
                });

                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                });
            }
        }

        //  IMAGE LIMIT CHECK 
        if (updatedImages.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images allowed",
            });
        }

        // ---------- UPDATE PRODUCT FIELDS ----------
        product.productName = productName ?? product.productName;
        product.productDesc = productDesc ?? product.productDesc;
        product.productPrice = productPrice ?? product.productPrice;
        product.category = category ?? product.category;
        product.brand = brand ?? product.brand;
        product.productImg = updatedImages;

        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully 😊",
            product
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


