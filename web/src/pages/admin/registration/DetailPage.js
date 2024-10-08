import { useParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, DatePicker, Divider, Input, Select as NextSelect, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Textarea } from "@nextui-org/react";
import DynamicModalForm from "../../../components/elements/DynamicModalForm";
import SelectSearch from "../../../components/elements/SelectSearch";
import RootAdmin from "../../../components/layouts/RootAdmin";

export default function EditPage() {
    const { id } = useParams();

    return (
        <RootAdmin>
            <div className="w-full flex gap-3 mt-3">
                <Card className="w-full md:w-1/4">
                    <CardHeader>
                        <div className="w-full flex items-center justify-between">
                            <p className="text-md font-semibold">Perusahaan</p>
                            <div className="flex items-center gap-2">
                                <DynamicModalForm buttonTitle="Edit" modalTitle="Form Edit Perusahaan" modalContent={<FormEditCompany/>} />
                            </div>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Kode DB KLH:</span>
                            <span className=" text-gray-400 text-sm italic">Tidak ada data</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Nama Perusahaan:</span>
                            <span className=" text-black font-medium text-sm">PT. DONGSUNG JAKARTA</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Alamat:</span>
                            <span className=" text-black font-medium text-sm">Jl. Raya Padjajaran No. 121 Kel. Gandasari Kec. Jati uwung KOTA TANGERANG PROVINSI BANTEN</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Telepon:</span>
                            <span className=" text-black font-medium text-sm">021-5910304</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Fax:</span>
                            <span className=" text-black font-medium text-sm">021-5910304</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">NPWP:</span>
                            <span className=" text-black font-medium text-sm">01.070.968.1-052.000</span>
                        </div>
                        <div className="flex flex-col leading-tight mb-4">
                            <span className=" text-gray-400 text-xs">Kode Induk Berusaha:</span>
                            <span className=" text-black font-medium text-sm">8120017141994</span>
                        </div>
                    </CardBody>
                </Card>

                <div className="w-full md:w-3/4 flex flex-col gap-3">
                    <Card>
                        <CardHeader>
                            <div className="w-full flex items-center justify-between">
                            <p className="text-md font-semibold">SK</p>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" color="default" variant="faded">Cetak Draft SK</Button>
                                    <Button size="sm" color="primary">Submit Draft SK</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <Divider/>
                        <CardBody className="my-4">
                            <div>
                                <label className="text-sm">Tembusan</label>
                                <SelectSearch/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                                <Input variant="faded" type="text" radius="sm" label="Nomor" placeholder="..." labelPlacement="outside" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <NextSelect variant="faded" radius="sm" labelPlacement="outside" label="Bulan" placeholder="Pilih">
                                    <SelectItem>Januari</SelectItem>
                                </NextSelect>
                                <Input variant="faded" type="text" radius="sm" label="Tahun" placeholder="..." labelPlacement="outside" />
                                <NextSelect variant="faded" radius="sm" labelPlacement="outside" label="Status Ijin" placeholder="Pilih">
                                    <SelectItem>Seumur Hidup</SelectItem>
                                </NextSelect>
                            </div>
                            <Textarea variant="faded" radius="sm" fullWidth type="text" label="Keterangan SK" placeholder="..." labelPlacement="outside" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                                <DatePicker variant="faded" radius="sm" label="Tanggal Terbit" labelPlacement="outside" showMonthAndYearPickers/>
                                <DatePicker variant="faded" radius="sm" label="Berlaku Dari" labelPlacement="outside" showMonthAndYearPickers/>
                                <DatePicker variant="faded" radius="sm" label="Sampai" labelPlacement="outside" showMonthAndYearPickers/>
                            </div>
                            <Input variant="faded" radius="sm" type="text" label="Nomor Notifikasi Impor" placeholder="..." labelPlacement="outside" />
                            <div className="inline-flex pt-7">
                                <Button color="primary">Simpan</Button>
                            </div>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>
                            <p className="text-md font-semibold">Bahan B3</p> 
                        </CardHeader>
                        <Divider/>
                        <CardBody>
                            <Table removeWrapper  aria-label="Example static collection table">
                                <TableHeader>
                                    <TableColumn>No Registrasi PTSP</TableColumn>
                                    <TableColumn>No Registrasi Bahan Kimia</TableColumn>
                                    <TableColumn>Nama Dagang</TableColumn>
                                    <TableColumn>Aksi</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    <TableRow key="1">
                                        <TableCell>R202409270018</TableCell>
                                        <TableCell>2024.10.111-42-2.49.013</TableCell>
                                        <TableCell>Ethylene Oxide</TableCell>
                                        <TableCell><DynamicModalForm buttonTitle="Update" modalTitle="Nomor Registrasi Bahan Kimia" modalContent={<FormEditMaterial/>} /></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </RootAdmin>
    )
};

function FormEditCompany() {
    return (
        <>
            <Input className="mb-4" type="text" radius="sm" label="Kode DB KLH" placeholder="..." labelPlacement="outside" />
            <Input className="mb-4" type="text" radius="sm" label="Nama Perusahaan" placeholder="..." labelPlacement="outside" />
            <Textarea className="mb-4" radius="sm" fullWidth type="text" label="Alamat" labelPlacement="outside" />
        </>
    )
}

function FormEditMaterial() {
    return (
        <>
            <Input className="mb-4" type="text" radius="sm" label="No Registrasi Bahan" placeholder="..." labelPlacement="outside" />
            <Input className="mb-4" type="text" radius="sm" label="Nama Dagang" placeholder="..." labelPlacement="outside" />
        </>
    )
}

