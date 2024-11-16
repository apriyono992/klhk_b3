import {Table, TableHeader, TableColumn, TableBody, Pagination, Spinner} from "@nextui-org/react";
import { useMemo, useState } from "react";

export default function ClientTablePagination({ data, isLoading, header, content }) {
    const [page, setPage] = useState(1);
    const pages = Math.max(1, Math.ceil((data?.length || 0) / 5));

    const items = useMemo(() => {
        const start = (page - 1) * 5;
        const end = start + 5;

        return data?.slice(start, end);
    }, [page, data]);
    

    return (
        <Table 
            aria-label="table"
            removeWrapper
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
        >
            <TableHeader>
                { header.map((item) => <TableColumn key={item}>{item}</TableColumn>) }
            </TableHeader>
            <TableBody loadingContent={<Spinner />} loadingState={isLoading ? 'loading' : 'idle'} emptyContent="Tidak ada data">
                {items?.map((item) => content(item))}
            </TableBody>
        </Table>
    );
}
