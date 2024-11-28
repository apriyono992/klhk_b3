import { Button, Card, CardBody, CardHeader, Divider, Tabs, Tab, Table } from "@nextui-org/react";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { getFetcher } from "../../../services/api";
import RootAdmin from "../../../components/layouts/RootAdmin";

export default function PelaporanDashboardPenyimpanan() {
   

    return (
        <RootAdmin>
           <Card radius='sm' className='col-span-4 p-3'>
                    <Tabs defaultValue={selectedtype}>
                        <Tab title="Import" value="import" onClick={() => console.log('test')
                        }>
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak (import)</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data: labels,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: values },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>                           
                        </Tab>
                        <Tab title="Produsen" value="produsen" onClick={() => handleTabClick('produsen')}>
                        <div>
                            <CardHeader>
                                <span className='text-primary text-xl font-bold'>10 Jenis B3 Terbanyak (Produsen)</span>
                            </CardHeader>
                            <CardBody className='w-full flex flex-col items-center py-5 text-center'>
                                <BarChart
                                    xAxis={[{
                                        scaleType: 'band',
                                        data:labels,
                                        label: 'Jenis B3',
                                        barGapRatio: 0,
                                        categoryGapRatio: 0.4,
                                    }]}
                                    series={[
                                        { data: values },
                                    ]}
                                    height={300}
                                />
                            </CardBody>
                        </div>
                        </Tab>
                    </Tabs>
                </Card>
                 <div className='col-span-4'>
                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>Perusahaan</TableColumn>
                            <TableColumn>Jumlah</TableColumn>
                        </TableHeader>
                        <TableBody>
                             {data?.responseData?.company?.map((data,index) => (
                                <TableRow key={index}>
                                    <TableCell>{data?.company_name}</TableCell>
                                    <TableCell>{data?.count} Registration</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
        </RootAdmin>
    );
}
