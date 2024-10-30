import React from 'react'
import TableVehicle from './TableVehicle'
import TableMaterial from './TableMaterial'
import OtherSection from './OtherSection'
import DocumentReview from './DocumentReview'
import ChronologySection from './ChronologySection'
import { Button, useDisclosure } from '@nextui-org/react'
import ModalAlert from '../../../../elements/ModalAlert'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Review({ data, isLoading, mutate }) {
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();

    async function onReviewed() {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            toast.success('Telaah teknis selesai!');
        } catch (error) {
            toast.error('Gagal telaah!');
        }
    }

    return (
        <div className='flex flex-col gap-3'>
            <div className='mb-6'>
                <Button onPress={onOpenChangeModalAlert} color='warning' size='sm' startContent={<ArrowPathIcon className="size-4"/>}>Submit Telaah</Button>
            </div>
            <ChronologySection/>
            {/* <DocumentReview data={data}/> */}
            {/* <TableVehicle data={data} isLoading={isLoading} mutate={mutate} /> */}
            {/* <TableMaterial applicationId={data?.id}/> */}
            <OtherSection/>
            <ModalAlert
                heading="Submit Telaah?"
                description="Pastikan semua bagian sudah ditelaah"
                buttonSubmitText='Ya'
                icon='warning'
                onSubmit={onReviewed}
                isOpen={isOpenModalAlert}
                onOpenChange={onOpenChangeModalAlert}  
            />
        </div>
    )
}
