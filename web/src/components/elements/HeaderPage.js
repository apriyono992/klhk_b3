import { Card, CardBody } from '@nextui-org/react'
import React from 'react'

export default function HeaderPage({ title, subtitle, action }) {
    return (
        <Card radius='sm'>
            <CardBody>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-col'>
                        <span className='text-sm text-gray-400'>{ subtitle }</span>
                        <h1 className='font-semibold text-xl text-primary'>{ title }</h1>
                    </div>
                    {
                        action
                        ? action
                        : <div></div>
                    }
                </div>
            </CardBody>
        </Card>
    )
}
