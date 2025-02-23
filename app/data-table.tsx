"use client";

import {
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableRow {
  rowSpan?: number;
}

interface DataTableProps<TData extends DataTableRow> {
  table: ReactTable<TData>;
}

export function DataTable<TData extends DataTableRow>({
  table,
}: DataTableProps<TData>) {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const cellValue = cell.getValue() as React.ReactNode;

                    // Style the "time" column
                    if (columnId === "time") {
                      const rowSpan = row.original.rowSpan;
                      return rowSpan && rowSpan > 0 ? (
                        <TableCell key={cell.id} rowSpan={rowSpan} className="border text-center font-bold text-lg p-3 rounded-md">
                          {cellValue}
                        </TableCell>
                      ) : null;
                    }

                    // Center-align the "type" column (Icons)
                    if (columnId === "type") {
                      return (
                        <TableCell key={cell.id} className="text-center flex justify-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell key={cell.id} className="p-2 border">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  Nav datu.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
