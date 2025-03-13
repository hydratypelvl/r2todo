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
import { RefObject, useEffect, useMemo } from "react";

interface DataTableRow {
  rowSpan?: number;
  time?: string;
  isClosest?: boolean;
}

interface DataTableProps<TData extends DataTableRow> {
  table: ReactTable<TData>;
  currentTimeRowRef?: RefObject<HTMLTableRowElement | null>;
  onRemainingRowsCountChange?: (count: number) => void;
}

export function DataTable<TData extends DataTableRow>({
  table,
  currentTimeRowRef,
  onRemainingRowsCountChange,
}: DataTableProps<TData>) {
  // Create a map of time to all rows sharing that time
  const timeToRowsMap = useMemo(() => {
    const map = new Map<string, TData[]>();
    table.getRowModel().rows.forEach(row => {
      const timeCell = row.getVisibleCells().find(cell => cell.column.id === "time");
      const time = timeCell ? timeCell.getValue() as string : "";
      if (!map.has(time)) {
        map.set(time, []);
      }
      map.get(time)?.push(row.original);
    });
    return map;
  }, [table]);

  // Find the closest time before current time
  const closestTime = useMemo(() => {
    let closestTime: string | null = null;
    let closestDiff = Infinity;
    const now = new Date();

    timeToRowsMap.forEach((_, time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const rowTime = new Date(now);
      rowTime.setHours(hours, minutes, 0, 0);
      const diff = now.getTime() - rowTime.getTime();

      if (diff >= 0 && diff < closestDiff) {
        closestDiff = diff;
        closestTime = time;
      }
    });

    return closestTime;
  }, [timeToRowsMap]);

  // Mark closest rows and count remaining
  let remainingRowsCount = 0;
  timeToRowsMap.forEach((rows, time) => {
    const isClosest = time === closestTime;
    rows.forEach(row => {
      row.time = time;
      row.isClosest = isClosest;
      if (!isClosest) remainingRowsCount++;
    });
  });

  useEffect(() => {
    onRemainingRowsCountChange?.(remainingRowsCount);
  }, [remainingRowsCount, onRemainingRowsCountChange]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(
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
              const isClosest = row.original.isClosest || false;

              return (
                <TableRow 
                  key={row.id}
                  ref={isClosest ? currentTimeRowRef as RefObject<HTMLTableRowElement> : null}
                  className={`border-b ${
                    isClosest
                      ? 'dark:bg-blue-900 bg-blue-100'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnId = cell.column.id;
                    const cellValue = cell.getValue() as React.ReactNode;

                    if (columnId === "time") {
                      const rowSpan = row.original.rowSpan;
                      return rowSpan && rowSpan > 0 ? (
                        <TableCell key={cell.id} rowSpan={rowSpan} className="border text-center font-bold text-lg p-3 rounded-md">
                          {cellValue}
                        </TableCell>
                      ) : null;
                    }

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
  );
}