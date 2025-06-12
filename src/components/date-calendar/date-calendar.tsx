// DateRangeCalendar.tsx
import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

interface DateRangeCalendarProps {
  range?: DateRange
  setRange?: (range: DateRange | undefined) => void
}

export default function DateRangeCalendar({
  range: propRange,
  setRange: propSetRange,
}: DateRangeCalendarProps) {
  const defaultFrom = new Date()
  const defaultTo = new Date()
  defaultTo.setDate(defaultFrom.getDate() + 5)

  const [range, setRange] = React.useState<DateRange | undefined>(
    propRange ?? undefined
  )
  const [isOpen, setIsOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  // Track whether user is selecting a new range
  const [isSelecting, setIsSelecting] = React.useState(false)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    if (propSetRange) propSetRange(newRange)

    // Start a new selection
    if (newRange?.from && !newRange.to) {
      setIsSelecting(true)
    }

    // If selection is completed, close calendar
    if (newRange?.from && newRange?.to && isSelecting) {
      setIsOpen(false)
      setIsSelecting(false)
    }
  }

  return (
    <div ref={ref} className="relative inline-block overflow-visible z-40">
      <div
        id="dates"
        className="justify-between font-normal w-[300px] flex items-center cursor-pointer rounded-md border p-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {range?.from && range?.to
          ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
          : "mm / dd / yyyy - mm / dd / yyyy"}
        <CalendarIcon className="ml-2 h-4 w-4" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 rounded-md border bg-white shadow-md p-4 z-50 w-max">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  )
}