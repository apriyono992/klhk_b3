import { useState } from "react";
import SectionEvent from "../../elements/SectionEvent";
import FooterLanding from "../../elements/FooterLanding";
import banner from '../../../assets/banner/bg-berita-artikel.png';
import { MagnifyingGlassIcon, ChevronDoubleDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Card from "../../elements/Card";

export default function LayoutBeritaAndArticle({title, dataBerita}) {
    function KategoriFilter({ categories }) {
        return (
          <div className="flex flex-col space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                <span>{category.name}</span>
                <span className="text-gray-500">{category.count}</span>
              </div>
            ))}
          </div>
        );
      }
      
      function SearchInput() {
        const [searchTerm, setSearchTerm] = useState('');
      
        return (
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari berdasarkan nama artikel atau penulis"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[90%] p-2 border border-[#5D7987] rounded-xl"
            />
          </div>
        );
      }

      const categories = [
        { id: 1, name: 'Semua Kategori', count: 300 },
        { id: 2, name: 'Sekilas', count: 40 },
        { id: 3, name: 'Siaran Pers', count: 52 },
      ];

    return (
        <div className="relative">
            <img alt="bg-login" src={banner} className="w-full h-[45vh] object-fill" />
            <div className="absolute top-[3%] flex flex-col justify-center text-white px-36 space-y-4">
                <p className="text-4xl md:text-7xl font-semibold">
                    {title} 
                </p>
            </div>
            <div className="px-32 py-16">
                <div className="flex flex-row mb-4">
                    <div className="w-[20%] mr-10">
                        <h1 className="text-xl mb-4">Kategori</h1>
                        <KategoriFilter categories={categories} />
                    </div>
                    <div className="w-full text-[#5D7987]">
                        <h1 className="text-xl mb-4">Cari Berita</h1>
                        <div className="flex flex-row justify-between">
                            <SearchInput />
                            <div className="flex flex-row items-center w-[20%]">
                                <ChevronDoubleDownIcon className="size-7 mr-2"/>
                                <p>
                                    Urutkan berdasarkan
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {dataBerita.map((data, index) => (
                                <div className="bg-gray-100">
                                    <Card data={data}/>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-row justify-end">
                            <p className="mr-4">
                                Nomor per page:
                            </p> 
                            <p className="mr-4">
                                8
                            </p> 
                            <p className="mr-4">
                                1-8
                            </p>
                            <p>
                                dari 100
                            </p>
                            <ChevronLeftIcon className="size-6"/>
                            <ChevronRightIcon className="size-6"/>
                        </div>
                    </div>
                </div>
            </div>
            <SectionEvent/>
            <FooterLanding/>
        </div>
    )
}