import React from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { X } from 'lucide-react'

const ImageUpload = ({ productData, setProductData }) => {


  const handelFile = (e) => {
    const files = Array.from(e.target.files || [])

    if (!files.length) return

    setProductData(prev => ({
      ...prev,
      productImg: [...prev.productImg, ...files]
    }))

    // reset input so same file can be selected again
    e.target.value = ""
  }

  const removeImage = (index) => {
    setProductData(prev => ({
      ...prev,
      productImg: prev.productImg.filter((_, i) => i !== index)
    }))
  }


  return (

    <div className='grid gap-2'>


      <Label>Product Images</Label>
      <Input type='file'
        id="file-upload"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handelFile}
      />

      <Button variant="outline">
        <label htmlFor="file-upload" className='cursor-pointer w-full'>Upload Images</label>
      </Button>

      {/* image preview  */}
      {
        productData.productImg.length > 0 && (
          <div className=' grid grid-cols-2 gap-4 mt-3 sm:grid-cols-3'>
            {
              productData.productImg.map((file, idx) => {
                // check file is already is file (from input) or  DB object/string
                let preview
                if (file instanceof File) {
                  preview = URL.createObjectURL(file)
                }
                else if (typeof file === 'string') {
                  preview = file
                }
                else if (file?.url) {
                  preview = file.url
                }
                else {
                  return null;
                }
                return (
                  <Card key={idx} className="relative group overflow-hidden">
                    <CardContent>
                      <img
                        src={preview}
                        alt="Image"
                        width={200}
                        height={200}
                        className='w-full h-32 object-cover rounded-md'
                      />

                      {/* remove button   */}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>

                    </CardContent>
                  </Card>
                )
              })
            }
          </div>
        )
      }

    </div>
  )
}

export default ImageUpload