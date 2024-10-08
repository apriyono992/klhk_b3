import React, { useState } from 'react'
import { Button, Card, CardBody } from '@nextui-org/react'
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckIcon } from '@heroicons/react/24/outline';
import RootAdmin from '../../../components/layouts/RootAdmin';
import StepOneForm, { stepOneSchema } from '../../../components/fragments/admin/recomendation/StepOneForm';
import StepTwoForm, { stepTwoSchema } from '../../../components/fragments/admin/recomendation/StepTwoForm';
import StepThreeForm, { stepThreeSchema } from '../../../components/fragments/admin/recomendation/StepThreeForm';
import StepFourForm from '../../../components/fragments/admin/recomendation/StepFourForm';
import StepFiveForm from '../../../components/fragments/admin/recomendation/StepFiveForm';

const steps = ['Identitas Pemohon', 'Identitas Perusahaan', 'Persyaratan Administrasi', 'Identitas Alat Angkut B3', 'Jenis B3 Yang Diangkut'];

const stepSchemas = [
    stepOneSchema,
    stepTwoSchema,
    stepThreeSchema,
];

export default function CreatePage() {
    const [step, setStep] = useState(0);
    const isLastStep = step === stepSchemas.length - 1;

    const methods = useForm({
        resolver: yupResolver(stepSchemas[step]),
    });

    const nextStep = async () => {
        const isValid = await methods.trigger()
        console.log(isValid);
        
        if (isValid) {
            setStep((prevStep) => prevStep + 1);
        }
    };
    
    const prevStep = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const onSubmit = (data) => {
        if (step === stepSchemas.length - 1) {
            console.log('Form data:', data);
            alert('Form submitted successfully!');
        } else {
            nextStep(data);
        }
    };

    return (
        <RootAdmin>
            <Card className='w-full mt-3'>
                <CardBody>
                    <ul className="relative flex flex-row gap-x-5">
                        {steps.map((label, index) => (
                            <li key={index} className="">
                                <div className="min-w-7 min-h-7 w-full inline-flex items-center text-xs font-medium align-middle">
                                    <div className="flex flex-row items-center gap-x-2">
                                         <span className={`size-7 flex justify-center items-center shrink-0 font-medium rounded-full border
                                                ${
                                                    step === index
                                                        ? 'bg-blue-100 border-blue-500 text-blue-500'
                                                        : step > index
                                                        ? 'bg-blue-500 border-blue-500 text-white'
                                                        : 'bg-gray-100 border-gray-300 text-gray-800'
                                                }
                                            `}
                                        >
                                            {
                                                step > index
                                                    ? <CheckIcon className='size-3 stroke-2'/>
                                                    : index + 1
                                            } 
                                        </span>
                                        {label}
                                    </div>
                                    {/* <div className={`ms-2 w-full h-0.5 rounded-xl flex-1 ${step> index ? 'bg-blue-500' : 'bg-gray-200'} group-last:hidden`}></div> */}
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardBody>
            </Card>
            <Card className="w-full mt-3">
                <CardBody>
                    <FormProvider {...methods}>
                        <form className='py-5' onSubmit={methods.handleSubmit(onSubmit)}>
                            {step === 0 && <StepOneForm />}
                            {step === 1 && <StepTwoForm />}
                            {step === 2 && <StepThreeForm />}
                            {step === 3 && <StepFourForm />}
                            {step === 4 && <StepFiveForm />}

                            <div className='flex items-center gap-2 pt-5'>
                                {step > 0 && <Button variant='faded' type="button" onClick={prevStep}>Kembali</Button>}
                                {
                                    isLastStep
                                        ? <Button color='primary' type="submit">Submit</Button>
                                        : <Button color='primary' type="button" onClick={nextStep}>Selanjutnya</Button>
                                }
                                {/* <Button color='primary' type="button" onClick={isLastStep ? methods.handleSubmit(onSubmit) : nextStep}>
                                    {isLastStep ? 'Submit' : 'Selanjutnya'}
                                </Button> */}
                            </div>
                        </form>
                    </FormProvider>
                </CardBody>
            </Card>
        </RootAdmin>
    )
}
