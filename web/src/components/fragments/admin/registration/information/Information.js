import React from 'react'
import CompanySection from './CompanySection';
import TableMaterial from './TableMaterial';

export default function Information({dataB3, company}) {
    return (
        <div className='grid md:grid-cols-4 gap-3'>
            <CompanySection className="col-span-4 md:col-span-1" dataCompany={company}/>
            <TableMaterial className="col-span-4 md:col-span-3" dataB3={dataB3}/>
        </div>
    )
}