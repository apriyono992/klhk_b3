import { Input, Select, SelectItem } from '@nextui-org/react'
import React from 'react'
import useSWR from 'swr';
import { getFetcher } from '../../services/api';
import FilterReactSelect from './FilterReactSelect';

export default function TableFilter({ startDate, setStartDate, endDate, setEndDate, company, setCompany, period, setPeriod }) {
    const { data: dataCompany, isLoading: isLoadingCompany } = useSWR(`/api/company/search-company`, getFetcher);
    const { data: dataPeriod, isLoading: isLoadingPeriod } = useSWR(`/api/period/all`, getFetcher);
    
    return (
        <div className='w-full grid grid-cols-4 gap-2 mb-2'>
            <Input
                variant="underlined"
                label="Tanggal Awal"
                type='date'
                onChange={(e) => setStartDate(e.target.value)}
                value={startDate}
            />  
            <Input
                variant="underlined"
                label="Tanggal Akhir"
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />  
            {/* <div className='flex flex-col justify-end'>
                <FilterReactSelect 
                    options={dataCompany?.data?.map(item => ({label: item.name, value: item.id}))} 
                    isLoading={isLoadingCompany} 
                    setValue={setCompany} 
                />
            </div> */}
            <Select
                variant="underlined"
                label=""
                placeholder="Cari Perusahaan"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
            >
                {dataCompany?.data?.map(item => (<SelectItem key={item.id}>{item.name}</SelectItem>))}
            </Select>
            <Select
                variant="underlined"
                label=""
                placeholder="Cari Periode"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
            >
                {dataPeriod?.map(item => (<SelectItem key={item.id}>{item.name}</SelectItem>))}
            </Select>
        </div>
    )
}
