import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

type TransactionDatePickerProps = {
  value: string | null
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export const TransactionDatePicker: React.FC<TransactionDatePickerProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const [open, setOpen] = React.useState(false)

  // Convert string value to Date object
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    
    // Handle different date formats
    let dateStr = value
    if (value.includes('T')) {
      dateStr = value.split('T')[0] // Remove time part if present
    }
    
    const date = new Date(dateStr + 'T00:00:00') // Add time to avoid timezone issues
    return isNaN(date.getTime()) ? undefined : date
  }, [value])

  // Format display value
  const displayValue = selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Format as YYYY-MM-DD to match your form's expected format
      const formattedDate = format(date, "yyyy-MM-dd")
      onChange(formattedDate)
      setOpen(false)
    }
  }

  const handleInputClick = () => {
    if (!disabled) {
      setOpen(true)
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          readOnly
          disabled={disabled}
          placeholder="Select a date"
          onClick={handleInputClick}
          className={`w-full pr-10 pl-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:border-gray-400"}`}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              disabled={disabled}
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              defaultMonth={selectedDate || new Date()}
              // Remove toDate if you want to allow future dates
              // toDate={new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}