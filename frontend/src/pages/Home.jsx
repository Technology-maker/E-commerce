
import Features from '@/components/Features'
import Hero from '@/components/Hero'
import React from 'react'
import Products from './products'
import FeaturedProducts from './FeaturedProducts'

const Home = () => {
    return (
        <div>
            <Hero />
            <Features />
            <FeaturedProducts/>
        </div>
    )
}

export default Home