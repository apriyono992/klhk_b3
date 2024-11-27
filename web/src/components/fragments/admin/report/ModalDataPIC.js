import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  TableCell,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import ControlledInput from '../../../elements/ControlledInput';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';
import useSWR from 'swr';
import { getFetcher, postFetcher } from '../../../../services/api';

export default function DataPICSelector({ control, setValue,type, companyIds }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedItems, setSelectedItems] = useState([]);
  const { data: dataPIC, isLoading: isLoadingPIC, mutate: mutatePIC } = useSWR(
    `/api/company/search-data-pic?companyIds=${companyIds.join(',')}`,
    getFetcher
  );

  const {
    control: controlModal,
    handleSubmit: handleSubmitModal,
    reset: resetModal,
    formState: { errors: errorsModal, isSubmitting: isSubmittingModal },
  } = useForm();

  const handleSelectChange = (options) => {
    const selectedValues = options.map((item) => item.value);
    setSelectedItems(options || []);
    setValue('dataPICIds', selectedValues);
  };

  const handleAddPIC = async (formData) => {
    try {
      formData.companyId = companyIds[0];
      formData.type = type;
      const response = await postFetcher('/api/company/create-data-pic', formData);
      mutatePIC(); // Refresh DataPIC list
      toast.success('DataPIC berhasil ditambahkan!');
      onClose();
    } catch (error) {
      toast.error('Gagal menambahkan DataPIC.');
    }
  };

  const openAddModal = () => {
    resetModal({
      namaPIC: '',
      jabatan: '',
      email: '',
      telepon: '',
      fax: '',
    });
    onOpen();
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Controller
            name="dataPIC"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <label className="text-sm mb-2">
                  PIC Data <span className="text-danger">*</span>
                </label>
                <ReactSelect
                  isMulti
                  options={dataPIC?.map((item) => ({
                    value: item.id,
                    label: item.namaPIC,
                  }))}
                  isLoading={isLoadingPIC}
                  value={selectedItems}
                  onChange={handleSelectChange}
                  theme={(theme) => ({
                    ...theme,
                    borderRadius: 10,
                    colors: {
                      ...theme.colors,
                      primary25: '#f4f4f5',
                    },
                  })}
                  styles={{
                    menu: (styles) => ({ ...styles, zIndex: 999 }),
                    control: (styles) => ({
                      ...styles,
                      backgroundColor: '#f4f4f5',
                    }),
                    option: (styles) => ({
                      ...styles,
                      color: '#475569',
                      fontSize: '10pt',
                    }),
                    placeholder: (styles) => ({
                      ...styles,
                      color: '#475569',
                      fontSize: '10pt',
                    }),
                  }}
                />
                {fieldState.error && (
                  <span className="text-xs text-danger">{fieldState.error.message}</span>
                )}
              </div>
            )}
          />
        </div>
        <Button
          onPress={openAddModal}
          color="primary"
          startContent={<PlusIcon className="size-4" />}
        >
          Tambah DataPIC
        </Button>
      </div>

      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          <ModalHeader>Tambah DataPIC</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <ControlledInput
                label="Nama PIC"
                name="namaPIC"
                type="text"
                control={controlModal}
                isRequired
                error={errorsModal.namaPIC}
              />
              <ControlledInput
                label="Jabatan"
                name="jabatan"
                type="text"
                control={controlModal}
              />
              <ControlledInput
                label="Email"
                name="email"
                type="email"
                control={controlModal}
                isRequired
                error={errorsModal.email}
              />
              <ControlledInput
                label="Telepon"
                name="telepon"
                type="text"
                control={controlModal}
              />
              <ControlledInput
                label="Fax"
                name="fax"
                type="text"
                control={controlModal}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={handleSubmitModal(handleAddPIC)}
              isLoading={isSubmittingModal}
              color="primary"
            >
              Tambah
            </Button>
            <Button color="danger" variant="faded" onPress={onClose}>
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
