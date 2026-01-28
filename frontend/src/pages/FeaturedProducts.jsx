import { useMemo } from "react"
import { useSelector } from "react-redux"
import { Button } from "../components/ui/button"
import ProductCard from "@/components/ProductCard"
import { useNavigate } from "react-router-dom"

const FeaturedProducts = () => {
  const products = useSelector(state => state.product.products)
  const navigate = useNavigate()

  const featuredProducts = useMemo(() => {
    return products.slice(0, 10)
  }, [products])

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Products ✨
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            onClick={() => navigate("/products")}
            size="lg"
            className="bg-orange-400 hover:bg-orange-500"
          >
            View All Products
          </Button>
        </div>

      </div>
    </section>
  )
}

export default FeaturedProducts
