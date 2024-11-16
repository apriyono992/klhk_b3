import { Card, CardBody, CardHeader } from "@nextui-org/react";
import ControlledInput from "../../../elements/ControlledInput";

export default function NonEchaForm({control}) {
    return (
        <Card className='col-span-2'>
            <CardHeader>
                <span>Non Echa</span>
            </CardHeader>
            <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <ControlledInput label="Nama Exporter" name="namaExporter" type="text" isRequired={true} control={control} />
                <ControlledInput label="Nama Importer" name="namaImpoter" type="text" isRequired={true} control={control} />
                <ControlledInput label="Tujuan Impor" name="tujuanImport" type="text" isRequired={true} control={control} />
                <ControlledInput label="Validitas Surat" name="validitasSurat" type="date" control={control} />
            </CardBody>
        </Card>
    )
}