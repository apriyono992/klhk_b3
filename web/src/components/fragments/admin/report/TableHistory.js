import { useState } from "react";
import useSWR from "swr";
import { getFetcher } from "../../../../services/api";
import CustomDataGrid from "../../../elements/CustomDataGrid";
import TableFilter from "../../../elements/TableFilter";

export default function TableHistory({ columns, api }) {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    const { data, isLoading } = useSWR(`${api}?page=${page + 1}&limit=${pageSize}
                                                ${startDateFilter ? `&startDate=${startDateFilter}` : ''}
                                                ${endDateFilter ? `&endDate=${endDateFilter}` : ''}
                                                ${companyFilter ? `&companyId=${companyFilter}` : ''}
                                                ${periodFilter ? `&periodId=${periodFilter}` : ''}`, getFetcher);
    
    return(
        <div className="h-[550px]">
            <TableFilter 
                startDate={startDateFilter}
                setStartDate={setStartDateFilter} 
                endDate={endDateFilter} 
                setEndDate={setEndDateFilter}
                company={companyFilter}  
                setCompany={setCompanyFilter}
                period={periodFilter} 
                setPeriod={setPeriodFilter}
            />
            <CustomDataGrid
                data={data?.data || data?.applications}
                rowCount={data?.total || 0}
                isLoading={isLoading}
                columns={columns}
                pageSize={pageSize}
                setPageSize={setPageSize}
                page={page}
                setPage={setPage}
            />
        </div>
    )
}
