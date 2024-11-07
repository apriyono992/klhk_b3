import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ChevronDoubleRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import {format} from 'date-fns'

export default function SectionEvent() {
    const dataAcara = [
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        title: 'tes',
        tgl_terbit: new Date().toJSON().slice(0, 10),
        address: 'Mandala Wanabakri',
        img_url: 'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
    ]
    return (
        <div className="h-96 bg-[#05472A] mt-10">
          <div className="flex flex-row p-12 w-full">
            <div className="flex flex-col pl-10">
              <p className="text-white text-4xl mb-4 w-[60%]">Jelajahi Acara Mendatang</p>
              <p className="text-white text-xl mb-4 w-[70%]">Daftar beberapa acara mendatang yang diselenggarakan oleh KLHK</p>
              <Button className="w-56 bg-[#00000059] text-[#05472A] text-white h-8">
                Jelajahi Semua Acara <ChevronDoubleRightIcon className="size-4"/>
              </Button>
            </div>
            <div className="w-[60%] flex flex-row ml-12">
              <Swiper
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 2,
                  },
                }}
              >
              {dataAcara.map((data, index) => (
                <SwiperSlide key={index}>
                    <div className="relative h-56 w-[90%] rounded-lg overflow-hidden shadow-lg mb-4">
                        <div className="relative h-full overflow-hidden">
                            <img
                            src={data.img_url}
                            alt="Event"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute inset-0 top-auto h-24 bg-black opacity-40"></div>
                        <div className="absolute top-[18%] left-0 text-white text-sm inline-block mb-12 flex flex-row">
                            <div className='bg-white text-[#05472A] px-3 py-2'>{format(data.tgl_terbit, 'ii')}</div>
                            <div className='bg-[#05472A] px-3 py-2'>{format(data.tgl_terbit, 'LLL yyyy')}</div>
                        </div>
                        <div className="absolute left-0 top-2/3 px-6">
                            <p className="text-base font-semibold text-white max-w-[80%] mb-2">
                                {data.title}
                            </p>
                            <p className='flex flex-row text-white items-center'>
                              <MapPinIcon className='size-5 mr-2'/>{data.address}
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
              ))}
              </Swiper>
            </div>
          </div>
        </div>
    )
}