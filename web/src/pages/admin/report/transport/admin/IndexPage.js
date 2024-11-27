import { Button, Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import React, { useMemo, useState } from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin';
import AdminTablePeriod from '../../../../../components/fragments/admin/report/transport/AdminTablePeriod';
import IsValidIcon from '../../../../../components/elements/isValidIcon';
import { month } from '../../../../../services/enum';
import useSWR from 'swr';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';
import { getFetcher } from '../../../../../services/api';
import FilterReactSelect from '../../../../../components/elements/FilterReactSelect';
import CustomDataGrid from '../../../../../components/elements/CustomDataGrid';
import { EyeIcon } from '@heroicons/react/24/outline';
import AdminTableHistory from '../../../../../components/fragments/admin/report/transport/AdminTableHistory';

export default function IndexPage() {
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
                            <AdminTablePeriod/>
                        </Tab>
                        <Tab key="2" title="Riwayat">
                            <AdminTableHistory />
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}