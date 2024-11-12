import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, CardHeader, Divider, Spinner } from "@nextui-org/react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";
import { patchFetcher } from "../../../../../services/api";

const schema = yup.object().shape({
    followup: yup.string().required("Tindak lanjut harus diisi"),
});

export default function FollowUp({ existingData }) {
    const existingFollowup = existingData?.TelaahTeknisRekomendasiB3[0]?.tindak_lanjut || "";

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            followup: existingFollowup,
        },
    });

    const [loading, setLoading] = useState(false);

    // Set initial data from existing data
    useEffect(() => {
        reset({ followup: existingFollowup });
    }, [existingFollowup, reset]);

    // Form submission handler
    async function handleOnSubmit(data) {
        try {
            const payload = { tindak_lanjut: data.followup };
            await patchFetcher(`/api/rekom/permohonan/update-telaah`, existingData.id, payload);
            toast.success("Tindak lanjut berhasil disimpan!");
            reset(data); // Reset the form state after successful submission
        } catch (error) {
            toast.error("Gagal menyimpan tindak lanjut.");
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
                <p>Tindak Lanjut</p>
                {isDirty && (
                    <p className="text-red-500 text-sm mt-1">
                      Perubahan belum disimpan
                    </p>
                )}
            </CardHeader>
            <Divider />
            <CardBody>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    <form onSubmit={handleSubmit(handleOnSubmit)}>
                        <div className="mb-6">
                            <Controller
                                name="followup"
                                control={control}
                                defaultValue={existingFollowup}
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
                            {errors.followup && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.followup.message}
                                </p>
                            )}
                        </div>
                        <Button
                            size="sm"
                            isDisabled={isSubmitting || !isDirty}
                            isLoading={isSubmitting}
                            type="submit"
                            auto
                            color="primary"
                        >
                            Submit
                        </Button>
                    </form>
                )}
            </CardBody>
        </Card>
    );
}
