import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export function InputTimeRange({ item, applyValue }) {
    const filterTimeout = React.useRef(null);
    const [filterValueState, setFilterValueState] = React.useState(item.value ?? ['', '']);
    const [applying, setIsApplying] = React.useState(false);

    const updateFilterValue = (startTime, endTime) => {
        clearTimeout(filterTimeout.current);
        setFilterValueState([startTime, endTime]);
        setIsApplying(true);

        filterTimeout.current = setTimeout(() => {
            setIsApplying(false);
            applyValue({ ...item, value: [startTime, endTime] });
        }, 300);
    };

    const handleStartTimeChange = (event) => {
        updateFilterValue(event.target.value, filterValueState[1]);
    };

    const handleEndTimeChange = (event) => {
        updateFilterValue(filterValueState[0], event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                variant="standard"
                label="Start Date"
                type="date"
                value={filterValueState[0]}
                onChange={handleStartTimeChange}
                sx={{ width: 130 }}
            />
            <TextField
                variant="standard"
                label="End Date"
                type="date"
                value={filterValueState[1]}
                onChange={handleEndTimeChange}
                sx={{ width: 130 }}
            />
        </Box>
    );
}
