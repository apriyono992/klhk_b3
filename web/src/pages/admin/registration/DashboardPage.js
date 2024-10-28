import React from 'react'
import RootAdmin from '../../../components/layouts/RootAdmin'
import { Card, CardBody } from '@nextui-org/react'

export default function DashboardPage() {
    return (
        <RootAdmin>
            <Card radius='sm'>
                <CardBody>
                    Dashboard Registrasi
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
