import { User } from "lucide-react"
import { cn } from "@/lib/utils" // optional: utility to merge class names
import type { ReactNode } from "react"

interface NoSelectedProps {
  header?: string
  description?: string
  icon?: ReactNode
  className?: string
}

function NoSelected({
  header = "Select a Borrower",
  description = "Choose a borrower from the list to view their details and loan information.",
  icon = <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />,
  className = "",
}: NoSelectedProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-center h-full", className)}>
      <div className="text-center">
        {icon}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{header}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  )
}

export default NoSelected
