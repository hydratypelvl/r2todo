"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CarFront, Bike, ThermometerSnowflake, CircleHelp } from "lucide-react"

// Job Data Type
export interface Job {
  time: string;
  car: string;
  brand: string;
  type: number;
  phone: string;
  rowSpan: number;
}

// Table Columns
export const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "time",
      header: "Laiks",
    },
    {
      accessorKey: "brand",
      header: "Marka",
    },
    {
      accessorKey: "car",
      header: "Modelis",
    },
    {
      accessorKey: "phone",
      header: "Telefons",
    },
    {
      accessorKey: "type",
      header: () => <div>Tips</div>,
      cell: ({ row }) => {
        const type = Number(row.getValue("type")) || 0; // Convert to number

  
        if ([1, 2, 3].includes(type)) return <CarFront className="text-blue-500" />;
        if ([8, 9].includes(type)) return <Bike className="text-green-500" />;
        if (type === 6) return <ThermometerSnowflake className="text-red-500" />;
        return <CircleHelp className="text-gray-400" />;
      },
    },
  ];
  