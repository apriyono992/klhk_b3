import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Card, CardBody, CardHeader, Chip, Divider, TableCell, TableRow } from '@nextui-org/react'
import { deleteFetcher, deleteWithFormFetcherTest, getFetcher } from '../../../../../services/api';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import Error from '../../../../../components/fragments/Error';
import { TrashIcon } from '@heroicons/react/24/outline';
import IsValidIcon from '../../../../../components/elements/isValidIcon';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import FormAddImage from '../../../../../components/fragments/admin/report/storage/FormAddImage';
import ButtonModalAlert from '../../../../../components/elements/ButtonModalAlert';
import ModalImageView from '../../../../../components/fragments/admin/report/storage/ModalImageView';
import toast from 'react-hot-toast';
import { isResponseErrorObject } from '../../../../../services/helpers';

export default function DetailPage() {
    const { id } = useParams();
    const { data, isLoading, error, mutate } = useSWR(`/api/penyimpananB3/${id}`, getFetcher)
    
    const header = [
        'Nama', 
        'Validasi', 
        'Catatan', 
        'Aksi'
    ];

    const content = (item) => (
        <TableRow key={item.id}>
            <TableCell>{item.tipeDokumen}</TableCell>
            <TableCell><IsValidIcon value={item.isApproved} /></TableCell>
            <TableCell>{item.notes}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1">
                    {item?.photosPenyimpananB3?.length > 0 && (
                        <ModalImageView list={item.photosPenyimpananB3} />
                     )}
                    {item?.status !== 'Rejected' && item?.status !== 'Approved' &&  item?.photosPenyimpananB3?.length > 0 && (
                        <ButtonModalAlert
                            buttonIsIconOnly={true}
                            buttonTitle={<TrashIcon className='size-4'/>}
                            buttonColor="danger"
                            modalIcon="danger"
                            modalHeading="Hapus Foto?"
                            modalDescription="Semua foto di kategori ini akan dihapus"
                            buttonSubmitText="Hapus"
                            buttonCancelText="Batal"
                            onSubmit={() => onDelete(item)}
                        />
                     )}
                </div>
            </TableCell>
        </TableRow>
    );

    async function onDelete(item) {
        try {
            const ids = item?.photosPenyimpananB3.map(photo => photo.id);
            console.log(ids);
            await deleteWithFormFetcherTest('api/penyimpananB3/delete-document', { photoIds: ids });
            mutate()
            toast.success('Foto berhasil dihapus!')
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }    
    }
    
    if (error?.status === 404) return (<Error code={error?.status} header="Tidak ditemukan" message="Pastikan URL penyimpanan b3 sudah sesuai"/>) 

    return (
        <RootAdmin>
            <div className='flex gap-3'>
                <Card radius='sm' className='w-full'>
                    <CardHeader>
                        <div className='w-full flex items-center justify-between'>
                            <span>Foto Gudang Penyimpanan B3</span>
                            <Chip
                                color={
                                    data?.penyimpananB3?.status === 'Rejected'
                                        ? 'danger'
                                        : data?.penyimpananB3?.status === 'Pending'
                                        ? 'warning'
                                        : data?.penyimpananB3?.status === 'Menunggu Verifikasi'
                                        ? 'primary'
                                        : data?.penyimpananB3?.status === 'Review by Admin'
                                        ? 'secondary'
                                        : data?.penyimpananB3?.status === 'Approved'
                                        ? 'success'
                                        : data?.penyimpananB3?.status === 'Delete'
                                        ? 'default'
                                        : 'default'
                                }
                            >
                                {data?.penyimpananB3?.status}
                            </Chip>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className='w-full flex items-center gap-2 mb-3'>
                            <FormAddImage data={data} mutate={mutate}/>
                        </div>
                        <ClientTablePagination
                            data={data?.penyimpananB3?.PenyimpananB3Persyaratan?.map((item) => ({
                                ...item,
                                status: data?.penyimpananB3?.status,
                            }))}
                            header={header}
                            content={content}
                            isLoading={isLoading}
                        />
                    </CardBody>
                </Card>
            </div>
        </RootAdmin>
    )
}
