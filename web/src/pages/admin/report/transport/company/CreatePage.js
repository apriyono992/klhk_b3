import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Card, CardBody } from '@nextui-org/react'
import { useParams } from 'react-router-dom'

export default function CreatePage() {
    const { companyId } = useParams()
    return (
        <RootAdmin>
            <Card>
                <CardBody>

                </CardBody>
            </Card>
        </RootAdmin>
    )
}
