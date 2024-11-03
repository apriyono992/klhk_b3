import RootAdmin from '../../../components/layouts/RootAdmin'
import { useParams } from 'react-router-dom';
import Timeline from '../../../components/fragments/admin/notification/Timeline';
import Form from '../../../components/fragments/admin/notification/Form';
import HeaderPage from '../../../components/elements/HeaderPage';
import useSWR from 'swr';
import { getFetcher } from '../../../services/api';

export default function DetailPage() {
    const { id } = useParams();
    const { data, isLoading, mutate } = useSWR(`/api/notifikasi/${id}`, getFetcher);
    console.log(data);
    
    return (
        <RootAdmin>
            <HeaderPage title={data?.company?.name} subtitle="Notifikasi Perusahaan"  />
            <div className='grid grid-cols-1 md:grid-cols-5 gap-3 pt-3'>
                <Timeline data={data} isLoading={isLoading} className='col-span-3'/>
                <Form data={data} mutate={mutate} className='col-span-2' />
            </div>
        </RootAdmin>
    )
}
