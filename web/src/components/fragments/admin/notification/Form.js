import { Card, CardBody, Input } from '@nextui-org/react'
import React from 'react'

export default function Form() {
    return (
        <Card radius='sm'>
            <CardBody>
                <form>
                    <Input type="email" label="Email" />
                    <Input type="email" label="Email" />
                    <Input type="email" label="Email" />
                    <Input type="email" label="Email" />
                </form>
            </CardBody>
        </Card>
    )
}
