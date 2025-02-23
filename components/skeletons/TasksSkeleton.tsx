import { Skeleton } from "@/components/ui/skeleton"

export function TasksSkeleton() {
  return (
    <div>
      <div className="flex flex-row justify-between w-screen gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <div className="flex w-screen gap-2 mt-4">
      <Skeleton className="h-16 w-1/4 rounded-xl" />
      <Skeleton className="h-16 w-1/4 rounded-xl" />
      <Skeleton className="h-16 w-1/4 rounded-xl" />
      <Skeleton className="h-16 w-1/4 rounded-xl" />
    </div>
  </div>
  )
}
