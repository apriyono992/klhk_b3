import { useState } from "react";

export default function useTableFilter() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [company, setCompany] = useState(null);
    const [period, setPeriod] = useState(null);

    return { startDate, setStartDate, endDate, setEndDate, company, setCompany, period, setPeriod };
}