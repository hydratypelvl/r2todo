"use client"

import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { lv } from 'date-fns/locale'
import { format } from 'date-fns';
import { DateRange } from "react-day-picker";


export default function Page() {
    const [dateRange, setDateRange] = React.useState<DateRange>();
    const now = new Date();
    return (
        <div>
            {now.toString()}
            <Calendar
                locale={lv}
                max={5}
                mode="range" // Enable range selection
                selected={dateRange} // Pass range object
                onSelect={setDateRange} // Update range
                className="rounded-md border shadow"
                disabled={(date) =>
                    // date.getDay() === 0 || // Disable Sundays
                    // date.getDay() === 6 || // Disable Saturdays
                    date < new Date(new Date().setDate(new Date().getDate() - 1))      // Disable days before today
                }
            />
                
            {/* Display the selected range */}
            <div>
                {dateRange?.from && dateRange?.to
                    ? `Izvēle: ${format(dateRange.from, "d LLL", { locale: lv })} - ${format(dateRange.to, "d LLL", { locale: lv })}`
                    : dateRange?.from
                    ? `Izvēle: ${format(dateRange.from, "y", { locale: lv })}`
                    : "Nav izvēlēts datums"}
            </div>

        </div>
    )
}
