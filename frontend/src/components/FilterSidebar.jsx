import React from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';



//  This is sidebar 
const FilterSidebar = ({ allProducts, priceRange, search, brand, category, setPriceRange, setSearch, setBrand, setCategory }) => {

    // category
    const Categories = allProducts.map(p => p.category)


    // UniqueCategories
    const UniqueCategorie = ["All", ...new Set(Categories)]


    // brand 
    const Brand = allProducts.map(p => p.brand)


    // UniqueBrand 
    const UniqueBrand = ["All", ...new Set(Brand)]


    const handelCategoryClick = (val) => {
        setCategory(val)
    }
    const handelBrandChange = (e) => {
        setBrand(e.target.value)
    }

    const handelMinChange = (e) => {
        const value = Number(e.target.value)
        if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }
    const handelMaxChange = (e) => {
        const value = Number(e.target.value)
        if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }


    const resetFilter = () => {
        setSearch("");
        setCategory("All")
        setBrand("All")
        setPriceRange([0, 99999])
    }


    return (
        <div className='bg-gray-100 mt-10 p-4 rounded-md h-max'>

            {/* Search  */}
            <Input
                type="text"
                placeholder='Search...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white p-2 rounded-md border-gray-400 w-full"
            />


            {/* category */}
            <h1 className='mt-5 font-semibold text-xl'>Category</h1>
            <div className='flex flex-col gap-2 mt-3'>
                {
                    UniqueCategorie.map((item, index) => (
                        <div key={index} className='flex items-center gap-2'>
                            <input
                                type='radio'
                                checked={category === item}
                                onChange={() => handelCategoryClick(item)}
                            />
                            <label htmlFor=''>{item}</label>

                        </div>
                    ))
                }
            </div>

            {/* brands */}

            <h1 className='mt-5 font-semibold text-xl'>Brand</h1>
            <select className=' bg-white w-full p-2 border-gray-200 border-2 rounded-md' value={brand} onChange={handelBrandChange} >
                {UniqueBrand.map((item, index) => (
                    <option key={index} value={item}>{item.toUpperCase()} </option>
                ))}
            </select>

            {/* price range  */}
            <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
            <div className='flex flex-col gap-2'>
                <label htmlFor="">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className='flex gap-2 items-center'>
                    <input type="number" mini="0" max="5000" value={priceRange[0]} onChange={handelMinChange} className='w-20 p-1 border-2 border-gray-300 rounded ' />
                    <span>-</span>
                    <input type="number" mini="0" max="99999" value={priceRange[1]} onChange={handelMaxChange} className='w-20 p-1 border-2 border-gray-300 rounded ' />
                </div>
                <input type="range" mini="0" max="5000" step='100' className='w-full' value={priceRange[0]} onChange={handelMinChange} />
                <input type="range" mini="0" max="99999" step='100' className='w-full' value={priceRange[1]} onChange={handelMaxChange} />

            </div>
            {/* Reset button  */}

            <Button onClick={resetFilter} className='bg-pink-600 text-white mt-5 cursor-pointer w-full'>Reset Filter</Button>

        </div >
    )
}

export default FilterSidebar