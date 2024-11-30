import { Button, SvgIcon } from "@mui/material";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarFilterButton, useGridApiContext, GridToolbarExport } from "@mui/x-data-grid";

export default function CustomDataGrid({ data, isLoading, 
    columns, rowCount,
    initialState, page, setPage, pageSize, setPageSize, 
    disableRowSelectionOnClick = true, onRowClick }) {
    return (
        <DataGrid
            autosizeOnMount
            rows={data}
            rowCount={rowCount}
            loading={isLoading}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 10,
                    },
                },
                density: 'compact',
                ...initialState,
            }}
            slots={{
                toolbar: CustomToolbar,
            }}
            onPaginationModelChange={(model) => {
                setPage(model.page);
                setPageSize(model.pageSize);
            }}
            paginationMode="server"
            pageSizeOptions={[5, 10, 15, 20, 30, 50, 100]}
            page={page}
            pageSize={pageSize}
            disableDensitySelector
            disableRowSelectionOnClick={disableRowSelectionOnClick}
            onRowClick={onRowClick}
            disableColumnSorting
            disableVirtualization
            scrollbarSize={15}
            sx={{
                overflow: 'auto',
                '& .MuiDataGrid-virtualScroller': {
                    overflowX: 'auto',
                    overflowY: 'auto',
                },
            }}
        />
    )
}

function CustomToolbar() {
    const apiRef = useGridApiContext();
    const autosizeOptions = {
        includeHeaders: true,
        includeOutliers: true,
    };
    return (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport/>
            <Button startIcon={<AutosizeIcon/>} size="small" onClick={() => apiRef.current.autosizeColumns(autosizeOptions)}>
                Autosize columns
            </Button>
        </GridToolbarContainer>
    );
}

function AutosizeIcon() {
    return (
        <SvgIcon>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5985E1"><path d="M560-280h200v-200h-80v120H560v80ZM200-480h80v-120h120v-80H200v200Zm-40 320q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"/></svg>
        </SvgIcon>
    );
}
