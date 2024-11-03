import { CalendarIcon } from '@heroicons/react/24/outline'
import { Avatar, Button, Card, CardBody, ScrollShadow, Spinner } from '@nextui-org/react'
import React from 'react'
import { diffForHuman, formattedDate } from '../../../../services/helpers';
import useCustomNavigate from '../../../../hooks/useCustomNavigate';

export default function Timeline({ data, isLoading, className }) {
    const { getNotificationImportVerificationDraftPath } = useCustomNavigate();
    const statusHistory = data?.statusHistory?.map((item, index, array) => {
        if (index === 0) {
            return {
                ...item,
                timeDiff: null
            };
        } else {
            const previousDate = array[index - 1].tanggalPerubahan;
            return {
                ...item,
                timeDiff: diffForHuman(previousDate, item.tanggalPerubahan)
            };
        }
    });
    
    return (
        <Card radius='sm' className={className}>
            <CardBody>
                <ScrollShadow hideScrollBar className="p-5 h-[400px]">
                    {isLoading && (
                        <div className='flex h-full items-center justify-center'>
                            <Spinner/>
                        </div>
                    )}
                   
                    <ol className="relative border-s border-gray-2000">
                        {statusHistory?.map((item, index) => (
                            <li key={index} className="mb-10 ms-6">
                                <span className="absolute flex items-center justify-center bg-blue-100 rounded-full -start-4 ring-8 ring-white">
                                    <Avatar icon={<CalendarIcon className='size-4' />} size='sm' />
                                </span>
                                <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className='flex flex-col gap-1'>
                                            <span className="text-sm font-normal leading-3">{item.newStatus}</span>
                                            <span className='text-xs leading-3 text-gray-500'>Diganti oleh {item.changedBy ?? '-'}</span>
                                            <span className='text-xs leading-3 text-gray-500'>Diproses dalam waktu: {item.timeDiff ?? '-'}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-sm font-normal text-gray-400'>Tanggal Perubahan</span>
                                            <time className="text-xs font-normal text-gray-400">{formattedDate(item.tanggalPerubahan)}</time>
                                        </div>
                                    </div>
                                    <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                                        <span>Catatan: </span>
                                        {item.notes ?? '-'}
                                    </div>
                                    <div className='flex justify-end pt-3'>
                                        {(() => {
                                            switch (item.newStatus) {
                                                case "Kirim Surat Kebenaran Impor ke Importir":
                                                    return <Button onPress={() => getNotificationImportVerificationDraftPath(item.notifikasiId)} color='primary' size='sm'>Buat Draft Surat</Button>;
                                                default:
                                                    return null;
                                            }
                                        })()}
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
