import React from 'react'
import CompanySection from './CompanySection';
import TableMaterial from './TableMaterial';

export default function Information() {
    return (
        <div className='grid md:grid-cols-4 gap-3'>
            <CompanySection className="col-span-4 md:col-span-1" />
            <TableMaterial className="col-span-4 md:col-span-3"/>
        </div>
    )
}