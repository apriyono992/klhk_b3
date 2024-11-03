import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
export default function Information({ data }) {
    const identity = (item) => [
        {
            label: "Nama Pehomon",
            value: item?.identitasPemohon?.namaPemohon
        },
        {
            label: "Email",
            value: item?.identitasPemohon?.email,
        },
        {
            label: "No. Telepon",
            value: item?.identitasPemohon?.teleponFax,
        },
        {
            label: "Alamat Domisili",
            value: item?.identitasPemohon?.alamatDomisili,
        },
    ];

    const company = (item) => [
        {
            label: "Nama Perusahaan",
            value: item?.company?.name
        },
        {
            label: "Email",
            value: item?.company?.emailKantor
        },
        {
            label: "Telepon Kantor",
            value: item?.company?.telpKantor
        },
        {
            label: "Fax Kantor",
            value: item?.company?.faxKantor
        },
        {
            label: "Bidang Usaha",
            value: item?.company?.bidangUsaha
        },
        {
            label: "Alamat Kantor",
            value: item?.company?.alamatKantor
        },
        {
            label: "Alamat Pool",
            value: item?.company?.alamatPool?.map((pool, index) => (<div key={index}>{index+1}. {pool}</div>)),
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card radius="sm">
                <CardHeader>
                    Identitas Pemohon
                </CardHeader>
                <Divider/>
                <CardBody className="flex flex-col gap-3">
                    {identity(data).map((item, index) => (
                        <div key={index} className={`flex flex-col ${item.column}`}>
                            <span className='text-xs text-gray-400 uppercase'>{item.label}</span>
                            <span className='text-sm font-medium'>{item.value}</span>
                        </div>
                    ))}
                </CardBody>
            </Card>
            <Card radius="sm">
                <CardHeader>
                    Identitas Perusahaan
                </CardHeader>
                <Divider/>
                <CardBody className="flex flex-col gap-3">
                    {company(data).map((item, index) => (
                        <div key={index} className={`flex flex-col ${item.column}`}>
                            <span className='text-xs text-gray-400 uppercase'>{item.label}</span>
                            <span className='text-sm font-medium'>{item.value}</span>
                        </div>
                    ))}
                </CardBody>
            </Card>
        </div>
    )
}

