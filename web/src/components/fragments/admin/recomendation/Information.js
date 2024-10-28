import React from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
export default function Informattion({ data }) {
    const items = (item) => [
        {
            label: "Nama Perusahaan",
            value: item.identitasPemohon.name,
            column: ''
        },
        {
            label: "Status",
            value: <Chip size="sm" className="bg-blue-500 text-white">{item.status}</Chip>,
            column: ''
        },
        {
            label: "Nama Penanggung Jawab",
            value: item.identitasPemohon.penanggungJawab,
            column: ''
        },
        {
            label: "Tipe Surat",
            value: <Chip size="sm" className="bg-blue-500 text-white">{item.tipeSurat}</Chip>,
            column: ''
        },
        {
            label: "Alamat Kantor",
            value: item.identitasPemohon.alamatKantor,
            column: 'col-span-2'
        },
        {
            label: "Nomor Telepon",
            value: item.identitasPemohon.telpKantor,
            column: 'col-span-2'
        },
        {
            label: "Alamat Pool",
            value: item.identitasPemohon.alamatPool.map((alamat, index) => <div>{index+1}. {alamat}</div>),
            column: 'col-span-2'
        },
        {
            label: "Bidang Usaha",
            value: item.identitasPemohon.bidangUsaha,
            column: 'col-span-2'
        },
    ];

    return (
        <Card radius="sm">
            <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {items(data).map((item, index) => (
                    <div key={index} className={`flex flex-col ${item.column}`}>
                        <span className='text-xs text-gray-400 uppercase'>{item.label}</span>
                        <span className='text-sm font-medium'>{item.value}</span>
                    </div>
                ))}
            </CardBody>
        </Card>
    )
}

