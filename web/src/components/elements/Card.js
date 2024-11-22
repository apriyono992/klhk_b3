import { format } from 'date-fns'
import { UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { BASE_URL } from '../../services/api'

export default function Card({ data }) {
    return (
        <div className="relative h-96 w-[90%] rounded-lg overflow-hidden shadow-lg bg-white mb-4">
            <div className="relative h-40 overflow-hidden">
                <img src={`${BASE_URL}${data.photoUrls[0]}`} alt="Event" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-[37%] left-6 bg-[#05472A] text-white text-sm px-3 py-2 inline-block mb-12">
                {format(data.createdAt, 'LLL ii, yyyy')}
            </div>
            <div className="pl-6 pr-8 pt-10">
                <div className="flex items-center space-x-2 text-[#5D7987] text-sm mb-4">
                    <span className="font-medium flex flex-row">
                        <UserIcon className="size-6 mr-2" />
                        {data.author}
                    </span>
                    <span className="flex flex-row">
                        <DocumentTextIcon className="size-6 mr-2" />
                        {data.category}
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{data.title}</h3>
                <a href="#" className="text-[#5D7987] cursor-pointer font-semibold hover:underline">
                    Lanjut Membaca ➔
                </a>
            </div>
        </div>
    )
}
