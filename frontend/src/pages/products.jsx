import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"




const Products = () => {

    // product state 
    const [allProducts, setAllProducts] = useState([])

    // loading stste 
    const [loadong, setLoading] = useState(false)

    // price state 
    const [priceRange, setPriceRange] = useState([0, 99999])

    // searchh state 
    const [search, setSearch] = useState("")

    // category state
    const [category, setCategory] = useState("All")

    // brand state 
    const [brand, setBrand] = useState("All")

    // State to handle mobile sidebar visibility
    const [isOpen, setIsOpen] = useState(false);

    const [sortOrder, setSortOrder] = useState('')


    const products = useSelector((state) => state.product?.products || [])

    const dispatch = useDispatch()






    const getAllProducts = async () => {
        try {

            const API = import.meta.env.VITE_API_BASE_URL;

            setLoading(true)
            const res = await axios.get(`${API}/products/get-products`)

            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }


        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) {
            return
        }

        let filtered = [...allProducts]

        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }
        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }
        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowToHigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "highToLow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }

        dispatch(setProducts(filtered))

    }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProducts()
        window.scrollTo({
            top: 0,
            left: 0,
        })
    }, [])




    return (
        <div className='py-20 pb-10'>
            <div className='max-w-7xl mx-auto  flex gap-7'>
                {/* slidbar */}

                {/* ================= DESKTOP SIDEBAR ================= */}
                <div className="hidden md:block w-64">
                    <FilterSidebar
                        allProducts={allProducts}
                        priceRange={priceRange}
                        search={search}
                        brand={brand}
                        category={category}
                        setPriceRange={setPriceRange}
                        setSearch={setSearch}
                        setBrand={setBrand}
                        setCategory={setCategory}

                    />
                </div>

                {/* ================= MOBILE SIDEBAR ================= */}
                <div
                    className={`fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

                    {/* Header */}
                    <div className="flex justify-between items-center p-3 border-b">
                        <h2 className="font-semibold text-lg">Filters</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-2xl font-bold cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Sidebar content */}
                    <div className="p-4 overflow-y-auto">
                        <FilterSidebar
                            allProducts={allProducts}
                            priceRange={priceRange}
                            search={search}
                            brand={brand}
                            category={category}
                            setPriceRange={setPriceRange}
                            setSearch={setSearch}
                            setBrand={setBrand}
                            setCategory={setCategory}
                        />
                    </div>
                </div>




                {/* Main product section  */}

                <div className="flex flex-col flex-1">

                    {/* Top bar: Filters (left) + Sort (right) */}
                    <div className="flex items-center justify-between mb-4 gap-3">

                        {/* Mobile Filters Button – LEFT */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="border rounded-lg px-4 py-2 font-medium bg-white cursor-pointer"
                            >
                                Filters
                            </button>
                        </div>

                        {/* Sort Dropdown – RIGHT */}
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort By Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                                    <SelectItem value="highToLow">Price: High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                loading={loadong}
                            />
                        ))}
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Products