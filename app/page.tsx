"use client"

import { useState, useEffect } from "react"
import { Job, columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import { TasksCard } from "@/components/TasksCard"
import { ColumnVisibilityToggle } from "@/components/ColumnVisibilityToggle"
import { useReactTable, getCoreRowModel, VisibilityState } from "@tanstack/react-table"
import { Diena } from "@/components/Diena"
import { AppPieChart } from "@/components/AppPieChart"
import { SkeletonTable } from "@/components/skeletons/SkeletonTable"
import { TasksSkeleton } from "@/components/skeletons/TasksSkeleton"
import { PieChartSkeleton } from "@/components/skeletons/PieChartSkeleton"
import { fetchJobs } from "@/app/actions"

export default function Home() {
  const [data, setData] = useState<Job[]>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [queueRange, setQueueRange] = useState<[number, number]>([1, 3])
  const [totals, setTotals] = useState({ all: 0, cars: 0, ac: 0, bikes: 0 })
  const [selectedDate, setSelectedDate] = useState<string>("2024-07-13")
  const [loading, setLoading] = useState<boolean>(true)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  })

  interface TakenBy {
    car_model?: string;
    car_brand?: string;
    service?: number;
    phone_number?: string;
  }

  interface JobItem {
    queue_id: number;
    iorder: number;
    takenby: TakenBy;
  }

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const jsonData = await fetchJobs(selectedDate) as JobItem[]

        let totalAll = 0, totalCars = 0, totalAC = 0, totalBikes = 0

        const formatTime = (iorder: number) => {
          const baseHour = 9
          const minutes = iorder * 15
          const hours = baseHour + Math.floor(minutes / 60)
          const mins = minutes % 60
          return `${hours}:${mins.toString().padStart(2, "0")}`
        }

        const formatPhoneNumber = (phone: string) => {
          if (!phone) return "N/A"
          phone = phone.replace(/\s+/g, "").replace(/^\+371/, "")
          return phone.length >= 8 ? "****" + phone.slice(-4) : phone
        }

        const groupedData: Record<number, { 
          time: string; 
          cars: string[]; 
          brands: string[]; 
          types: number[]; 
          phones: string[] 
        }> = {}

        // Client-side filtering for queue range
        jsonData
          .filter((item: JobItem) => item.queue_id >= queueRange[0] && item.queue_id <= queueRange[1])
          .forEach((item: JobItem) => {
            let takenby = item.takenby
            if (!takenby) return

            if (typeof takenby === "string") {
              try {
                takenby = JSON.parse(takenby)
              } catch (error) {
                console.error("Error parsing takenby:", error)
                return
              }
            }

            const time = formatTime(item.iorder)

            if (!groupedData[item.iorder]) {
              groupedData[item.iorder] = { time, cars: [], brands: [], types: [], phones: [] }
            }

            groupedData[item.iorder].cars.push(takenby.car_model || "N/A")
            groupedData[item.iorder].brands.push(takenby.car_brand || "N/A")
            groupedData[item.iorder].types.push(Number(takenby.service) || 0)
            groupedData[item.iorder].phones.push(formatPhoneNumber(takenby.phone_number || "N/A"))

            totalAll++
            if ([1, 2, 3].includes(Number(takenby.service))) totalCars++
            if (Number(takenby.service) === 6) totalAC++
            if ([8, 9].includes(Number(takenby.service))) totalBikes++
          })

        const formattedData: Job[] = Object.entries(groupedData).flatMap(
          ([, { time, cars, brands, types, phones }]) =>
            cars.map((car, index) => ({
              time: index === 0 ? time : "",
              car,
              brand: brands[index] || "Unknown",
              type: types[index] || 0,
              phone: phones[index] || "N/A",
              rowSpan: index === 0 ? cars.length : 0,
            }))
        )

        setData(formattedData)
        setTotals({ all: totalAll, cars: totalCars, ac: totalAC, bikes: totalBikes })
      } catch (error) {
        console.error("Data loading error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedDate, queueRange]) // Only depend on date changes

  return (
    <div className="container mx-auto my-4">
      {loading ? (
        <div className="flex flex-row justify-between gap-4 my-2 text-center">
          <TasksSkeleton />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <ModeToggle />
            <h2 className="text-xl font-bold mx-4">
              {queueRange[0] === 1 ? "Ulbroka" : "Kalnciems"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQueueRange(queueRange[0] === 1 ? [4, 5] : [1, 3])}
            >
              Mainīt servisu
            </Button>
          </div>

          <div className="flex flex-4 flex-row justify-between gap-4 my-2 text-center">
            <TasksCard title="Kopā" value={totals.all} variant="border-indigo-500" />
            <TasksCard title="Mašīnas" value={totals.cars} variant="border-blue-500" />
            <TasksCard title="Moči" value={totals.bikes} variant="border-green-500" />
            <TasksCard title="Kondiškas" value={totals.ac} variant="border-red-500" />
          </div>

          <div className="flex justify-between my-2">
            <Diena onDateChange={setSelectedDate} />
            <ColumnVisibilityToggle table={table} />
          </div>
        </>
      )}

      {loading ? (
        <div className="flex flex-4 flex-row justify-between gap-4 my-2 text-center">
          <SkeletonTable />
        </div>
      ) : (
        <DataTable table={table} />
      )}

      {loading ? (
        <div className="flex justify-center mt-6">
          <PieChartSkeleton />
        </div>
      ) : (
        <div className="py-5">
          <AppPieChart
            data={
              totals
                ? [
                    { name: "Mašīnas", value: totals.cars, fill: "hsl(var(--chart-2))" },
                    { name: "Moči", value: totals.bikes, fill: "hsl(var(--chart-3))" },
                    { name: "Kondiškas", value: totals.ac, fill: "hsl(var(--chart-4))" },
                  ]
                : []
            }
          />
        </div>
      )}
    </div>
  )
}