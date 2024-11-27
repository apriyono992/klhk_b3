import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Card, CardBody, Tab, Tabs, } from '@nextui-org/react'
import CompanyTablePeriod from '../../../../../components/fragments/admin/report/transport/CompanyTablePeriod';
import CompanyTableHistory from '../../../../../components/fragments/admin/report/transport/CompanyTableHistory';

export default function RecomendationPage() {
    return (
        <RootAdmin>
            <Card radius="sm">
                <CardBody>
                    <Tabs
                        color="primary"
                        variant="underlined"
                        aria-label="tabs"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full",
                            tab: "max-w-fit px-1.5 h-12",
                            tabContent: "group-data-[selected=true]:font-semibold"
                        }}
                    >
                        <Tab key="1" title="Periode Aktif">
                            <CompanyTablePeriod/>
                        </Tab>
                        <Tab key="2" title="Riwayat">
                            <CompanyTableHistory />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}