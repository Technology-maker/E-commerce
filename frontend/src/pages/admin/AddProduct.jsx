import ImageUpload from '@/components/ImageUpload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { setProducts } from '@/redux/productSlice'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const ADD_PRODUCT_API_URL = `http://localhost:8000/api/v1/products/add`;
  const products = useSelector(state => state.product.products)


  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: ""
  })



  const handelChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select At least one Image 😑");
      return;
    }
    productData.productImg.forEach((img) => {
      formData.append("file", img)
    })

    try {
      setLoading(true);
      const res = await axios.post(ADD_PRODUCT_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        toast.success(res.data?.message || "Product added successfully 🚀")
        dispatch(setProducts([...products, res.data.product]))
      }


      // ✅ reset form
      setProductData({
        productName: "",
        productPrice: "",
        productDesc: "",
        productImg: [],
        brand: "",
        category: ""
      })

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Something went wrong")
    }
    finally {
      setLoading(false);
    }
  }



  return (
    <div className=' p-4 md:p-11 bg-gray-100 min-h-screen'>
      <Card className='w-full my-20 '>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
          <CardDescription>Enter Product Details Below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col gap-2 '>

            <div className='grid gap-2'>
              <Label>Product Name</Label>
              <Input type="text"
                name="productName"
                value={productData.productName}
                onChange={handelChange}
                placeholder="Ex - iphone 17 pro max"
                required
              />
            </div>

            <div className='grid gap-2'>
              <Label>Price</Label>
              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handelChange}
                placeholder="Ex - 9999"
                required
              />
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handelChange}
                  placeholder="Ex - Apple"
                  required
                />
              </div>

              <div className='grid gap-2'>
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handelChange}
                  placeholder="Ex - Mobile"
                  required
                />
              </div>
            </div>

            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label>Description</Label>
              </div>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handelChange}
                placeholder="Enter description of Product"
                required
              />
            </div>

            <ImageUpload productData={productData} setProductData={setProductData} />
          </div>
          <CardFooter className='flex-col gap-2 mt-10'>
            <Button
              disabled={loading}
              onClick={submitHandler}
              className="w-full bg-pink-600 cursor-pointer"
              type='submit'
            >
              {
                loading ? <span className='flex gap-1 items-center'> <Loader2 className='animate-spin' />Please Wait</span> : "Add Product"
              }
            </Button>
          </CardFooter>

        </CardContent>
      </Card>
    </div>

  )
}

export default AddProduct