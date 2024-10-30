import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const schema = yup.object().shape({
    chronology: yup.array()
                .of(yup.object().shape({value: yup.string().required("Harus diisi")}))
                .min(1, "Minimal 1 teks lainnya"),
});

export default function ChronologySection() {
    const { control, handleSubmit, formState: { errors, isSubmitting },} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            chronology: [
                { value: "" }, 
            ],
        },
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "chronology", });

    async function handleOnSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Teks lainnya berhasil ditambah!');
        } catch (error) {
            toast.success('Gagal tambah teks lainnya!');
        }
    }

    return (
        <Card radius="sm">
            <CardHeader>
                <p>Kronologi Permohonan Rekomendasi Pengangkutan</p>
            </CardHeader>
            <Divider/>
            <CardBody>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <Button size="sm" isIconOnly onClick={() => append({ value: "" })} color="success">
                        <PlusIcon className="size-4" />
                    </Button>
                    <div className="flex flex-col gap-2 my-7">
                        {fields.map((field, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <Controller
                                    name={`chronology[${index}].value`}
                                    control={control}
                                    defaultValue={field.value}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            size="sm"
                                            placeholder="Masukan Kronologi"
                                            fullWidth
                                            isRequired
                                            color={errors?.chronology?.[index]?.value ? "danger" : "default"}
                                            isInvalid={errors?.chronology?.[index]?.value} 
                                        />
                                    )}
                                />
                                <Button color="danger" size="sm" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}><TrashIcon className="size-4"/></Button>
                            </div>
                        ))}
                    </div>
                    <Button size="sm" isDisabled={isSubmitting} isLoading={isSubmitting} type="submit" auto color="primary">Submit</Button>
                 </form>
            </CardBody>
        </Card>
    )
}
