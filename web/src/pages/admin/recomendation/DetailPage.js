import { useState } from 'react';
import { Button, Chip, Tab, Tabs } from '@nextui-org/react';
import RootAdmin from '../../../components/layouts/RootAdmin';
import Validation from '../../../components/fragments/admin/recomendation/Validation';
import Review from '../../../components/fragments/admin/recomendation/review/Review';
import Draft from '../../../components/fragments/admin/recomendation/Draft';
import Information from '../../../components/fragments/admin/recomendation/Information';
import { useParams } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/24/outline';
import HeaderPage from '../../../components/elements/HeaderPage';
import useSWR from 'swr';
import toast from "react-hot-toast";
import { getFetcher, getPdfUrl } from '../../../services/api';

export default function DetailPage() {
    const { id } = useParams();
    const { data, isLoading, mutate } = useSWR(`/api/rekom/permohonan/${id}`, getFetcher);
    const [activeTab, setActiveTab] = useState("informasi");
    const disableTelaahAndDraftSK = ['PENDING', 'VALIDASI_PEMOHONAN_DITOLAK', 'VALIDASI_PEMOHONAN', 'PEMOHONAN_DI_PROSES', 'DRAFT_PERMOHONAN'].includes(data?.status);
    let tabs = [
        {
            id: "informasi",
            label: "Informasi",
            content: <Information data={data} />,
            disabled: false // Always enabled
        },
        {
            id: "validasi",
            label: "Validasi Teknis",
            content: <Validation data={data} isLoading={isLoading} mutate={mutate} />,
            disabled: false // Disabled as per example
        },
        {
            id: "telaah",
            label: "Telaah Teknis",
            content: <Review data={data} isLoading={isLoading} mutate={mutate} />,
            disabled: disableTelaahAndDraftSK,
        },
        {
            id: "draft",
            label: "Draft SK",
            content: <Draft data={data} mutate={mutate} />,
            disabled: disableTelaahAndDraftSK,
        }
    ];

    const handleTabChange = (tabId) => {
        const selectedTab = tabs.find((tab) => tab.id === tabId);
        if (selectedTab && !selectedTab.disabled) {
            setActiveTab(tabId); // Only update activeTab if the tab is not disabled
        }
    };

    const openPdfDirectly = async (endpoint) => {
        try {
            await getPdfUrl(endpoint)
        }
        catch (error) {
            toast.error('Failed to open PDF');
        }
    };

    return (
        <RootAdmin>
            <HeaderPage 
                title={data?.kodePermohonan} 
                subtitle="Kode Permohonan" 
                action={
                    <div className="flex items-center gap-3">
                        <Chip size="sm" variant="bordered" color="primary">{data?.status}</Chip>
                        {!disableTelaahAndDraftSK ? (
                            <><Button startContent={<DocumentIcon className="size-4" />} size="sm" color="primary"  onPress={() => openPdfDirectly(`/api/pdf/generateTelaahTeknis/${id}`)}>
                               View Telaah Teknis
                            </Button><Button startContent={<DocumentIcon className="size-4" />} size="sm" color="primary" onPress={() => openPdfDirectly(`/api/pdf/generateRekomendasiB3/${id}`)}>
                                    View Draft SK
                                </Button></>
                        ) : null}
                    </div>
                }
            />
            <div className="flex w-full flex-col pt-5">
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
                        <Tab key={tab.id} title={tab.label} disabled={tab.disabled}>
                            {tab.content}
                        </Tab>
                    ))}
                </Tabs>
            </div>  
        </RootAdmin>
    );
}
