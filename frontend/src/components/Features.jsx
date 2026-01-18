import React from "react"
import { Truck, ShieldCheck, Headphones, RefreshCcw } from "lucide-react"

const features = [
  {
    icon: <Truck className="w-8 h-8 text-blue-600" />,
    title: "Fast Delivery",
    desc: "Quick and reliable shipping",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-600" />,
    title: "Secure Payment",
    desc: "100% secure transactions",
  },
  {
    icon: <Headphones className="w-8 h-8 text-purple-600" />,
    title: "24/7 Support",
    desc: "Always here to help",
  },
  {
    icon: <RefreshCcw className="w-8 h-8 text-pink-600" />,
    title: "Easy Returns",
    desc: "Hassle-free returns policy",
  },
]

const Features = () => {
  return (
    <section className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                {item.icon}
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
