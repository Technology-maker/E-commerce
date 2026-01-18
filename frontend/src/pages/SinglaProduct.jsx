import Breadcrums from '@/components/Breadcrums'
import ProductDesc from '@/components/ProductDesc'
import ProductImage from '@/components/ProductImage'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const SinglaProduct = () => {

    const params = useParams();
    const productId = params.id;
    const { products } = useSelector(store => store.product)
    const product = products.find(item => String(item._id) === String(productId))

    if (!product) {
        return <div className="pt-20 text-center">Loading product...</div>
    }


    return (
        <div className='pt-20  max-w-7xl mx-auto'>
            <Breadcrums product={product} />
            <div className='mt-10 grid grid-cols-1 items-start md:grid-cols-2'>
                <ProductImage images={product.productImg} />
                <ProductDesc product={product} />
            </div>
        </div>
    )
}

export default SinglaProduct