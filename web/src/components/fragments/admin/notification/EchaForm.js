import { Button, Card, CardBody, CardHeader, Checkbox, Divider, Input, Radio, RadioGroup } from "@nextui-org/react";
import ControlledInput from "../../../elements/ControlledInput";
import { Controller, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EchaForm({control, selectedConsentImport, setSelectedConsentImport, errors}) {
    const { fields, append, remove } = useFieldArray({ control, name: "dnaEmail" });

    return (
        <>
            {/* 1A */}
            <Card>
                <CardHeader>
                    <span>SECTION 1A. CHEMICAL IDENTITY, IF IN FORM OF SUBSTANCE (TO BE COMPLETED BY EXPORTING DNA)</span>
                </CardHeader>
                <Divider/>
                <CardBody className='flex flex-col gap-3'>
                    <ControlledInput label="Name of chemical" name="nameOfChemicalSubstance" type="text" isRequired={true} control={control} />
                    <ControlledInput label="CAS No." name="casNumberSubstance" type="text" isRequired={true} control={control} />
                </CardBody>
            </Card>
            {/* 1B */}
            <Card>
                <CardHeader>
                    <span>SECTION 1B. CHEMICAL IDENTITY, IF IN FORM OF PREPARATION (TO BE COMPLETED BY EXPORTING DNA)</span>
                </CardHeader>
                <Divider/>
                <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <ControlledInput label="Name of preparation" name="nameOfPreparation" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Name of chemical" name="nameOfChemicalInPreparation" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Concentration" name="concentrationInPreparation" type="text" isRequired={true} control={control} />
                    <ControlledInput label="CAS No." name="casNumberPreparation" type="text" isRequired={true} control={control} />
                </CardBody>
            </Card>
            {/* 2 */}
            <Card>
                <CardHeader>
                    <span>SECTION 2.  RESPONSE TO THE REQUEST FOR EXPLICIT CONSENT</span>
                </CardHeader>
                <Divider/>
                <CardBody className='flex gap-3'>
                    <Controller
                        name="consentToImport"
                        control={control}
                        render={({ field, fieldState }) => (
                            <RadioGroup
                                isRequired
                                {...field}
                                label="Do you consent to import?"
                                orientation="horizontal"
                                onValueChange={setSelectedConsentImport}
                                isInvalid={fieldState.error}
                                errorMessage={fieldState.error && fieldState.error.message}
                            >
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                            </RadioGroup>
                        )}
                    />
                </CardBody>
            </Card>
            {/* 3 */}
            <Card>
                <CardHeader>
                    <span>SECTION 3. TO WHICH OF THE FOLLOWING USE CATEGORIES DOES YOUR RESPONSE  APPLY?</span>
                </CardHeader>
                <Divider/>
                <CardBody className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    <Controller
                        name="useCategoryPesticide"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                label="Pesticide"
                                orientation="horizontal"
                            >
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                            </RadioGroup>
                        )}
                    />
                    <Controller
                        name="useCategoryIndustrial"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                label="Industrial chemical"
                                orientation="horizontal"
                            >
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                            </RadioGroup>
                        )}
                    />
                </CardBody>
            </Card>
            { 
                selectedConsentImport === "true" && 
                (
                    <>
                        {/* 4 */}
                        <Card>
                            <CardHeader>
                                <span>SECTION 4. IF CONSENT IS GIVEN IN SECTION 2, AND THE CHEMICAL IS IN THE FORM OF A PREPARATION,  DOES CONSENT GO WIDER THAN THE SPECIFIC PREPARATION LISTED IN SECTION 1B?</span>
                            </CardHeader>
                            <Divider/>
                            <CardBody className='felx flex-col gap-3'>
                                <Controller
                                    name="consentForOtherPreparations"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            label="Is consent valid for other preparations containing the same chemical at different concentrations?"
                                            orientation="horizontal"
                                        >
                                            <Radio value="true">Yes</Radio>
                                            <Radio value="false">No</Radio>
                                        </RadioGroup>
                                    )}
                                />
                                <ControlledInput 
                                    label="The concentrations that are allowed"
                                    name="allowedConcentrations"
                                    type="text"
                                    control={control}
                                />
                                <Controller
                                    name="consentForPureSubstance"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            label="Does consent extend to the chemical in the form of a pure substance?"
                                            orientation="horizontal"
                                        >
                                            <Radio value="true">Yes</Radio>
                                            <Radio value="false">No</Radio>
                                        </RadioGroup>
                                    )}
                                />
                            </CardBody>
                        </Card>
                        {/* 5 */}
                        <Card>
                            <CardHeader>
                                <span>SECTION 5. IF CONSENT IS GIVEN IN SECTION 2, ARE THERE ANY RESTRICTIONS/CONDITIONS?</span>
                            </CardHeader>
                            <Divider/>
                            <CardBody className='flex flex-col gap-3'>
                                <Controller
                                    name="hasRestrictions"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            label="Are there any restrictions or conditions attached to consent?"
                                            orientation="horizontal"
                                        >
                                            <Radio value="true">Yes</Radio>
                                            <Radio value="false">No</Radio>
                                        </RadioGroup>
                                    )}
                                />
                                <ControlledInput label="Restriction Details" name="restrictionDetails" type="text" control={control} />
                            </CardBody>
                        </Card>
                        {/* 6 */}
                        <Card>
                            <CardHeader>
                                <span>SECTION 6. IF CONSENT IS GIVEN IN SECTION 2, HOW LONG DOES IT APPLY?</span>
                            </CardHeader>
                            <Divider/>
                            <CardBody className='flex flex-col gap-3'>
                                <Controller
                                    name="isTimeLimited"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            label="Is the consent time-limited?"
                                            orientation="horizontal"
                                        >
                                            <Radio value="true">Yes</Radio>
                                            <Radio value="false">No</Radio>
                                        </RadioGroup>
                                    )}
                                />
                                <ControlledInput label="Limit Date" name="timeLimitDetails" type="date" control={control} />
                            </CardBody>
                        </Card>
                    </>
                )       
            }
            {/* 7 */}
            <Card>
                <CardHeader>
                    <span>SECTION 7. WOULD USE OF THE CHEMICAL FROM ALL SOURCES (DOMESTIC PRODUCTION FOR DOMESTIC USE AND IMPORTS FROM OTHER COUNTRIES) BE TREATED THE SAME AS THE PROPOSED EXPORT FROM THE EU?</span>
                </CardHeader>
                <Divider/>
                <CardBody className='flex flex-col gap-3'>
                    <Controller
                        name="sameTreatment"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                {...field}
                                orientation="horizontal"
                            >
                                <Radio value="true">Yes</Radio>
                                <Radio value="false">No</Radio>
                            </RadioGroup>
                        )}
                    />
                    <ControlledInput label="Details" name="differentTreatmentDetails" type="text" control={control} />
                </CardBody>
            </Card>
            {/* 8 */}
            <Card >
                <CardHeader>
                    <span>SECTION 8. ANY OTHER RELEVANT INFORMATION</span>
                </CardHeader>
                <Divider/>
                <CardBody className='flex flex-col gap-3'>
                    <ControlledInput label="Others" name="otherRelevantInformation" type="text" control={control} />
                </CardBody>
            </Card>
            {/* 9 */}
            <Card className='col-span-2'>
                <CardHeader>
                    <span>SECTION 9. NAME AND ADDRESS OF IMPORTING DNA</span>
                </CardHeader>
                <Divider/>
                <CardBody className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    <ControlledInput label="Institution" name="dnaInstitutionName" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Contact Name" name="dnaContactName" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Telephone" name="dnaTelephone" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Address" name="dnaInstitutionAddress" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Fax" name="dnaTelefax" type="text" isRequired={true} control={control} />
                    <ControlledInput label="Date" name="dnaDate" type="date" control={control} />
                    <div className='col-span-2'>
                        <Button size="sm" startContent={<PlusIcon className="size-4" />} onClick={() => append({ value: "" })} color="success">
                            Tambah Email
                        </Button>
                        <div className="flex flex-col gap-2 mt-3">
                            {fields.map((field, index) => (
                                <div key={index} className="flex items-end gap-1 mb-2">
                                    <Controller
                                        name={`dnaEmail[${index}].value`}
                                        control={control}
                                        defaultValue={field.value}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                type="email"
                                                label={`Email ${index + 1}`}
                                                placeholder="..."
                                                labelPlacement='outside'
                                                color={errors?.dnaEmail?.[index]?.value ? "danger" : "default"}
                                                isInvalid={errors?.dnaEmail?.[index]?.value} 
                                            />
                                        )}
                                    />
                                    <Button color="danger" isIconOnly onClick={() => remove(index)} isDisabled={fields.length === 1}><TrashIcon className="size-4"/></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardBody>
            </Card> 
        </>
    )
}