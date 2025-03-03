import {Button, Chip, Tab, Tabs} from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import Information from "../../../components/fragments/admin/registration/information/Information";
import Draft from "../../../components/fragments/admin/registration/Draft";
import { DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import HeaderPage from "../../../components/elements/HeaderPage";
import {
    exportJsonINSW,
    getDetailRegistrasi, getFetcher,
    getPdfUrl,
    sendInsw, submitSK,
    putFetcherWithoutId
} from "../../../services/api";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import {getRoles, hasValidRole} from "../../../services/helpers";
import {roleName} from "../../../services/enum";
import DraftDireksi from "../../../components/fragments/admin/registration/DraftDireksi";
import {saveAs} from 'file-saver'
import Validation from "../../../components/fragments/admin/registration/information/Validation";
import useSWR from "swr";
import StatusPermohonanRegistrasi from "../../../enums/statusRegistrasi";
import useAuth from "../../../hooks/useAuth";
import RolesAccess from "../../../enums/roles";

export default function DetailPage() {
    const {user, roles} = useAuth();
    const { id } = useParams();
    const {data: dataDetail, isLoading, mutate} = useSWR(`/api/registrasi/${id}`, getFetcher)
    const [activeTab, setActiveTab] = useState("informasi");

    const onSubmit = async () => {
        const data = {
            id: id,
            status: 'riwayat',
            approval_status: 'selesai',
            jnsPengajuan: '0100000000'
        }
        try {
            const response = await sendInsw(data);
            await putFetcherWithoutId(`/api/registrasi/update-status-registrasi/${id}/${StatusPermohonanRegistrasi.SELESAI}`); 
            mutate();
            toast.success('Berhasil Kirim ke INSW')
        } catch (error) {
            console.log('error fetching:', error)
            toast.error(error.response.data.message.message);
        }
    }

    const onSubmitDraft = async () => {
        try {
            const response = await submitSK(id);
            toast.success('Berhasil Submit Data Draft SK')
            mutate();
        } catch (error) {
            console.log('error fetching:', error)
            toast.error(error.response.data.message);
        }
    }

    const onPressExport = async () => {
        const data = {
            id: id,
            jnsPengajuan: '0100000000'
        }
        try {
            const response = await exportJsonINSW(data);
            const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' });
            saveAs(blob, 'data-export.json');
            toast.success('Berhasil Export JSON')
            console.log(response, 'success');
        } catch (error) {
            toast.error('Gagal Export JSON!');
            console.log('error fetching:', error)
        }
    }

    const fetchPreview = async (endpoint) => {
        try {
            await getPdfUrl(endpoint)
        }
        catch (error) {
            toast.error('Failed to open PDF');
        }
    }

    const handleTabChange = (tabId) => {
        const selectedTab = tabs.find((tab) => tab.id === tabId);
        if (selectedTab && !selectedTab.disabled) {
            setActiveTab(tabId); // Only update activeTab if the tab is not disabled
        }
    };

    let tabs = [
        {
            id: "informasi",
            label: "Informasi",
            content: <Information dataB3={dataDetail} company={dataDetail}/>
        },
        {
            id: "validasi",
            label: "Verifikasi Teknis",
            content: <Validation registrasi={dataDetail}/>
        },
        {
            id: "draft",
            label: "Draft SK",
            content: getRoles() === roleName.direksi ? <DraftDireksi id={id}/> : <Draft id={id} dataTembusan={dataDetail?.RegistrasiTembusan} mutate={mutate} data={dataDetail}/>
        }
    ];

    return (
        <RootAdmin>
            <HeaderPage
                title={dataDetail?.no_reg}
                subtitle="No. Reg. Bahan B3"
                action={
                    <div className="flex items-center gap-3">
                        <Chip size="sm" variant="bordered" color="primary" className={'capitalize'}>{dataDetail?.status}</Chip>
                        {
                            dataDetail?.status === StatusPermohonanRegistrasi.KIRIM_INSW && hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]) &&
                            <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onSubmit}>Kirim INSW</Button>
                        }
                        {
                            dataDetail?.status === StatusPermohonanRegistrasi.KIRIM_INSW && hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI]) 
                            && <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onPressExport}>Export</Button>
                        }
                        {
                            dataDetail?.status === StatusPermohonanRegistrasi.DRAFT_SK_TANDA_TANGAN_DIREKTUR && hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.DIREKTUR]) && 
                            <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onSubmitDraft}>Submit Draft</Button>
                        }
                        {
                            dataDetail?.status != StatusPermohonanRegistrasi.VERIFIKASI_TEKNIS &&  hasValidRole(roles, [RolesAccess.SUPER_ADMIN, RolesAccess.PIC_REGISTRASI])
                            && <Button
                                startContent={<DocumentIcon className="size-4"/>}
                                size="sm"
                                color="primary"
                                variant="faded"
                                onPress={() => fetchPreview(`/api/pdf/generateRegistrasiB3/${id}`)}
                            >View Draft SK</Button>
                        }
                    </div>
                }
            />
            <div className="flex w-full flex-col justify-between pt-5">
                <Tabs
                    color="primary"
                    radius="sm"
                    size="md"
                    variant="bordered"
                    aria-label="form"
                    selectedKey={activeTab}
                    onSelectionChange={(key) => handleTabChange(key)}
                >
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
