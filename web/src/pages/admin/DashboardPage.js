import React from "react";
import { 
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ClipboardDocumentIcon,
    CursorArrowRaysIcon,
    TableCellsIcon,
    TruckIcon,
    ViewfinderCircleIcon,
} from '@heroicons/react/24/outline';
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {
  Card, 
  CardBody, 
  Tabs, 
  Tab,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableColumn,
  CardHeader,
} from "@nextui-org/react";
import RootAdmin from "../../components/layouts/RootAdmin";
import { BarChart, PieChart } from "@mui/x-charts";

export default function DashboardPage() {
    return (
        <RootAdmin>
            <Tabs className="pt-3" color="primary" radius="sm" size="md" variant="bordered">
                <Tab key="overview" title={
                    <div className="flex items-center space-x-2">
                      <ChartBarIcon className="size-5"/>
                      <span className="mt-0.5">Umum</span>
                    </div>
                }>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <Card radius="sm" className="px-4 py-3 group ">
                                        <CardBody className="w-full flex flex-row items-center">
                                           <div className="w-full md:w-2/3 flex flex-col">
                                                <span className="text-2xl font-bold mb-4 text-primary">100 Pengajuan</span>
                                                <span className="text-sm mb-1">Registrasi B3</span>
                                                <div className="flex items-center gap-1 text-xs text-success">
                                                    <ArrowTrendingUpIcon className="size-3"/>
                                                    +5% dari bulan lalu
                                                </div>
                                           </div>
                                           <div className=" md:w-1/3 hidden md:flex justify-end">
                                                <ClipboardDocumentIcon className="size-20 stroke-slate-300 transform group-hover:rotate-12 ease-out duration-300"/>
                                           </div>
                                        </CardBody>
                                    </Card>
                                    <Card radius="sm" className="px-4 py-3 group ">
                                        <CardBody className="w-full flex flex-row items-center">
                                           <div className="w-full md:w-2/3 flex flex-col">
                                                <span className="text-2xl font-bold mb-4 text-secondary">10 Rekomendasi</span>
                                                <span className="text-sm mb-1">Rekomendasi B3</span>
                                                <div className="flex items-center gap-1 text-xs text-danger">
                                                    <ArrowTrendingDownIcon className="size-3"/>
                                                    -5% dari bulan lalu
                                                </div>
                                           </div>
                                           <div className="w-full md:w-1/3 flex justify-end">
                                                <CursorArrowRaysIcon className="size-20 stroke-slate-300 transform group-hover:rotate-12 ease-out duration-300"/>
                                           </div>
                                        </CardBody>
                                    </Card>
                                    <Card radius="sm" className="px-4 py-3 group ">
                                        <CardBody className="w-full flex flex-row items-center">
                                           <div className="w-full md:w-2/3 flex flex-col">
                                                <span className="text-2xl font-bold mb-4 text-warning">1000 Ton</span>
                                                <span className="text-sm mb-1">Realisasi B3</span>
                                                <div className="flex items-center gap-1 text-xs text-danger">
                                                    <ArrowTrendingDownIcon className="size-3"/>
                                                    -5% dari bulan lalu
                                                </div>
                                           </div>
                                           <div className="w-full md:w-1/3 flex justify-end">
                                                <TruckIcon className="size-20 stroke-slate-300 transform group-hover:rotate-12 ease-out duration-300"/>
                                           </div>
                                        </CardBody>
                                    </Card>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                            <Card radius="sm">
                                <CardHeader>
                                    <span className="text-lg font-bold">Grafik B3</span>
                                </CardHeader>
                                <CardBody>
                                    <BarChart
                                        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]}
                                        series={[{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }]}
                                        height={300}
                                    />
                                </CardBody>
                            </Card>
                            <Card radius="sm">
                                <CardHeader>
                                    <span className="text-lg font-bold">Grafik B3</span>
                                </CardHeader>
                                <CardBody>
                                    <PieChart
                                        series={[
                                            {
                                            data: [
                                                { id: 0, value: 10, label: 'series A' },
                                                { id: 1, value: 15, label: 'series B' },
                                                { id: 2, value: 20, label: 'series C' },
                                            ],
                                            },
                                        ]}
                                        height={200}
                                    />
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </Tab>

                <Tab key="sebaran" title={
                    <div className="flex items-center space-x-2">
                        <ViewfinderCircleIcon className="size-5"/>
                        <span className="mt-0.5">Data Sebaran B3</span>
                    </div>
                }>
                    <Card className="rounded-md">
                        <CardBody>
                            <MapContainer center={[-0.574469, 117.015867]} zoom={5} className="w-full h-[600px] z-10">
                                <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            </MapContainer>
                        </CardBody>
                    </Card>  
                </Tab>

                <Tab key="table" title={
                    <div className="flex items-center space-x-2">
                        <TableCellsIcon className="size-5"/>
                        <span className="mt-0.5">Tabel Data B3</span>
                    </div>
                }>
                    <Card className="rounded-md">
                        <CardBody>
                        <Table>
                            <TableHeader>
                                <TableColumn>Bahan B3</TableColumn>
                                <TableColumn>Impor (/ton)</TableColumn>
                                <TableColumn>Ekspor (/ton)</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow key="1">
                                    <TableCell>Argon Compressed</TableCell>
                                    <TableCell>1.000</TableCell>
                                    <TableCell>700</TableCell>
                                </TableRow>
                                <TableRow key="2">
                                    <TableCell>Nitrogen</TableCell>
                                    <TableCell>800</TableCell>
                                    <TableCell>1.500</TableCell>
                                </TableRow>
                                <TableRow key="3">
                                    <TableCell>Thinner</TableCell>
                                    <TableCell>966</TableCell>
                                    <TableCell>562</TableCell>
                                </TableRow>
                                <TableRow key="4">
                                    <TableCell>Loctite MR 5009</TableCell>
                                    <TableCell>953</TableCell>
                                    <TableCell>1685</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        </CardBody>
                    </Card>  
                </Tab>
            </Tabs>
        </RootAdmin>
    );
}