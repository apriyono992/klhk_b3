import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function InputNumberInterval(props) {
    const { item, applyValue, focusElementRef = null } = props;
    const filterTimeout = React.useRef(null);
    const [filterValueState, setFilterValueState] = React.useState(item.value ?? ['', '']);
    const [applying, setIsApplying] = React.useState(false);

    React.useEffect(() => {
        return () => {
            clearTimeout(filterTimeout.current);
        };
    }, []);

    const updateFilterValue = (lowerBound, upperBound) => {
        clearTimeout(filterTimeout.current);
        setFilterValueState([lowerBound, upperBound]);
        setIsApplying(true);

        filterTimeout.current = setTimeout(() => {
            setIsApplying(false);
            applyValue({ ...item, value: [lowerBound, upperBound] });
        }, 300);
    };

    const handleLowerChange = (event) => {
        updateFilterValue(event.target.value, filterValueState[1]);
    };

    const handleUpperChange = (event) => {
        updateFilterValue(filterValueState[0], event.target.value);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
                variant="standard"
                label="Min"
                type="number"
                value={filterValueState[0]}
                onChange={handleLowerChange}
                inputRef={focusElementRef}
                sx={{ width: 100 }}
            />
            <TextField
                variant="standard"
                label="Max"
                type="number"
                value={filterValueState[1]}
                onChange={handleUpperChange}
                sx={{ width: 100 }}
            />
        </Box>
    );
}
