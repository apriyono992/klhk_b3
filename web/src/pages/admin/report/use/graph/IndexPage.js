import React, { useState, useEffect } from "react";
import RootAdmin from "../../../../../components/layouts/RootAdmin";
import { Button, Card, CardBody, CardHeader, Chip, DatePicker, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tabs, Tab, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import HeaderPage from "../../../../../components/elements/HeaderPage";
import { ArrowDownOnSquareIcon, ArrowPathIcon, CheckIcon, ClockIcon, DocumentArrowUpIcon, DocumentDuplicateIcon, DocumentPlusIcon, FunnelIcon, ListBulletIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BarChart } from "@mui/x-charts/BarChart";
import { SparkLineChart } from "@mui/x-charts";
import CountWidget from "../../../../../components/elements/CountWidget";
import CustomDataGrid from "../../../../../components/elements/CustomDataGrid";
import useSWR from "swr";
import { getFetcher } from "../../../../../services/api";
import ControlledInput from "../../../../../components/elements/ControlledInput";
import { useForm } from "react-hook-form";

export default function IndexPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const dummyB3TerbanyakData = [
    {
      id: "2c6a744c-87cb-4b6e-9e9a-5ece97e2371d",
      name: "Dummy A",
      total: 10,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy B",
      total: 11,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy C",
      total: 12,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy D",
      total: 13,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy E",
      total: 14,
    },
  ];
  const dummyB3TerbanyakPerusahaan = [
    {
      id: "2c6a744c-87cb-4b6e-9e9a-5ece97e2371d",
      name: "Dummy E",
      total: 16,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy F",
      total: 11,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy G",
      total: 31,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy H",
      total: 32,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy I",
      total: 12,
    },
  ];
  const dummyB3TerbanyakDibeli = [
    {
      id: "2c6a744c-87cb-4b6e-9e9a-5ece97e2371d",
      name: "Dummy I",
      total: 12,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy J",
      total: 31,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy K",
      total: 35,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy L",
      total: 23,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy M",
      total: 41,
    },
  ];
  const dummyB3TerbanyakImport = [
    {
      id: "2c6a744c-87cb-4b6e-9e9a-5ece97e2371d",
      name: "Dummy N",
      total: 41,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy O",
      total: 23,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy P",
      total: 51,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy Q",
      total: 24,
    },
    {
      id: "f9b54d99-64e8-4974-9899-24d6e52ada39",
      name: "Dummy R",
      total: 21,
    },
  ];

  useEffect(() => {
    console.log(startDate, endDate, " ini start end date ");
  }, [startDate, endDate]);
  // Fetch data grafik bahan b3 & perusahaan terbanyak
  //   const { data: produsenB3, mutate: mutateProdusenB3 } = useSWR(`/api/dashboard/pelaporan/Produsen/grafik/bahanb3?startDate=${startDate}&endDate=${endDate}`, getFetcher);

  //   const { data: produsenPerusahaan, mutate: mutateProdusenPerusahaan } = useSWR(`/api/dashboard/pelaporan/Produsen/grafik/perusahaan?startDate=${startDate}&endDate=${endDate}`, getFetcher);

  const handleFilterApply = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    // mutateProdusenB3(); // Refresh data for produsenB3
    // mutateProdusenPerusahaan(); // Refresh data for produsenPerusahaan
  };

  return (
    <RootAdmin>
      <HeaderPage title="Grafik Penggunaan Produsen" subtitle="Gambaran Umum" action={<FilterForm onApplyFilter={handleFilterApply} />} />
      <div className="grid grid-rows-1 md:grid-rows-4 gap-3 pt-5">
        <Card>
          <Tabs aria-label="Penggunaan Grafik B3" defaultValue="PenggunaanGrafik">
            <Tab title="Grafik Besaran B3 Terbanyak" value="B3Terbanyak">
              <Card radius="sm" className="col-span-4">
                <CardHeader>
                  <span className="text-primary text-xl font-bold">10 Jenis B3 Terbanyak</span>
                </CardHeader>
                <CardBody className="w-full flex flex-col items-center py-5 text-center">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: dummyB3TerbanyakData.map((v, i) => {
                          return v.name;
                        }),
                        label: "Jenis B3",
                        barGapRatio: 0,
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    series={[
                      {
                        data: dummyB3TerbanyakData.map((v, i) => {
                          return v.total;
                        }),
                      },
                    ]}
                    height={300}
                  />
                </CardBody>
              </Card>
              <div className="col-span-4">
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Jenis B3</TableColumn>
                    <TableColumn>Jumlah</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dummyB3TerbanyakData.map((v, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.total}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab title="Grafik Produksi B3 Berdasarkan Perusahaan" value="B3TerbanyakPerusahaan">
              <Card radius="sm" className="col-span-4">
                <CardHeader>
                  <span className="text-primary text-xl font-bold">10 Jenis B3 Terbanyak Berdasarkan Perusahaan</span>
                </CardHeader>
                <CardBody className="w-full flex flex-col items-center py-5 text-center">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: dummyB3TerbanyakPerusahaan.map((v, i) => {
                          return v.name;
                        }),
                        label: "Jenis B3",
                        barGapRatio: 0,
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    series={[
                      {
                        data: dummyB3TerbanyakPerusahaan.map((v, i) => {
                          return v.total;
                        }),
                      },
                    ]}
                    height={300}
                  />
                </CardBody>
              </Card>
              <div className="col-span-4">
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Perusahaan</TableColumn>
                    <TableColumn>Jumlah Produksi</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dummyB3TerbanyakPerusahaan.map((v, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.total}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab title="Grafik Produksi B3 Berdasarkan Digunakan Dan Dibeli" value="B3TerbanyakGunaan">
              <Card radius="sm" className="col-span-4">
                <CardHeader>
                  <span className="text-primary text-xl font-bold">10 Jenis B3 Terbanyak Berdasarkan Digunakan Dan Dibeli</span>
                </CardHeader>
                <CardBody className="w-full flex flex-col items-center py-5 text-center">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: dummyB3TerbanyakDibeli.map((v, i) => {
                          return v.name;
                        }),
                        label: "Jenis B3",
                        barGapRatio: 0,
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    series={[
                      {
                        data: dummyB3TerbanyakDibeli.map((v, i) => {
                          return v.total;
                        }),
                      },
                    ]}
                    height={300}
                  />
                </CardBody>
              </Card>
              <div className="col-span-4">
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Jenis B3</TableColumn>
                    <TableColumn>Jumlah Produksi</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dummyB3TerbanyakDibeli.map((v, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.total}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Tab>
            <Tab title="Grafik Produksi B3 Berdasarkan Lokal Dan Import" value="B3TerbanyakImport">
              <Card radius="sm" className="col-span-4">
                <CardHeader>
                  <span className="text-primary text-xl font-bold">10 Jenis B3 Terbanyak Berdasarkan Perusahaan</span>
                </CardHeader>
                <CardBody className="w-full flex flex-col items-center py-5 text-center">
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: dummyB3TerbanyakImport.map((v, i) => {
                          return v.name;
                        }),
                        label: "Jenis B3",
                        barGapRatio: 0,
                        categoryGapRatio: 0.4,
                      },
                    ]}
                    series={[
                      {
                        data: dummyB3TerbanyakImport.map((v, i) => {
                          return v.total;
                        }),
                      },
                    ]}
                    height={300}
                  />
                </CardBody>
              </Card>
              <div className="col-span-4">
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Jenis B3</TableColumn>
                    <TableColumn>Jumlah Produksi</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {dummyB3TerbanyakImport.map((v, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.total}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Tab>
          </Tabs>
        </Card>
      </div>
    </RootAdmin>
  );
}

function FilterForm({ onApplyFilter }) {
  const { control, watch } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
    },
  });
  const filters = watch();

  const handleApply = () => {
    onApplyFilter(filters.startDate, filters.endDate);
  };

  return (
    <Dropdown closeOnSelect={false}>
      <DropdownTrigger>
        <Button radius="sm" variant="bordered" startContent={<FunnelIcon className="size-4" />}>
          Saring
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Filter Date">
        <DropdownItem isReadOnly>
          <ControlledInput
            name="startDate"
            label="Tanggal Mulai"
            type="date"
            control={control}
            isRequired
            rules={{
              required: "Tanggal Mulai harus diisi.",
            }}
          />
        </DropdownItem>
        <DropdownItem isReadOnly>
          <ControlledInput
            name="endDate"
            label="Tanggal Selesai"
            type="date"
            control={control}
            isRequired
            rules={{
              required: "Tanggal Selesai harus diisi.",
            }}
          />
        </DropdownItem>
        <DropdownItem isReadOnly>
          <Button size="sm" color="primary" onClick={handleApply}>
            Terapkan
          </Button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
