"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function PhilfundCashCardTab() {
  const [cardExpiryDate, setCardExpiryDate] = useState<Date>()

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Cash Card Information</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="bank-name">Cash Card Bank name *</Label>
            <Input id="bank-name" placeholder="Enter bank name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="card-number">Cash card number *</Label>
            <Input id="card-number" placeholder="Enter..." className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="account-number">Account number *</Label>
            <Input id="account-number" placeholder="Enter number" className="mt-2" />
          </div>
          <div>
            <Label>Cash card expiry *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !cardExpiryDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {cardExpiryDate ? format(cardExpiryDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={cardExpiryDate} onSelect={setCardExpiryDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
