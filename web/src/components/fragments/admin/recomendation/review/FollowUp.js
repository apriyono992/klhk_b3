import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, CardBody, CardHeader, Divider, Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";

const schema = yup.object().shape({
    followup: yup.string().required("Harus diisi"),
});

export default function FollowUp() {
    const { register, handleSubmit, formState: { errors, isSubmitting },} = useForm({resolver: yupResolver(schema),});

    async function handleOnSubmit(data) {
        try {
            await new Promise((r) => setTimeout(r, 1000));
            console.log(data);
            toast.success('Tindak lanjut berhasil diubah!');
        } catch (error) {
            toast.error('Gagal ubah tindak lanjut!');
        }
    }

    return (
        <Card radius="sm">
            <CardHeader>
                <p>Tindak Lanjut</p>
            </CardHeader>
            <Divider/>
            <CardBody>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className="mb-6">
                        <Textarea
                            {...register('followup')}
                            isRequired
                            variant="faded" 
                            type="text" 
                            label="Tindak Lanjut" 
                            color={errors.followup ? 'danger' : 'default'}
                            isInvalid={errors.followup} 
                            errorMessage={errors.followup && errors.followup.message}
                        />
                    </div>
                    <Button size="sm" isDisabled={isSubmitting} isLoading={isSubmitting} type="submit" auto color="primary">Submit</Button>
                 </form>
            </CardBody>
        </Card>
    )
}
