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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState<boolean>(true)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const jsonData = await fetchJobs(selectedDate)
        
        let totalAll = 0, totalCars = 0, totalAC = 0, totalBikes = 0

        const formatTime = (iorder: number) => {
          const baseHour = 9
          const minutes = iorder * 15
          const hours = baseHour + Math.floor(minutes / 60)
          const mins = minutes % 60
          return `${hours}:${mins.toString().padStart(2, "0")}`
        }

        const groupedData: Record<number, { 
          time: string
          cars: string[]
          brands: string[]
          types: number[]
          phones: string[]
        }> = {}
console.log(jsonData)
        jsonData
          .filter(item => {
            // Validate queue_id range
            return item.queue_id >= queueRange[0] && 
                   item.queue_id <= queueRange[1] &&
                   item.takenby.service > 0 // Exclude invalid services
          })
          .forEach(item => {
            const { takenby } = item
            const time = formatTime(item.iorder)

            if (!groupedData[item.iorder]) {
              groupedData[item.iorder] = { 
                time, 
                cars: [], 
                brands: [], 
                types: [], 
                phones: [] 
              }
            }

            // Handle undefined/empty values
            const carBrand = takenby.car_brand === "N/A" || !takenby.car_brand 
              ? "Unknown Brand" 
              : takenby.car_brand

            const carModel = takenby.car_model === "N/A" || !takenby.car_model
              ? "Unknown Model"
              : takenby.car_model

            groupedData[item.iorder].cars.push(carModel)
            groupedData[item.iorder].brands.push(carBrand)
            groupedData[item.iorder].types.push(takenby.service)
            groupedData[item.iorder].phones.push(takenby.phone)

            totalAll++
            
            // Service type categorization
            switch (takenby.service) {
              case 1:
              case 2:
              case 3:
                totalCars++
                break
              case 6:
                totalAC++
                break
              case 8:
              case 9:
                totalBikes++
                break
              default:
                console.warn('Unknown service type:', takenby.service)
            }
          })

        const formattedData: Job[] = Object.entries(groupedData).flatMap(
          ([, { time, cars, brands, types, phones }]) =>
            cars.map((car, index) => ({
              time: index === 0 ? time : "",
              car,
              brand: brands[index],
              type: types[index],
              phone: phones[index],
              rowSpan: index === 0 ? cars.length : 0,
            }))
        )

        setData(formattedData)
        setTotals({ all: totalAll, cars: totalCars, ac: totalAC, bikes: totalBikes })
      } catch (error) {
        console.error("Data loading error:", error)
        setData([])
        setTotals({ all: 0, cars: 0, ac: 0, bikes: 0 })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedDate, queueRange])

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
            data={[
              { name: "Mašīnas", value: totals.cars, fill: "hsl(var(--chart-2))" },
              { name: "Moči", value: totals.bikes, fill: "hsl(var(--chart-3))" },
              { name: "Kondiškas", value: totals.ac, fill: "hsl(var(--chart-4))" },
            ]}
          />
        </div>
      )}
    </div>
  )
}