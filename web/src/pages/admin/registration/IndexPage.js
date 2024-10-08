import { Button, Card, CardBody, CardHeader, Chip, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { ChevronUpDownIcon, EllipsisHorizontalIcon, EyeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import RootAdmin from "../../../components/layouts/RootAdmin";
import { fetchRegistration } from "../../../services/api";
import { useMemo, useState } from "react";
import useSWR from "swr";

export default function IndexPage() {
    const fetcher = (...args) => fetchRegistration(...args)

    const [page, setPage] = useState(1);
    const [rowPage, setRowPage] = useState(5);

    const skip = (page - 1) * rowPage;
    
    const { data, isLoading, error } = useSWR(`/products?limit=${rowPage}&skip=${skip}`, fetcher, { keepPreviousData: true, revalidateOnFocus: false, revalidateOnReconnect: true }); 


    const total = useMemo(() => {
        return data?.total ? Math.ceil(data.total / rowPage) : 0;
    }, [data?.total, rowPage]);

    return(
        <RootAdmin>
            <Card className="w-full mt-3">
                <CardHeader>
                    <p className="text-md">Daftar Registrasi B3</p>
                </CardHeader>
                <Divider />
                <CardBody>
                    <div className="w-full flex items-center gap-2 py-4">
                        <Input
                            isClearable
                            className="w-full md:w-1/2"
                            placeholder="Cari..."
                            startContent={<MagnifyingGlassIcon className="size-4" />}
                        />
                        <div className="w-full flex justify-end">
                            <label className="w-32 flex gap-2 items-center text-default-400 text-small">
                                Baris:
                                <Select
                                    disableSelectorIconRotation
                                    selectorIcon={<ChevronUpDownIcon className="size-4" />}
                                    defaultSelectedKeys={[`${rowPage}`]}
                                >
                                    <SelectItem key="5" value={5}>5</SelectItem>
                                    <SelectItem key="10" value={10}>10</SelectItem>
                                </Select>
                            </label>
                        </div>
                    </div>
                    <Table radius="sm">
                        <TableHeader>
                            <TableColumn allowsSorting>No</TableColumn>
                            <TableColumn>Nomor Registrasi</TableColumn>
                            <TableColumn>Perusahaan</TableColumn>
                            <TableColumn>Sub Layanan</TableColumn>
                            <TableColumn allowsSorting>Tanggal Masuk Data</TableColumn>
                            <TableColumn allowsSorting>Tanggal Proses</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Aksi</TableColumn>
                        </TableHeader>
                        <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'idle'}>
                            {data?.products?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.title}</TableCell>
                                    <TableCell>{item.brand}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.warrantyInformation}</TableCell>
                                    <TableCell>{item.shippingInformation}</TableCell>
                                    <TableCell>
                                        <Chip color="success" size="sm">{item.availabilityStatus}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="relative flex justify-end items-center gap-2">
                                            <Dropdown radius="sm" size="sm" className="bg-background border-1 border-default-200">
                                                <DropdownTrigger>
                                                    <Button isIconOnly radius="full" size="sm" variant="light">
                                                        <EllipsisHorizontalIcon className="size-5" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu>
                                                    <DropdownItem startContent={<EyeIcon className="size-4"/>}><Link to="/admin/registrasi-b3/12345678">Detail</Link></DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex flex-col md:flex-row items-center justify-between pl-0.5 pt-5 pb-3">
                        <p className="text-sm text-gray-400">{`Total ${data?.total} entri`}</p>
                        <Pagination isCompact showControls total={total} page={page} initialPage={page} onChange={(page) => setPage(page)} />
                    </div>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
