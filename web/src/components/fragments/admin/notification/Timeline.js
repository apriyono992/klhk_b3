import { CalendarIcon } from '@heroicons/react/24/outline'
import { Avatar, Card, CardBody, ScrollShadow, Spinner } from '@nextui-org/react'
import React from 'react'
import { formattedDate } from '../../../../services/helpers';

export default function Timeline({ data, isLoading, className }) {
    return (
        <Card radius='sm' className={className}>
            <CardBody>
                <ScrollShadow hideScrollBar size={100} className="p-5 h-[400px]">
                    {isLoading && (
                        <div className='flex h-full items-center justify-center'>
                            <Spinner/>
                        </div>
                    )}
                   
                    <ol className="relative border-s border-gray-2000">
                        {data?.statusHistory.map((item, index) => (
                            <li key={index} className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center bg-blue-100 rounded-full -start-4 ring-8 ring-white">
                                    <Avatar icon={<CalendarIcon className='size-4' />} size='sm' />
                                </span>
                                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="items-center justify-between mb-3 sm:flex">
                                        <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{formattedDate(item.tanggalPerubahan)}</time>
                                        <div className='flex flex-col gap-1'>
                                            <span className="text-sm font-normal leading-3">{item.newStatus}</span>
                                            <span className='text-xs leading-3 text-gray-500'>Diganti oleh {item.changedBy ?? '-'}</span>
                                        </div>
                                    </div>
                                    <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                                        <span>Catatan: </span>
                                        {item.notes ?? '-'}
                                    </div>
                                </div>
                            </li>
                        ))}                  
                    </ol>
                </ScrollShadow>
            </CardBody>
        </Card>
    )
}
