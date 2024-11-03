import { Button, Chip, Tab, Tabs } from '@nextui-org/react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import Validation from '../../../components/fragments/admin/recomendation/Validation';
import Review from '../../../components/fragments/admin/recomendation/review/Review';
import Draft from '../../../components/fragments/admin/recomendation/Draft';
import Information from '../../../components/fragments/admin/recomendation/Information';
import { useParams } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/24/outline';
import HeaderPage from '../../../components/elements/HeaderPage';
import useSWR from 'swr';
import { getFetcher } from '../../../services/api';

export default function DetailPage() {
    const { id } = useParams();
    const { data, isLoading, mutate } = useSWR(`/api/rekom/permohonan/${id}`, getFetcher)
    console.log(data);

    let tabs = [
        {
            id: "informasi",
            label: "Informasi",
            content: <Information data={data} />
        },
        {
            id: "validasi",
            label: "Validasi Teknis",
            content: <Validation data={data} isLoading={isLoading} mutate={mutate} />
        },
        {
            id: "telaah",
            label: "Telaah Teknis",
            content: <Review data={data} isLoading={isLoading} mutate={mutate} />
        },
        {
            id: "draft",
            label: "Draft SK",
            content: <Draft data={data} mutate={mutate}/>
        }
    ];

    return (
        <RootAdmin>
            <HeaderPage 
                title={data?.kodePermohonan} 
                subtitle="Kode Permohonan" 
                action={
                    <div className='flex items-center gap-3'>
                        <Chip size="sm" variant='bordered' color='primary'>{data?.status}</Chip>
                        <Button startContent={<DocumentIcon className="size-4"/>} size="sm" color="primary">View Draft SK</Button>
                    </div>
                }
            />
            <div className="flex w-full flex-col pt-5">
                <Tabs color="primary" radius="sm" size="md" variant="bordered" aria-label="form">\
                    {tabs.map((tab) => (
                        <Tab key={tab.id} title={tab.label}>
                            {tab.content}
                        </Tab>
                    ))}
                </Tabs>
            </div>  
        </RootAdmin>
    )
}
