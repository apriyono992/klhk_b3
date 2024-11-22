import RootLanding from '../../components/layouts/RootLanding'
import { Button, Skeleton } from '@nextui-org/react'
import banner from '../../assets/banner/bg-landing.png'
import root from '../../assets/images/icons8-stump-with-roots.png'
import wood from '../../assets/images/icons8-wood.png'
import folu from '../../assets/images/icons8-greenhouse-effect.png'
import gender from '../../assets/images/icons8-gender.png'
import perhutanan from '../../assets/images/icons8-forest.png'
import invest from '../../assets/images/icons8-forest-app.png'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Card from '../../components/elements/Card'
import SectionEvent from '../../components/elements/SectionEvent'
import FooterLanding from '../../components/elements/FooterLanding'
import useSWR from 'swr'
import { getFetcher } from '../../services/api'

export default function HomePage() {
    const {
        data: dataBerita,
        isLoading: loadingBerita,
        mutate,
    } = useSWR(`/api/content/search-news?page=1&limit=10&sortBy=createdAt`, getFetcher)

    console.log(dataBerita)

    const icon = [
        {
            title: 'Forest Program',
            icon: root,
        },
        {
            title: 'Indonesian Legal Wood',
            icon: wood,
        },
        {
            title: 'FOLU Net Sink',
            icon: folu,
        },
        {
            title: 'Responsif Gender',
            icon: gender,
        },
        {
            title: 'Perhutanan Sosial',
            icon: perhutanan,
        },
        {
            title: 'Forest Investment',
            icon: invest,
        },
    ]

    // const dataBerita = [
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    //     {
    //         title: 'tes',
    //         tgl_terbit: new Date().toJSON().slice(0, 10),
    //         author: 'reynald',
    //         category: 'Sosialisasi',
    //         img_url:
    //             'https://images.unsplash.com/photo-1730304539413-02706e6705db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    //     },
    // ]

    return (
        <RootLanding>
            <div className="relative">
                <img alt="bg-login" src={banner} className="w-full h-[85vh] object-fill" />
                <div className="absolute top-[10%] flex flex-col justify-center text-white px-28 space-y-4">
                    <p className="text-4xl md:text-6xl font-bold">Menuju Indonesia Maju dengan</p>
                    <p className="text-4xl md:text-6xl font-bold pb-8">Lingkungan Lestari</p>
                    <p className="text-lg md:text-xl max-w-[60%]">
                        Kementerian LHK berkomitmen mewujudkan pembangunan lingkungan hidup dan kehutanan secara
                        berkelanjutan dalam meningkatkan kesejahteraan rakyat menuju Indonesia Maju
                    </p>
                </div>
                <div className="absolute left-1/4 -mt-16 md:-mt-32 z-10 mx-auto max-w-5xl p-4">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-6 bg-white bg-opacity-90 text-center p-6 rounded-lg shadow-lg">
                        {icon.map((data) => (
                            <div className="bg-white bg-opacity-10 p-4 rounded-lg flex flex-col items-center">
                                <span className="text-3xl">
                                    <img src={data.icon} />
                                </span>
                                <p className="mt-2 text-gray-900 font-semibold">{data.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-[#05472A] h-52 py-6 text-center text-white flex flex-row justify-center items-end z-10">
                    <p className="text-sm mb-2 mr-4">
                        Program Unggulan Kementerian Lingkungan Hidup dan Kehutanan Republik Indonesia
                    </p>
                    <Button className="bg-[#00000059] text-[#05472A] text-white hover:bg-gray-200 h-[20%]">
                        Lihat program lainnya <ChevronDoubleRightIcon className="size-4" />
                    </Button>
                </div>
                <div className="px-20 pt-8">
                    <p className="text-4xl text-[#05472A] mb-7">Berita Terkini</p>
                    <div className="w-full flex flex-row ml-4">
                        <Swiper
                            slidesPerView={1}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {loadingBerita
                                ? Array(3)
                                      .fill(0)
                                      .map((_, index) => (
                                          <SwiperSlide key={index}>
                                              <div className="w-[380px] space-y-5 p-4">
                                                  <Skeleton className="rounded-lg">
                                                      <div className="h-32 rounded-lg bg-default-300"></div>
                                                  </Skeleton>
                                                  <div className="space-y-3">
                                                      <Skeleton className="w-3/5 rounded-lg">
                                                          <div className="h-6 w-3/5 rounded-lg bg-default-200"></div>
                                                      </Skeleton>
                                                      <Skeleton className="w-4/5 rounded-lg">
                                                          <div className="h-6 w-4/5 rounded-lg bg-default-200"></div>
                                                      </Skeleton>
                                                      <Skeleton className="w-2/5 rounded-lg">
                                                          <div className="h-6 w-2/5 rounded-lg bg-default-300"></div>
                                                      </Skeleton>
                                                  </div>
                                              </div>
                                          </SwiperSlide>
                                      ))
                                : dataBerita?.data?.map((data, index) => (
                                      <SwiperSlide key={index}>
                                          <Card data={data} />
                                      </SwiperSlide>
                                  ))}
                        </Swiper>
                    </div>
                    <div className="flex flex-row text-[#05472A] items-center justify-end mt-9 cursor-pointer">
                        Lihat Semua Berita <ChevronDoubleRightIcon className="ml-4 size-4" />
                    </div>
                </div>
                <SectionEvent />
                <FooterLanding />
            </div>
        </RootLanding>
    )
}
