import { Button, Tab, Tabs } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import Information from "../../../components/fragments/admin/registration/information/Information";
import Draft from "../../../components/fragments/admin/registration/Draft";
import { DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import HeaderPage from "../../../components/elements/HeaderPage";
import { getDetailRegistrasi, submitSK } from "../../../services/api";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

export default function DetailPage() {
    const { id } = useParams();
    const [dataDetail, setDataDetail] = useState(null)
    
    useEffect(() => {
        fetchDetail(id)
    }, [])

    const fetchDetail = async (param) => {
        try {
            const detail = await getDetailRegistrasi(param);
            setDataDetail(detail);
        } catch (error) {
            console.log('error fetching:', error)
        }
    }

    const onSubmit = async () => {
        try {
            const response = await submitSK(id);
            console.log(response, 'success');
            toast.success('Berhasil Submit SK')
        } catch (error) {
            console.log('error fetching:', error)
            toast.error('Gagal buat draft sk!');
        }
    }
    

    let tabs = [
        {
            id: "informasi",
            label: "Informasi",
            content: <Information dataB3={dataDetail} company={dataDetail}/>
        },
        {
            id: "draft",
            label: "Draft SK",
            content: <Draft detailRegistrasi={dataDetail}/>
        }
    ];

    return (
        <RootAdmin>
            <HeaderPage 
                title={dataDetail?.nomor} 
                subtitle="No. Reg. Bahan B3" 
                action={
                    <div className="flex items-center gap-3">
                        <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onSubmit}>Kirim INSW</Button>
                        <Button startContent={<DocumentIcon className="size-4"/>} size="sm" color="primary" variant="faded">View Draft SK</Button>
                    </div>
                } 
            />
            <div className="flex w-full flex-col justify-between pt-5">
                <Tabs color="primary" radius="sm" size="md" variant="bordered" aria-label="form">
                    {tabs.map((tab) => (
                        <Tab key={tab.id} title={tab.label}>
                            {tab.content}
                        </Tab>
                    ))}
                </Tabs>
            </div>  
        </RootAdmin>
    )
};
