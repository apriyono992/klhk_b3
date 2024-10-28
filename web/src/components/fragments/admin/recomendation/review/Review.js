import React from 'react'
import TableVehicle from './TableVehicle'
import TableMaterial from './TableMaterial'
import OtherSection from './OtherSection'
import DocumentReview from './DocumentReview'

export default function Review({ data }) {
    return (
        <div className='flex flex-col gap-3'>
            <DocumentReview data={data}/>
            <TableVehicle/>
            <TableMaterial/>
            <OtherSection/>
        </div>
    )
}
