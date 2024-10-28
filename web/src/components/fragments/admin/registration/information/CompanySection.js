import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import InlineEditInput from "../../../../elements/InlineEditInput";

export default function CompanySection({ className }) {
    function onSubmitName(data) {
        console.log(data);
    }
    function onSubmitAddress(data) {
        console.log(data);
    }


    const data = [
        {
            'label': 'Nama Perusahaan',
            'value': <InlineEditInput value='PT. XYZ' onSubmit={onSubmitName}/>
        },
        {
            'label': 'Alamat Kantor Pusat',
            'value': <InlineEditInput multiline value='Wisma Budi Lantai 8 dan 9, Jl.HR.Rasuna Said Kav.C6 Jakarta Selatan' onSubmit={onSubmitAddress} />
        },
        {
            'label': 'Nomor Telepon',
            'value': <span className='text-sm font-medium'>0215213383</span>
        },
        {
            'label': 'Nomor Fax',
            'value': <span className='text-sm font-medium'>0215213383</span>
        },
        {
            'label': 'NPWP',
            'value': <span className='text-sm font-medium'>0816512132486514</span>
        },
        {
            'label': 'Nomor Induk Berusaha',
            'value': <span className='text-sm font-medium'>0816512132486514</span>
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