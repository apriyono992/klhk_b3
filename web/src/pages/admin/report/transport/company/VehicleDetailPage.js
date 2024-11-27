import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, TableCell, TableRow } from '@nextui-org/react'
import HeaderPage from '../../../../../components/elements/HeaderPage'
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { deleteFetcher, deleteWithFormFetcher, getFetcher } from '../../../../../services/api';
import { month } from '../../../../../services/enum';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';
import ButtonModalAlert from '../../../../../components/elements/ButtonModalAlert';
import { isResponseErrorObject } from '../../../../../services/helpers';
import toast from 'react-hot-toast';
import ModalDetailPengangkutan from '../../../../../components/fragments/admin/report/transport/ModalDetailPengangkutan';

export default function VehicleDetailPage() {
    const {periodeId} = useParams();
    const { createReportTransportVehicle, editReportTransportVehicle } = useCustomNavigate()
    const {data, isLoading, mutate } = useSWR(`/api/pelaporan-pengangkutan/find/${periodeId}`, getFetcher)
    console.log(data);
    
    const header = [
        'Jenis Bahan B3', 
        'Jumlah B3', 
        'Perusahaan Asal Muat',
        'Perusahaan Tujuan Bongkar',
        'Aksi'
    ]

    async function onClickDelete(id) {
        try {
            await deleteFetcher(`/api/pelaporan-pengangkutan/delete/pengangkutan-detail`, id)
            mutate()
            toast.success('Laporan pengangkutan berhasil dihapus')
        } catch (error) {
            isResponseErrorObject(error.response.data.message)
                ? Object.entries(error.response.data.message).forEach(([key, value]) => {
                    toast.error(value);
                })
                : toast.error(error.response.data.message)
        }
    }

    const content = (item) => (
    <TableRow key={item?.id}>
      {/* Kolom Bahan Kimia */}
      <TableCell>
        <div>
          <strong>{item?.b3Substance?.dataBahanB3?.casNumber}</strong> / {item?.b3Substance?.dataBahanB3?.namaBahanKimia}
        </div>
      </TableCell>

      {/* Kolom Jumlah B3 */}
      <TableCell>
        <div>{item?.jumlahB3} Kg</div>
      </TableCell>

        {/* Kolom Asal Muat */}
        <TableCell>
        <div>
            {[...new Set(item?.DataPerusahaanTujuanBongkarOnPengakutanDetail?.map((detail) => detail.perusahaanAsalMuat?.id))]
            .map((asalMuatId, index) => {
                const asalMuatDetail = item?.DataPerusahaanTujuanBongkarOnPengakutanDetail.find(
                (detail) => detail.perusahaanAsalMuat?.id === asalMuatId
                );

                if (!asalMuatDetail) return null;

                return (
                <div key={`asal-${index}`} style={{ marginBottom: "1rem" }}>
                    <p><strong>Perusahaan:</strong> {asalMuatDetail?.perusahaanAsalMuat?.namaPerusahaan || "N/A"}</p>
                    <p><strong>Alamat:</strong> {asalMuatDetail?.perusahaanAsalMuat?.alamat || "Alamat tidak tersedia"}</p>
                    <p><strong>Provinsi:</strong> {asalMuatDetail?.perusahaanAsalMuat?.province?.name || "N/A"}</p>
                    <p><strong>Kabupaten/Kota:</strong> {asalMuatDetail?.perusahaanAsalMuat?.regency?.name || "N/A"}</p>
                    <p><strong>Kecamatan:</strong> {asalMuatDetail?.perusahaanAsalMuat?.district?.name || "N/A"}</p>
                    <p><strong>Desa:</strong> {asalMuatDetail?.perusahaanAsalMuat?.village?.name || "N/A"}</p>
                    <p><strong>Tipe Lokasi:</strong> {asalMuatDetail?.locationTypeAsalMuat || "N/A"}</p>
                    <p><strong>Koordinat:</strong> {`${asalMuatDetail?.longitudeAsalMuat || "N/A"}, ${asalMuatDetail?.latitudeAsalMuat || "N/A"}`}</p>
                </div>
                );
            })}
        </div>
        </TableCell>

    {/* Kolom Tujuan Bongkar */}
    <TableCell>
      <div>
        {[...new Set(item?.DataPerusahaanTujuanBongkarOnPengakutanDetail?.map((detail) => detail.perusahaanTujuanBongkar?.id))]
          .map((tujuanBongkarId, index) => {
            const tujuanBongkarDetail = item?.DataPerusahaanTujuanBongkarOnPengakutanDetail.find(
              (detail) => detail.perusahaanTujuanBongkar?.id === tujuanBongkarId
            );

            if (!tujuanBongkarDetail) return null;

            return (
              <div key={`tujuan-${index}`} style={{ marginBottom: "1rem" }}>
                <p><strong>Perusahaan:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.namaPerusahaan || "N/A"}</p>
                <p><strong>Alamat:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.alamat || "Alamat tidak tersedia"}</p>
                <p><strong>Provinsi:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.province?.name || "N/A"}</p>
                <p><strong>Kabupaten/Kota:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.regency?.name || "N/A"}</p>
                <p><strong>Kecamatan:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.district?.name || "N/A"}</p>
                <p><strong>Desa:</strong> {tujuanBongkarDetail?.perusahaanTujuanBongkar?.village?.name || "N/A"}</p>
                <p><strong>Tipe Lokasi:</strong> {tujuanBongkarDetail?.locationTypeTujuan || "N/A"}</p>
                <p><strong>Koordinat:</strong> {`${tujuanBongkarDetail?.longitudeTujuan || "N/A"}, ${tujuanBongkarDetail?.latitudeTujuan || "N/A"}`}</p>
              </div>
            );
          })}
      </div>
    </TableCell>


      {/* Kolom Aksi */}
      <TableCell>
        <div className="flex gap-1">
          <ModalDetailPengangkutan data={item} />
          <Button isIconOnly size="sm" color="warning">
            <PencilSquareIcon className="size-4" />
          </Button>
          <ButtonModalAlert
            buttonIsIconOnly
            buttonTitle={<TrashIcon className="size-4" />}
            buttonColor="danger"
            modalIcon="danger"
            modalHeading="Hapus Riwayat Pengangkutan?"
            buttonSubmitText="Hapus"
            buttonCancelText="Batal"
            onSubmit={() => onClickDelete(item?.id)}
          />
        </div>
      </TableCell>
    </TableRow>


    )

    return (
        <RootAdmin>
            <HeaderPage title={`${data?.vehicle?.modelKendaraan} / ${data?.vehicle?.noPolisi}`} subtitle={"Detail Riwayat Pengangkutan Kendaraan"}  />
            <div className='grid grid-cols-1 md:grid-cols-4 gap-3 mt-3'>
                <Card radius='sm' className="col-span-1">
                    <CardBody className='flex flex-col gap-3'>
                        <div className={`flex flex-col`}>
                            <span className='text-xs text-gray-400 uppercase'>Periode</span>
                            <span className='text-sm font-medium'>{data?.period?.name}</span>
                        </div>
                        <div className={`flex flex-col`}>
                            <span className='text-xs text-gray-400 uppercase'>Bulan</span>
                            <span className='text-sm font-medium'>{month[data?.bulan-1]}</span>
                        </div>
                        <div className={`flex flex-col`}>
                            <span className='text-xs text-gray-400 uppercase'>Tahun</span>
                            <span className='text-sm font-medium'>{data?.tahun}</span>
                        </div>
                    </CardBody>
                </Card>
                <Card radius='sm' className='col-span-3'>
                    <CardHeader className='w-full flex'>
                        <Button onPress={() => createReportTransportVehicle(periodeId)} size='sm' color='primary' startContent={<PlusIcon className='size-4'/>}>Tambah</Button>
                    </CardHeader>
                    <CardBody>
                        <ClientTablePagination
                            data={data?.pengangkutanDetails}
                            isLoading={isLoading}
                            header={header}
                            content={content}
                        />
                    </CardBody>
                </Card>
            </div>   
        </RootAdmin>
    )
}