import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { ChevronDoubleRightIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { Button } from '@nextui-org/react'
import { format } from 'date-fns'
import useSWR from 'swr'
import { BASE_URL, getFetcher } from '../../services/api'

export default function SectionEvent() {
    const {
        data: dataArticle,
        isLoading: loadingArticle,
        mutate,
    } = useSWR(`/api/content/search-articles?page=1&limit=10&sortBy=createdAt`, getFetcher)

    console.log(dataArticle)

    const dataAcara = [
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'tes',
            tgl_terbit: new Date().toJSON().slice(0, 10),
            address: 'Mandala Wanabakri',
            img_url:
                'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ]
    return (
        <div className="h-96 bg-[#05472A] mt-10">
            <div className="flex flex-row p-12 w-full">
                <div className="flex flex-col pl-10">
                    <p className="text-white text-4xl mb-4 w-[60%]">Artikel Pilihan</p>
                    <p className="text-white text-xl mb-4 w-[70%]">
                        Dapatkan wawasan mendalam dan informasi terbaru mengenai berbagai topik dari Direktorat
                        Pengelolaan B3
                    </p>
                    <Button className="w-56 bg-[#00000059] text-[#05472A] text-white h-8">
                        Simak semua artikel <ChevronDoubleRightIcon className="size-4" />
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
                        {!loadingArticle &&
                            dataArticle?.data?.map((data, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative h-56 w-[90%] rounded-lg overflow-hidden shadow-lg mb-4">
                                        <div className="relative h-full overflow-hidden">
                                            <img
                                                src={`${BASE_URL}${data.photoUrls[0]}`}
                                                alt="Event"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute inset-0 top-auto h-24 bg-black opacity-40"></div>
                                        <div className="absolute top-[18%] left-0 text-white text-sm inline-block mb-12 flex flex-row">
                                            <div className="bg-white text-[#05472A] px-3 py-2">
                                                {format(data.createdAt, 'ii')}
                                            </div>
                                            <div className="bg-[#05472A] px-3 py-2">
                                                {format(data.createdAt, 'LLL yyyy')}
                                            </div>
                                        </div>
                                        <div className="absolute left-0 top-2/3 px-6">
                                            <p className="text-base font-semibold text-white max-w-[80%] mb-2">
                                                {data.title}
                                            </p>
                                            {/* <p className="flex flex-row text-white items-center">
                                                <MapPinIcon className="size-5 mr-2" />
                                                {data.address}
                                            </p> */}
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
