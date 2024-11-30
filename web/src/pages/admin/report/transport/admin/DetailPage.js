import React from 'react'
import RootAdmin from '../../../../../components/layouts/RootAdmin'
import { Button, Card, CardBody, CardHeader, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, TableCell, TableRow, Textarea } from '@nextui-org/react'
import HeaderPage from '../../../../../components/elements/HeaderPage'
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { deleteFetcher, deleteWithFormFetcher, getFetcher } from '../../../../../services/api';
import { month } from '../../../../../services/enum';
import ClientTablePagination from '../../../../../components/elements/ClientTablePagination';
import { EyeIcon, PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useCustomNavigate from '../../../../../hooks/useCustomNavigate';
import { isResponseErrorObject } from '../../../../../services/helpers';
import toast from 'react-hot-toast';
import ModalDetailPengangkutan from '../../../../../components/fragments/admin/report/transport/ModalDetailPengangkutan';
import useValidateTransport from '../../../../../hooks/report/transport/useValidateTransport';
import ButtonModalAlert from '../../../../../components/elements/ButtonModalAlert';

export default function VehicleDetailPage() {
    const {periodeId} = useParams();
    const {data, isLoading, mutate } = useSWR(`/api/pelaporan-pengangkutan/find/${periodeId}`, getFetcher)
    const { 
        modalForm: { isOpenModalForm, onOpenChangeModalForm },
        hookForm: { register, handleSubmit, formState: { errors, isSubmitting } },
        onCloseForm,
        onSubmitForm,
        onClickEdit,
        isChecked,
        setIsChecked
    } = useValidateTransport({ mutate });

    const header = [
        'Jenis Bahan B3', 
        'Jumlah B3', 
        'Perusahaan Asal Muat',
        'Perusahaan Tujuan Bongkar',
        'Aksi'
    ]

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
                        <Button onPress={() => onClickEdit(data?.id)} size='sm' color='warning' startContent={<PencilSquareIcon className='size-4'/>}>Validasi</Button>
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

            <Modal isOpen={isOpenModalForm} onOpenChange={onOpenChangeModalForm} onClose={onCloseForm} isDismissable={false} isKeyboardDismissDisabled={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Validasi Laporan</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit(onSubmitForm)}>
                                    <div className='flex flex-col gap-3 mb-6'>  
                                        <Checkbox 
                                            {...register('status')}
                                            onValueChange={setIsChecked}
                                        >
                                            Disetujui
                                        </Checkbox>
                                        <Textarea
                                            {...register('adminNote')}
                                            variant="faded" 
                                            type="text" 
                                            isRequired={isChecked ? false : true}
                                            isDisabled={isChecked ? true : false}
                                            label="Catatan" 
                                            color={errors.adminNote ? 'danger' : 'default'}
                                            isInvalid={errors.adminNote} 
                                            errorMessage={errors.adminNote && errors.adminNote.message}
                                        />
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        <Button isLoading={isSubmitting} isDisabled={isSubmitting} type='submit' color='primary'>Simpan</Button>
                                        <Button isDisabled={isSubmitting} color='danger' variant='faded' onPress={onClose}>Batal</Button>
                                    </div>
                                </form>
                            </ModalBody>
                            <ModalFooter>

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </RootAdmin>
    )
}