import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TasksCardProps {
  description?: string;
  title: string;
  value: number;
  variant: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function TasksCard({ 
  description, 
  title, 
  value, 
  variant, 
  onClick, 
  isActive 
}: TasksCardProps) {
  return (
    <Card 
      className={`w-[350px] border-${variant} transition-all cursor-pointer ${
        isActive ? "ring-red scale-[1.02]" : "hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <CardHeader className="p-0 pt-2">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-2 text-2xl font-bold">
        {value}
      </CardContent>
    </Card>
  )
}