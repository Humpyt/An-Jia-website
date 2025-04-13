"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date) => void
  initialFocus?: boolean
  mode?: "single" | "range" | "multiple"
  showOutsideDays?: boolean
  disabled?: boolean
  fromDate?: Date
  toDate?: Date
}

function Calendar({
  className,
  selected,
  onSelect,
  mode = "single",
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const daysInMonth = React.useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const handleSelectDate = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
  }

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div className={cn("p-3", className)}>
      <div className="space-y-4">
        <div className="flex justify-center pt-1 relative items-center">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full">
          <div className="flex">
            {weekDays.map(day => (
              <div key={day} className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mt-2">
            {daysInMonth.map(day => {
              const isSelected = selected ? isSameDay(day, selected) : false
              const isCurrent = isToday(day)

              return (
                <Button
                  key={day.toString()}
                  variant="ghost"
                  className={cn(
                    "h-9 w-9 p-0 font-normal",
                    isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    isCurrent && !isSelected && "bg-accent text-accent-foreground",
                    !isSameMonth(day, currentMonth) && "text-muted-foreground opacity-50"
                  )}
                  onClick={() => handleSelectDate(day)}
                >
                  {format(day, "d")}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
