import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        // user refrence 
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // product name  
        productName: { type: String, required: true },
        // product discription  
        productDesc: { type: String, required: true },

        // product images more than one or two
        productImg: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true }
            }
        ],


        // product price 
        productPrice: { type: Number },

        // product catagory 
        category: { type: String, required: true },

        // which brand of the product 
        brand: { type: String }

    },
    { timestamps: true }
)

export const Product = mongoose.model("Product", productSchema);