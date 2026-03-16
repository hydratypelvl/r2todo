import { Skeleton } from "@/components/ui/skeleton"

export function TasksSkeleton() {
  return (
    <div className="mt-5">
      <div className="flex flex-row justify-between gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>

      <div className="mt-4">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      <div className="flex gap-2 mt-4">
        <Skeleton className="h-16 w-1/4 rounded-xl" />
        <Skeleton className="h-16 w-1/4 rounded-xl" />
        <Skeleton className="h-16 w-1/4 rounded-xl" />
        <Skeleton className="h-16 w-1/4 rounded-xl" />
      </div>
    </div>
  )
}
