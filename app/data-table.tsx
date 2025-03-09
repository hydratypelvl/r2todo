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

// Function to check if the time matches the current time
const isCurrentTime = (time: string): boolean => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const rowTime = new Date();
  rowTime.setHours(hours, minutes, 0, 0);

  // Compare hours and minutes
  return (
    now.getHours() === rowTime.getHours() &&
    now.getMinutes() === rowTime.getMinutes()
  );
};

// Function to check if the time is before (current time - 15 minutes)
const isTimeBeforeCurrentMinus15 = (time: string): boolean => {
  const now = new Date();
  const [hours, minutes] = time.split(':').map(Number);
  const rowTime = new Date();
  rowTime.setHours(hours, minutes, 0, 0);

  // Calculate current time minus 15 minutes
  const currentTimeMinus15 = new Date(now.getTime() - 15 * 60 * 1000);

  // Check if the row time is before (current time - 15 minutes)
  return rowTime < currentTimeMinus15;
};

export function DataTable<TData extends DataTableRow>({
  table,
}: DataTableProps<TData>) {
  let affectedRowsCount = 0; // Counter for rows before (current time - 15 minutes)
  let remainingRowsCount = 0; // Counter for rows after (current time - 15 minutes)

  return (
    <>
      <div className="my-2 text-sm text-gray-600">
        {remainingRowsCount === 0 ? 'Vairs nav mašīnu' : <p>Vēl palikušas {remainingRowsCount} mašīnas</p>}
      </div>
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
              table.getRowModel().rows.map((row) => {
                const timeCell = row.getVisibleCells().find(cell => cell.column.id === "time");
                const time = timeCell ? timeCell.getValue() as string : "";

                // Check if the time is before (current time - 15 minutes)
                const isAffected = isTimeBeforeCurrentMinus15(time);
                // Check if the time matches the current time
                const isCurrent = isCurrentTime(time);

                if (isAffected) {
                  affectedRowsCount++; // Increment the counter for affected rows
                } else {
                  remainingRowsCount++; // Increment the counter for remaining rows
                }

                return (
                  <TableRow 
                    key={row.id} 
                    className={`border-b ${
                      isCurrent
                        ? 'dark:bg-green-900 bg-green-100' // Highlight current time row
                        : isAffected
                        ? 'dark:bg-zinc-900 bg-slate-50' // Highlight rows before (current time - 15 minutes)
                        : ''
                    }`}
                  >
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
                );
              })
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