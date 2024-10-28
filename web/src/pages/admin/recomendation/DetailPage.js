import { Button, Tab, Tabs } from '@nextui-org/react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import Validation from '../../../components/fragments/admin/recomendation/Validation';
import Review from '../../../components/fragments/admin/recomendation/review/Review';
import Draft from '../../../components/fragments/admin/recomendation/Draft';
import Information from '../../../components/fragments/admin/recomendation/Information';
import { useParams } from 'react-router-dom';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import HeaderPage from '../../../components/elements/HeaderPage';

export default function DetailPage() {
    const { id } = useParams();

    const [data, setData] = useState({
        kodePermohonan: "B3-2024-001",
        status: "DRAFT_PERMOHONAN",
        tipeSurat: 'Baru',
        identitasPemohon: {
            name: "PT Example Company",
            penanggungJawab: "John Doe",
            alamatKantor: "Jl. HR. Rasuna Said Kav. C6 Jakarta Selatan 12190",
            telpKantor: "021-1234567",
            alamatPool: [
                "Jl. Merdeka No. 1",
                "Jl. Soekarno Hatta No. 10"
            ],
            bidangUsaha: "Manufacturing",
        },
        documents: [
            {
                id: "doc123",
                fileName: "document.pdf",
                documentType: "IMPROPER_HANDLING",
                fileUrl: "/uploads/documents/document.pdf",
                isValid: null,
                isArchived: false,
                validationNotes: null,
                telaahNotes: null
            }
        ],
        vehicles: [
            {
                id: "vehicle006",
                nomorPolisi: "B 3333 PQR",
                tipeKendaraan: "Truck",
                tahunPembuatan: 2020,
                nomorRangka: "35HBGHJBHSB6JBKJB",
                nomorMesin: "35HBGHJBHSB6JBKJB",
                pemilik: "PT. XYZ",
                status: "Active"
            }
        ]
    });

    let tabs = [
        {
            id: "informasi",
            label: "Informasi",
            content: <Information data={data} />
        },
        {
            id: "validasi",
            label: "Validasi Teknis",
            content: <Validation data={data}/>
        },
        {
            id: "telaah",
            label: "Telaah Teknis",
            content: <Review data={data} />
        },
        {
            id: "draft",
            label: "Draft SK",
            content: <Draft/>
        }
    ];

    return (
        <RootAdmin>
            <HeaderPage title={id} subtitle="Kode Permohonan" action={<Button startContent={<DocumentIcon className="size-4"/>} size="sm" color="primary">View Draft SK</Button>} />
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
