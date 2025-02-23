import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function TasksCard(props: { description?: string, title: string, value: number, variant: string }) {
  return (
    <Card className={`w-[350px] ${props.variant}`}  >
      <CardHeader className="p-0 pt-2">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
          {props.value}
      </CardContent>
    </Card>
  )
}
