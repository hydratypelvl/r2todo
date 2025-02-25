"use client"
import { Pie, PieChart, Cell, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

const chartConfig: ChartConfig = {
  cars: { label: "Cars", color: "hsl(var(--chart-2))" },
  bikes: { label: "Bikes", color: "hsl(var(--chart-3))" },
  ac: { label: "AC", color: "hsl(var(--chart-4))" },
} 

const COLORS = ["#FF5733", "#33FF57", "#3357FF"] // Define colors for each section

export function AppPieChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
  if (!data || data.length === 0 || data.every((item) => item.value === 0)) {
    return null // Don't render anything if there's no data
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Datu tabula</CardTitle>
        <CardDescription>Atrāda atšķirību starp šodienas darbiem</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer className="mx-auto aspect-square max-h-[250px] px-0" config={chartConfig}>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}