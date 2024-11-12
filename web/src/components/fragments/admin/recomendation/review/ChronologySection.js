import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { patchFetcher } from "../../../../../services/api";

const schema = yup.object().shape({
    chronology: yup.array()
                .of(yup.object().shape({ value: yup.string().required("Harus diisi") }))
                .min(1, "Minimal 1 teks lainnya"),
});

export default function ChronologySection({ existingData }) {
    // Format existing data to match [{ value: "..." }]
    const formattedExistingData = existingData?.TelaahTeknisRekomendasiB3[0]?.kronologi_permohonan?.map((item) => ({ value: item })) || [{ value: "" }];

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            chronology: formattedExistingData,
        },
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "chronology" });

    // Form submission handler
    async function handleOnSubmit(data) {
        try {
            const payload = { kronologi_permohonan: data.chronology.map((item) => item.value) };
            // Replace with your API call
            await patchFetcher(`/api/rekom/permohonan/update-telaah`, existingData.id, payload);
            toast.success("Kronologi berhasil disimpan!");
            reset(data);
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan kronologi.");
        }
    }

    // Warn user if they try to leave with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = "You have unsaved changes. Are you sure you want to leave?";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isDirty]);

    const quillModules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline', 'strike'],
            ['clean'],
        ],
    };

    return (
        <Card radius="sm">
            <CardHeader className="flex flex-col items-start">
                <p>Kronologi Permohonan Rekomendasi Pengangkutan</p>
                {isDirty && (
                    <p className="text-red-500 text-sm mt-1">
                       Perubahan belum disimpan
                    </p>
                )}
            </CardHeader>
            <Divider />
            <CardBody>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <Button size="sm" isIconOnly onClick={() => append({ value: "" })} color="success">
                        <PlusIcon className="size-4" />
                    </Button>
                    <div className="flex flex-col gap-2 my-7">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-start gap-1 mb-2">
                                {/* Wrap the title and editor together in a column layout */}
                                <div className="flex flex-col items-start mb-2">
                                    <h4 className="text-md font-semibold mb-1">Kronologi {index + 1}</h4>
                                    <Controller
                                        name={`chronology[${index}].value`}
                                        control={control}
                                        defaultValue={field.value}
                                        render={({ field }) => (
                                            <ReactQuill
                                                theme="snow"
                                                value={field.value}
                                                onChange={field.onChange}
                                                modules={quillModules}
                                                style={{
                                                    width: "100%",
                                                    height: "150px",
                                                    resize: "vertical",
                                                    overflow: "auto",
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <Button size="sm" color="danger" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}>
                                    <TrashIcon className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button size="sm" isDisabled={isSubmitting} isLoading={isSubmitting} type="submit" auto color="primary">
                        Submit
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
}
