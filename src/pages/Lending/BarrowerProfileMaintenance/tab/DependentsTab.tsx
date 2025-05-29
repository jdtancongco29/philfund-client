"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Dependent {
  id: string
  name: string
  birthdate: Date | undefined
}

export function DependentsTab() {
  const [dependents, setDependents] = useState<Dependent[]>([
    { id: "1", name: "", birthdate: undefined },
    { id: "2", name: "", birthdate: undefined },
    { id: "3", name: "", birthdate: undefined },
  ])

  const addDependent = () => {
    const newDependent: Dependent = {
      id: Date.now().toString(),
      name: "",
      birthdate: undefined,
    }
    setDependents([...dependents, newDependent])
  }

  const removeDependent = (id: string) => {
    setDependents(dependents.filter((dep) => dep.id !== id))
  }

  const updateDependent = (id: string, field: keyof Dependent, value: any) => {
    setDependents(dependents.map((dep) => (dep.id === id ? { ...dep, [field]: value } : dep)))
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dependents</h3>
        <Button onClick={addDependent} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-6 font-medium text-sm">
          <Label>Name</Label>
          <Label>Birthdate</Label>
          <Label>Actions</Label>
        </div>

        {dependents.map((dependent) => (
          <div key={dependent.id} className="grid grid-cols-3 gap-6 items-center">
            <Input
              placeholder="Enter dependent name"
              value={dependent.name}
              onChange={(e) => updateDependent(dependent.id, "name", e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !dependent.birthdate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dependent.birthdate ? format(dependent.birthdate, "PPP") : <span>Enter birthdate</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dependent.birthdate}
                  onSelect={(date) => updateDependent(dependent.id, "birthdate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeDependent(dependent.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
