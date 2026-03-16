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
  className?: string;
}

export function TasksCard({ 
  description, 
  title, 
  value, 
  variant, 
  onClick, 
  isActive,
  className,
}: TasksCardProps) {
  return (
    <Card 
      className={` ${variant} ${className} transition-all cursor-pointer ${
        isActive ? "bg-muted/50" : "hover:bg-muted/50"
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