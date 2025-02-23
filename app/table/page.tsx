"use client"

import { useState, useEffect } from "react"
import { Job, columns } from "../columns"
import { DataTable } from "../data-table"
import { Button } from "@/components/ui/button"

export default function JobTable() {
  const [data, setData] = useState<Job[]>([])
  const [queueRange, setQueueRange] = useState<[number, number]>([1, 3])

  // Fetch Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/users") // Replace with your actual API endpoint
        const jsonData = await response.json()

        // Process data and filter by queue range
        const formattedData: Job[] = jsonData
          .filter((item: any) => item.queue_id >= queueRange[0] && item.queue_id <= queueRange[1])
          .map((item: any) => ({
            time: item.iorder_time || "Unknown",
            car: item.takenby?.car_model || "Unknown",
            brand: item.takenby?.car_brand || "Unknown",
            type: Number(item.takenby?.service) || 0, // Convert to number safely
          }))

        setData(formattedData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [queueRange]) // Refetch data when queueRange changes

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Job Table</h2>
        <Button onClick={() => setQueueRange(queueRange[0] === 1 ? [4, 5] : [1, 3])}>
          {queueRange[0] === 1 ? "Show Queue 4-5" : "Show Queue 1-3"}
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
