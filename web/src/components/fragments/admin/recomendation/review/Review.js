import React from 'react'
import TableVehicle from './TableVehicle'
import TableMaterial from './TableMaterial'
import OtherSection from './OtherSection'
import DocumentReview from './DocumentReview'
import ChronologySection from './ChronologySection'
import PejabatSelectorTable from './DataPejabat';
import { Button, useDisclosure } from '@nextui-org/react'
import ModalAlert from '../../../../elements/ModalAlert'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import FollowUp from './FollowUp'
import { useForm } from 'react-hook-form';
import StatusRekomendasi from '../../../../../enums/statusRekomendasi'

export default function Review({ data, isLoading, mutate }) {
    const {isOpen: isOpenModalAlert, onOpenChange: onOpenChangeModalAlert} = useDisclosure();
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();

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
            <div className=''>
                <Button onPress={onOpenChangeModalAlert}  isDisabled={( data?.status === StatusRekomendasi.PEMBUATAN_DRAFT_SK) || data?.status !== StatusRekomendasi.PEMBUATAN_DRAFT_SK } color='warning' size='sm' startContent={<ArrowPathIcon className="size-4"/>}>Submit Telaah</Button>
            </div>
            <ChronologySection existingData={data}/>
            <DocumentReview data={data} isLoading={isLoading} mutate={mutate}/>
            <TableVehicle data={data} isLoading={isLoading} mutate={mutate} />
            <TableMaterial data={data} isLoading={isLoading} mutate={mutate}/>
            <OtherSection existingOther={data}/>
            <FollowUp existingData={data}/>
            <PejabatSelectorTable existingPejabat={data} control={control} errors={errors} />
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
