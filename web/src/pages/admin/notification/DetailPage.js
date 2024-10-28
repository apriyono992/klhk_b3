import RootAdmin from '../../../components/layouts/RootAdmin'
import { useParams } from 'react-router-dom';
import Timeline from '../../../components/fragments/admin/notification/Timeline';
import Form from '../../../components/fragments/admin/notification/Form';
import HeaderPage from '../../../components/elements/HeaderPage';

export default function DetailPage() {
    const { id } = useParams();

    return (
        <RootAdmin>
            <HeaderPage title={id} subtitle="Kode Registrasi Notifikasi"  />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-3'>
                <Timeline/>
                <Form/>
            </div>
        </RootAdmin>
    )
}
