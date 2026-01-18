import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCart } from '@/redux/productSlice'


const ProductDesc = ({ product }) => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,

        })
    }, [])
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);




    const addToCart = async (productId) => {


        try {
            const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, { productId, quantity }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.data.success) {
                toast.success("Porduct Added To Cart 😊")
                dispatch(setCart(res.data.cart))

            }
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-white">
            {/* Product Name */}
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                {product.productName}
            </h1>

            {/* Category & Brand */}
            <p className="text-sm md:text-base text-gray-500">
                {product.category} • {product.brand}
            </p>

            {/* Price */}
            <h2 className="text-2xl font-bold text-gray-900">
                ₹{product.productPrice}
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-10 lg:line-clamp-13">
                {product.productDesc}
            </p>

            {/* 🔥 Sticky action bar for mobile */}
            <div className=" fixed bottom-0 left-0 right-0 md:static  bg-white border-t md:border-none  p-4  flex gap-3 items-center z-50 " >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                        Qty
                    </span>
                    <Input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-16"
                    />
                </div>

                <Button onClick={() => { addToCart(product._id) }} className="flex-1">
                    Add to Cart
                </Button>
            </div>
        </div>
    )
}

export default ProductDesc
