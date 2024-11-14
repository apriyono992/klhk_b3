import { Button, Tab, Tabs, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import RootAdmin from "../../../components/layouts/RootAdmin";
import Information from "../../../components/fragments/admin/registration/information/Information";
import Draft from "../../../components/fragments/admin/registration/Draft";
import { DocumentIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import HeaderPage from "../../../components/elements/HeaderPage";
import {exportJsonINSW, getDetailRegistrasi, getPreviewSK, sendInsw} from "../../../services/api";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import {getRoles} from "../../../services/helpers";
import {roleName} from "../../../services/enum";
import DraftDireksi from "../../../components/fragments/admin/registration/DraftDireksi";
import {saveAs} from 'file-saver'

export default function DetailPage() {
    const { id } = useParams();
    const [dataDetail, setDataDetail] = useState(null)
    const [pdfUrl, setPdfUrl] = useState('');
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

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
        const data = {
            id: id,
            status: 'kirim ke INSW',
            jnsPengajuan: '0100000000'
        }
        try {
            const response = await sendInsw(data);
            console.log(response, 'success');
            toast.success('Berhasil Kirim ke INSW')
        } catch (error) {
            console.log('error fetching:', error)
            toast.error(error.response.data.message.message);
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

    const fetchPreview = async () => {
        try {
            const response = await getPreviewSK(id);
            console.log(response, 'isi response')
            const pdfBlob = await response;
            console.log(pdfBlob, 'isi blob')
            const pdfUrl = URL.createObjectURL(pdfBlob);

            setPdfUrl(pdfUrl);
        } catch (e) {
            console.log('error get pdf registrasi', e)
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
            content: getRoles() === roleName.direksi ? <DraftDireksi id={id}/> : <Draft id={id}/>
        }
    ];

    return (
        <RootAdmin>
            <HeaderPage
                title={dataDetail?.no_reg}
                subtitle="No. Reg. Bahan B3"
                action={
                    <div className="flex items-center gap-3">
                        {
                            dataDetail?.approval_status == 'approved by direksi' &&
                            <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onSubmit}>Kirim INSW</Button>
                        }
                        {
                            dataDetail?.approval_status == 'approved by direksi' &&
                            <Button startContent={<PaperAirplaneIcon className="size-4"/>} size="sm" color="primary" onPress={onPressExport}>Export</Button>
                        }
                        {
                            !dataDetail?.is_draft &&
                            <Button
                                startContent={<DocumentIcon className="size-4"/>}
                                size="sm"
                                color="primary"
                                variant="faded"
                                onPress={() => {
                                        fetchPreview()
                                        onOpen()
                                    }}
                            >View Draft SK</Button>
                        }
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Preview Draft SK</ModalHeader>
                            <ModalBody>
                                <iframe
                                    src={pdfUrl}
                                    title="PDF Preview"
                                    width="100%"
                                    height="500px"
                                    style={{ marginTop: '20px', border: '1px solid black' }}
                                />
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </RootAdmin>
    )
};
