import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import InlineEditInput from "../../../../elements/InlineEditInput";
import { updatePerusahaan } from "../../../../../services/api";
import { useParams } from "react-router-dom";

export default function CompanySection({ className, dataCompany }) {
    const { id } = useParams();

    function onSubmitName(data) {
        const name = {nama_perusahaan: data.text}

        try {
            const response = updatePerusahaan(id, name);
            console.log(response, 'success');
        } catch (error) {
            console.log('error update:', error)
        }
    }

    function onSubmitAddress(data) {
        const name = {alamat_perusahaan: data.text}

        try {
            const response = updatePerusahaan(id, name);
            console.log(response, 'success');
        } catch (error) {
            console.log('error update:', error)
        }
    }


    const data = [
        {
            'label': 'Nama Perusahaan',
            'value': <InlineEditInput value={dataCompany?.nama_perusahaan || dataCompany?.company?.name} onSubmit={onSubmitName}/>
        },
        {
            'label': 'Alamat Kantor Pusat',
            'value': <InlineEditInput multiline value={dataCompany?.alamat_perusahaan} onSubmit={onSubmitAddress} />
        },
        {
            'label': 'Nomor Telepon',
            'value': <span className='text-sm font-medium'>{dataCompany?.company?.telpKantor}</span>
        },
        {
            'label': 'Nomor Fax',
            'value': <span className='text-sm font-medium'>{dataCompany?.company?.faxKantor}</span>
        },
        {
            'label': 'NPWP',
            'value': <span className='text-sm font-medium'>{dataCompany?.company?.npwp}</span>
        },
        {
            'label': 'Nomor Induk Berusaha',
            'value': <span className='text-sm font-medium'>{dataCompany?.company?.nomorInduk}</span>
        }
    ]

    return (
        <Card className={className} radius="sm">
            <CardHeader>
                <p className="text-md">Data Perusahaan</p>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='flex flex-col gap-3'>
                    {data.map((item, index) => (
                        <div key={index} className='flex flex-col'>
                            <span className='text-xs text-gray-400'>{item.label}</span>
                            {item.value}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}