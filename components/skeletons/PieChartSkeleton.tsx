import { Skeleton } from "@/components/ui/skeleton"

export function PieChartSkeleton() {
  return (
    <div>
      <div className="flex justify-center">
        <Skeleton className="h-64 w-64 rounded-full" />
      </div>
  </div>
  )
}
