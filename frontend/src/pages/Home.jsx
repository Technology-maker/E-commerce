
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import React, { useEffect } from 'react'
import Products from './products'
import FeaturedProducts from './FeaturedProducts'

const Home = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    return (
        <div>
            <Hero />
            <Features />
            <FeaturedProducts />
        </div>
    )
}

export default Home