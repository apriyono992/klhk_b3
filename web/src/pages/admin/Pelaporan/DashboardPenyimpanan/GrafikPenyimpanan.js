
import { Button, Card, CardBody, CardHeader, Tabs, Tab, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import RootAdmin from "../../../../components/layouts/RootAdmin";
import { BarChart } from '@mui/x-charts/BarChart';

export default function PelaporanPenyimpananGrafik() {
   
    const labels = ['a', 'b', 'c']
    const values = ['1', '2', '3']

    return (
        <RootAdmin>
           <Card radius='sm' className='col-span-4 p-3'>
                    <Tabs defaultValue='Import'>
                        <Tab title="Import" value="import">
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
                        <Tab title="Produsen" value="produsen">
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
                            
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                        </TableBody>
                    </Table>
                </div>
        </RootAdmin>
    );
}
