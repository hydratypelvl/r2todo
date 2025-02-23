"use client"

import { useState } from "react"
import { format } from "date-fns"
import { lv } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Diena({ onDateChange }: { onDateChange: (date: string) => void }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setIsPopoverOpen(false) // Close popover

      const formattedDate = format(date, "yyyy-MM-dd") // Convert to YYYY-MM-DD format
      onDateChange(formattedDate) // Pass selected date to parent
    }
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] pl-3 text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          {selectedDate ? format(selectedDate, "dd LLLL cccc", { locale: lv }) : <span>Izvēlies datumu</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="bottom">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          initialFocus
          locale={lv}
        />
      </PopoverContent>
    </Popover>
  )
}
