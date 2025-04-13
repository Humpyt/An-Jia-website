"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, MapPin, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SearchBar() {
  const [date, setDate] = useState<Date>()
  const [guests, setGuests] = useState(1)

  return (
    <div className="bg-white rounded-full p-2 shadow-lg flex flex-col md:flex-row">
      <div className="relative flex-1 min-w-0">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-neutral-400" />
        </div>
        <Input
          type="text"
          placeholder="Where are you looking?"
          className="h-12 pl-10 pr-4 rounded-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="border-l border-neutral-200 hidden md:block" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-12 px-4 text-left font-normal flex justify-start items-center gap-2 rounded-full hover:bg-neutral-100",
              !date && "text-neutral-500",
            )}
          >
            <CalendarIcon className="h-5 w-5 text-neutral-400" />
            {date ? format(date, "PPP") : <span>Move-in date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <div className="border-l border-neutral-200 hidden md:block" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-12 px-4 text-left font-normal flex justify-start items-center gap-2 rounded-full hover:bg-neutral-100"
          >
            <Users className="h-5 w-5 text-neutral-400" />
            <span>
              {guests} {guests === 1 ? "person" : "people"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="guests">Number of occupants</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  disabled={guests <= 1}
                >
                  <span>-</span>
                </Button>
                <span className="w-8 text-center">{guests}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setGuests(guests + 1)}
                >
                  <span>+</span>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button className="h-12 px-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white ml-2">
        <Search className="h-5 w-5 md:mr-2" />
        <span className="hidden md:inline">Search</span>
      </Button>
    </div>
  )
}
