"use client"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"

import { Button } from "@/components/ui/button"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const banners = [
  {
    id: 1,
    title: "Summer Health Sale",
    description: "Up to 40% off on all skincare products",
    image: "/medical-banner-1.jpg",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: 2,
    title: "New Arrivals",
    description: "Check out our latest medical equipment",
    image: "/medical-banner-2.jpg",
    color: "from-green-500 to-teal-500",
  },
  {
    id: 3,
    title: "Special Offer",
    description: "Buy 2 Get 1 Free on vitamins",
    image: "/",
    color: "from-orange-500 to-red-500",
  },
]

export function BannerCarousel() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="h-[300px] md:h-[400px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className={`relative h-full bg-gradient-to-r ${banner.color}`}>
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="swiper-button-prev z-10 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="swiper-button-next z-10 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
              <div className="relative h-full px-6 py-8 md:px-12">
                <div className="flex h-full items-center">
                  <div className="w-1/2">
                    <h2 className="text-3xl font-bold text-white md:text-4xl lg:text-5xl">{banner.title}</h2>
                    <p className="mt-4 text-lg text-white/90 md:text-xl">{banner.description}</p>
                    <Button className="mt-6 bg-white text-gray-900 hover:bg-white/90">Shop Now</Button>
                  </div>
                  <div className="w-1/2">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      width={500}
                      height={500}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

