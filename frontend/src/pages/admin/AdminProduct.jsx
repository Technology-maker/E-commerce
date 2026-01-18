
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Edit, Loader2, Search, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Card } from '@/components/ui/card'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/components/ImageUpload'
import axios from 'axios'
import { toast } from 'sonner'
import { setProducts } from '@/redux/productSlice'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"




const AdminProduct = () => {


  const products = useSelector(store => store.product.products) || []
  // state manage 
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("")


  // access token 
  const accessToken = localStorage.getItem("accessToken");

  // dispatch  
  const dispatch = useDispatch();


  const handelChange = (e) => {
    const { name, value } = e.target
    setEditProduct((prev) => ({
      ...prev,
      [name]: value

    }))
  }



  const handelSave = async (e) => {


    e.preventDefault()
    if (!editProduct) return;

    setLoading(true)

    const PRODUCT_UPDATE_API =
      `http://localhost:8000/api/v1/products/update/${editProduct._id}`;

    const formData = new FormData()
    formData.append("productName", editProduct.productName)
    formData.append("productDesc", editProduct.productDesc)
    formData.append("productPrice", editProduct.productPrice)
    formData.append("category", editProduct.category)
    formData.append("brand", editProduct.brand)


    // Add Existing Images public_ids

    const existingImages = editProduct.productImg
      .filter((img) => !(img instanceof File) && img.public_id)
      .map((img) => img.public_id)


    formData.append("existingImages", JSON.stringify(existingImages))




    // Add new files 
    editProduct.productImg
      .filter((img) => img instanceof File)
      .forEach((file) => {
        formData.append("file", file);
      })



    try {
      const res = await axios.put(PRODUCT_UPDATE_API, formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        toast.success("Product Updated Successfully !");
        const updateProducts = products.map((p) =>
          p._id === editProduct._id ? res.data.product : p)
        dispatch(setProducts(updateProducts))
        setEditProduct(null);
      }

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  }



  const deleteProductHandler = async (productId) => {

    try {

      const DELETE_API = `http://localhost:8000/api/v1/products/delete/${productId}`

      const remaningProducts = products.filter((product) => product._id !== productId)
      const res = await axios.delete(DELETE_API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });


      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setProducts(remaningProducts))
      }
    } catch (error) {
      console.log(error);
    }
  }


  let filterProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLocaleLowerCase())
  )


  if (sortOrder === 'lowToHigh') {
    filterProducts = [...filterProducts].sort((a, b) => a.productPrice - b.productPrice)
  }

  if (sortOrder === 'highToLow') {
    filterProducts = [...filterProducts].sort((a, b) => b.productPrice - a.productPrice)
  }





  return (
    <div className='py-16 px-4 md:px-6  justify-center  md:pl-[150px] flex flex-col gap-4 min-h-screen  bg-gray-100'>

      <div className=' pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='relative bg-white rounded-lg'>
          <Input value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value) }} type='text' placeholder="Search Product..." className="w-full md:w-[400px]" />
          <Search className='absolute right-3 top-1.5 text-gray-500 ' />
        </div>


        <Select onValueChange={(value) => setSortOrder(value)}>

          <SelectTrigger className="w-[280px] bg-white flex ">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="lowToHigh">Low To High</SelectItem>
            <SelectItem value="highToLow">High To Low</SelectItem>

          </SelectContent>

        </Select>

      </div>
      {
        filterProducts.map((product,) => {
          return <Card key={product._id} className="px-4">

            <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
              <div className='flex gap-3 items-center'>
                <img
                  src={product.productImg?.[0]?.url || "/placeholder.png"}
                  alt={product.productName}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="font-medium  text-gray-700 w-full md:w-96  line-clamp-2">{product.productName}</span>
                <h1>₹{product.productPrice}</h1>
                <div className='flex gap-3 '>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setEditProduct({
                            ...product,
                            productImg: [...product.productImg],
                          })
                        }
                      >
                        <Edit className="text-green-500" />
                      </Button>
                    </DialogTrigger>



                    {editProduct && (
                      <DialogContent className="sm:max-w-[625px] max-h-[740px] overflow-y-scroll">
                        <DialogHeader>
                          <DialogTitle>Edit Products</DialogTitle>
                          <DialogDescription>
                            Make changes to your Product here. Click save when you&apos;re
                            done.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">

                          <div className="grid gap-2">
                            <Label >Product Name</Label>
                            <Input
                              name="productName"
                              value={editProduct?.productName || ""}
                              onChange={handelChange}
                              placeholder="Ex- iphone"
                              type='text'
                              required
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label >Price</Label>
                            <Input
                              type="number"
                              value={editProduct?.productPrice || ""}
                              onChange={handelChange}
                              name="productPrice"
                              placeholder="Ex- 999"
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className='grid gap-2'>
                              <Label>Brand</Label>
                              <Input
                                type="text"
                                value={editProduct?.brand || ""}
                                onChange={handelChange}
                                name="brand"
                                placeholder="Ex- APPLE"
                                required
                              />
                            </div>

                            <div className='grid gap-2'>
                              <Label>Category</Label>
                              <Input
                                type="text"
                                value={editProduct?.category || ""}
                                onChange={handelChange}
                                name="category"
                                placeholder="Ex- Mobile"
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
                              value={editProduct?.productDesc || ""}
                              onChange={handelChange}
                              placeholder='Enter Breaf description of Product' />
                          </div>

                          <ImageUpload productData={editProduct} setProductData={setEditProduct} />

                        </div>


                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button disabled={loading} onClick={handelSave} type="button">
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin w-4 h-4" />
                                Please wait…
                              </span>
                            ) : (
                              "Save Updates"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}

                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger><Trash2 className='text-red-500 cursor-pointer ' /></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this product and its images.
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { deleteProductHandler(product._id) }} >Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                </div>
              </div>
            </div>
          </Card>
        })
      }
    </div >
  )
}

export default AdminProduct
