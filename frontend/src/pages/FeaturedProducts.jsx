import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Button } from "../components/ui/button";
import ProductCard from "@/components/ProductCard"
import { setProducts } from "@/redux/productSlice"
import { useNavigate } from "react-router-dom"

const FeaturedProducts = () => {
    const dispatch = useDispatch()
    const products = useSelector((state) => state.product.products)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const API = import.meta.env.VITE_API_BASE_URL

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${API}/products/get-products`)

            if (res.data.success) {
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to load products")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!products || products.length === 0) {
            getAllProducts()
        }
    }, [])

    const featuredProducts = useMemo(() => {
        return products?.slice(0, 10)
    }, [products])

    return (
        <section className="py-20">
            <div className="max-w-7xl mx-auto px-4">

                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                    Featured Products ✨
                </h2>
                <p className=" text-lg text-center text-gray-500 dark:text-gray-400 py-2">
                    Browse our complete collection of products, thoughtfully selected for quality and reliability.
                </p>



                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-80 bg-muted rounded-xl animate-pulse"
                            />
                        ))
                        : featuredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                </div>

                <div className="mt-16 flex justify-center">

                    <Button onClick={() => navigate("/products")} size="lg" variant="outline" className=" bg-orange-400 hover:bg-orange-500 px-8 min-w-[200px]">
                        View All Products
                    </Button>

                </div>
            </div>
        </section>
    )
}

export default FeaturedProducts
