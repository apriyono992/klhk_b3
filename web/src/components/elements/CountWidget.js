import { Card, CardBody } from '@nextui-org/react'
import React from 'react'

export default function CountWidget({ title, count, icon, color}) {
    return (
        <Card radius="sm" className="px-4 py-1 group ">
            <CardBody className="w-full flex flex-row items-center gap-2">
                <div className={`${color} p-2.5 rounded-full`}>
                    {icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold leading-tight">{count}</span>
                    <span className="text-sm leading-tight text-slate-400">{title}</span>
                </div>
            </CardBody>
        </Card>
    )
}
