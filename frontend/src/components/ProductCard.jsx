import { Skeleton } from "../components/ui/skeleton"
import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { toast } from "sonner"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setCart } from "@/redux/productSlice"


const ProductCard = ({ product, loading }) => {

    const { productImg, productPrice, productName } = product
    // get access token  
    const accessToken = localStorage.getItem('accessToken')

    // dispatch 
    const dispatch = useDispatch()

    // navigate 
    const navigate = useNavigate()

    const user = useSelector(state => state.user.user)


    const addToCart = async (productId) => {
        try {

            if (!user) {
                toast.error("Please login first 😊");
                setTimeout(() => navigate("/login"), 1700);
                return;
            }
            const res = await axios.post(
                "http://localhost:8000/api/v1/cart/add",
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success("Product Added to Cart 😊")
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max'>
            <div onClick={() => navigate(`/products/${product._id}`)} className='w-full h-full aspect-square overflow-hidden'>

                {
                    loading ? <Skeleton className="w-full h-full rounded-lg" /> : <img src={productImg[0]?.url} alt="product_Image" className='w-full h-full transition-transform duration-300 hover:scale-105' />
                }

            </div>

            {
                loading ? <div className="px-2 space-y-2 my-2">
                    <Skeleton className="w-[200px] h-4 " />
                    <Skeleton className="w-[100px] h-4 " />
                    <Skeleton className="w-[250px] h-8 " />

                </div> : <div className='px-2 space-y-1 '>
                    {/* Name of the product  */}
                    <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>

                    {/* price of the product   */}
                    <h2 className='font-bold'>₹{productPrice}</h2>

                    {/* add to cart button  */}
                    <Button onClick={() => addToCart(product._id)} className="bg-pink-600 mb-3 w-full"><ShoppingCart /> Add to Cart</Button>
                </div>
            }
        </div>
    )
}

export default ProductCard