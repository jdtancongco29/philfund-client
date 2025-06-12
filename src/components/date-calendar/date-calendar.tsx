"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// type CalendarMode = "single" | "range"

interface BaseDateCalendarProps {
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface SingleDateCalendarProps extends BaseDateCalendarProps {
  mode: "single"
  date?: Date
  setDate?: (date: Date | undefined) => void
  range?: never
  setRange?: never
  calendarProps?: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">
}

interface RangeDateCalendarProps extends BaseDateCalendarProps {
  mode: "range"
  range?: DateRange
  setRange?: (range: DateRange | undefined) => void
  date?: never
  setDate?: never
  calendarProps?: Omit<React.ComponentProps<typeof Calendar>, "mode" | "selected" | "onSelect">
}

type DateCalendarProps = SingleDateCalendarProps | RangeDateCalendarProps

export default function DateCalendar(props: DateCalendarProps) {
  if (props.mode === "single") {
    return <SingleDateCalendarImpl {...props} />
  } else {
    return <RangeDateCalendarImpl {...props} />
  }
}

// Implementation for single date mode
function SingleDateCalendarImpl({
  date: propDate,
  setDate: propSetDate,
  placeholder = "Select date",
  className,
  disabled = false,
  calendarProps,
}: SingleDateCalendarProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(propDate)
  const [isOpen, setIsOpen] = React.useState(false)

  const currentDate = propDate ?? internalDate
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        calendarRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Calculate calendar position to prevent overflow
  const [calendarPosition, setCalendarPosition] = React.useState<{
    top?: number
    bottom?: number
    left?: number
    right?: number
  }>({})

  React.useEffect(() => {
    if (isOpen && triggerRef.current && calendarRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const calendarRect = calendarRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const position: typeof calendarPosition = {}

      // Vertical positioning
      const spaceBelow = viewportHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top

      if (spaceBelow >= calendarRect.height + 8) {
        // Enough space below
        position.top = triggerRect.bottom + 8
      } else if (spaceAbove >= calendarRect.height + 8) {
        // Not enough space below, but enough above
        position.bottom = viewportHeight - triggerRect.top + 8
      } else {
        // Not enough space in either direction, prefer below
        position.top = triggerRect.bottom + 8
      }

      // Horizontal positioning
      const spaceRight = viewportWidth - triggerRect.left
      const spaceLeft = triggerRect.right

      if (spaceRight >= calendarRect.width) {
        // Enough space on the right
        position.left = triggerRect.left
      } else if (spaceLeft >= calendarRect.width) {
        // Not enough space on right, but enough on left
        position.right = viewportWidth - triggerRect.right
      } else {
        // Not enough space, align to prevent overflow
        position.left = Math.max(8, viewportWidth - calendarRect.width - 8)
      }

      setCalendarPosition(position)
    }
  }, [isOpen])

  const handleSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate)
    if (propSetDate) propSetDate(selectedDate)
    setIsOpen(false)
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <>
      <div ref={triggerRef} className={cn("relative inline-block", className)}>
        <div
          className={cn(
            "justify-between font-normal w-[300px] flex items-center rounded-md border p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "cursor-pointer hover:bg-gray-50",
            !currentDate && "text-muted-foreground",
          )}
          onClick={handleToggle}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggle()
            }
          }}
        >
          {currentDate ? currentDate.toLocaleDateString() : placeholder}
          <CalendarIcon className="ml-2 h-4 w-4 flex-shrink-0" />
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

          {/* Calendar popup */}
          <div
            ref={calendarRef}
            className="fixed z-50 rounded-md border bg-white shadow-lg p-4"
            style={{
              top: calendarPosition.top,
              bottom: calendarPosition.bottom,
              left: calendarPosition.left,
              right: calendarPosition.right,
            }}
          >
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleSelect}
              captionLayout="dropdown"
              {...calendarProps}
            />
          </div>
        </>
      )}
    </>
  )
}

// Implementation for range mode
function RangeDateCalendarImpl({
  range: propRange,
  setRange: propSetRange,
  placeholder = "mm / dd / yyyy - mm / dd / yyyy",
  className,
  disabled = false,
  calendarProps,
}: RangeDateCalendarProps) {
  const [internalRange, setInternalRange] = React.useState<DateRange | undefined>(propRange)
  const [isOpen, setIsOpen] = React.useState(false)
  const [isSelecting, setIsSelecting] = React.useState(false)

  const currentRange = propRange ?? internalRange
  const triggerRef = React.useRef<HTMLDivElement>(null)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  // Handle click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        calendarRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsSelecting(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Calculate calendar position to prevent overflow
  const [calendarPosition, setCalendarPosition] = React.useState<{
    top?: number
    bottom?: number
    left?: number
    right?: number
  }>({})

  React.useEffect(() => {
    if (isOpen && triggerRef.current && calendarRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const calendarRect = calendarRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      const position: typeof calendarPosition = {}

      // Vertical positioning
      const spaceBelow = viewportHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top

      if (spaceBelow >= calendarRect.height + 8) {
        // Enough space below
        position.top = triggerRect.bottom + 8
      } else if (spaceAbove >= calendarRect.height + 8) {
        // Not enough space below, but enough above
        position.bottom = viewportHeight - triggerRect.top + 8
      } else {
        // Not enough space in either direction, prefer below
        position.top = triggerRect.bottom + 8
      }

      // Horizontal positioning
      const spaceRight = viewportWidth - triggerRect.left
      const spaceLeft = triggerRect.right

      if (spaceRight >= calendarRect.width) {
        // Enough space on the right
        position.left = triggerRect.left
      } else if (spaceLeft >= calendarRect.width) {
        // Not enough space on right, but enough on left
        position.right = viewportWidth - triggerRect.right
      } else {
        // Not enough space, align to prevent overflow
        position.left = Math.max(8, viewportWidth - calendarRect.width - 8)
      }

      setCalendarPosition(position)
    }
  }, [isOpen])

  const handleSelect = (selectedRange: DateRange | undefined) => {
    setInternalRange(selectedRange)
    if (propSetRange) propSetRange(selectedRange)

    // Start a new selection
    if (selectedRange?.from && !selectedRange.to) {
      setIsSelecting(true)
    }

    // If selection is completed, close calendar
    if (selectedRange?.from && selectedRange?.to && isSelecting) {
      setIsOpen(false)
      setIsSelecting(false)
    }
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev)
    }
  }

  return (
    <>
      <div ref={triggerRef} className={cn("relative inline-block", className)}>
        <div
          className={cn(
            "justify-between font-normal w-[300px] flex items-center rounded-md border p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            disabled ? "cursor-not-allowed opacity-50 bg-gray-50" : "cursor-pointer hover:bg-gray-50",
            !currentRange?.from && "text-muted-foreground",
          )}
          onClick={handleToggle}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggle()
            }
          }}
        >
          {currentRange?.from && currentRange?.to
            ? `${currentRange.from.toLocaleDateString()} - ${currentRange.to.toLocaleDateString()}`
            : placeholder}
          <CalendarIcon className="ml-2 h-4 w-4 flex-shrink-0" />
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

          {/* Calendar popup */}
          <div
            ref={calendarRef}
            className="fixed z-50 rounded-md border bg-white shadow-lg p-4"
            style={{
              top: calendarPosition.top,
              bottom: calendarPosition.bottom,
              left: calendarPosition.left,
              right: calendarPosition.right,
            }}
          >
            <Calendar
              mode="range"
              selected={currentRange}
              onSelect={handleSelect}
              captionLayout="dropdown"  
              {...calendarProps}
            />
          </div>
        </>
      )}
    </>
  )
}