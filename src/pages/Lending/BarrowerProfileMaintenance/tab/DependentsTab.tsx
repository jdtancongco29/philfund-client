"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {  Plus, Trash2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Dependent {
  id: string
  name: string
  birthdate: Date | undefined
}

interface DependentsTabProps {
  dependents: Dependent[]
  validationErrors: { [key: string]: string }
  onUpdateDependents: (dependents: Dependent[]) => void
}

export function DependentsTab({ dependents, validationErrors, onUpdateDependents }: DependentsTabProps) {
  const addDependent = () => {
    const newDependent: Dependent = {
      id: Date.now().toString(),
      name: "",
      birthdate: undefined,
    }
    onUpdateDependents([...dependents, newDependent])
  }

  const removeDependent = (id: string) => {
    // Prevent removal if it would result in 0 dependents
    if (dependents.length <= 1) {
      return
    }
    onUpdateDependents(dependents.filter((dep) => dep.id !== id))
  }

  const updateDependent = (id: string, field: keyof Dependent, value: any) => {
    const updatedDependents = dependents.map((dep) => 
      dep.id === id ? { ...dep, [field]: value } : dep
    )
    onUpdateDependents(updatedDependents)
  }

  const getFieldError = (field: string) => {
    return validationErrors[field]
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

      {validationErrors.dependents && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {validationErrors.dependents}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-3 border p-4 rounded-lg">
        <div className="grid grid-cols-3 gap-6 font-medium text-sm  border-b pb-2 mb-4">
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
                className={cn(
                  validationErrors.dependents &&
                    !dependent.name.trim() &&
                    "border-red-500 focus:border-red-500"
                )}
              />
            <Popover>
              <PopoverTrigger asChild>
                <Input
                    type="date"
                    onFocus={(e) => e.target.blur()}
                    value={ dependent.birthdate ? format(dependent.birthdate, "yyyy-MM-dd") : ""}
                    className={` mt-2
                    pr-10
                    relative
                    [&::-webkit-calendar-picker-indicator]:absolute
                    [&::-webkit-calendar-picker-indicator]:right-3
                    [&::-webkit-calendar-picker-indicator]:top-1/2
                    [&::-webkit-calendar-picker-indicator]:-translate-y-1/2
                    [&::-webkit-calendar-picker-indicator]:cursor-pointer
                    [&::-webkit-calendar-picker-indicator]:text-black
                      ${getFieldError("birthDate") ? "border-red-500" : ""}
                  `}
                    style={{
                      colorScheme: "light",
                    }}
                  />
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
              className={cn(
                "text-red-500 hover:text-red-700",
                dependents.length <= 1 && "opacity-50 cursor-not-allowed"
              )}
              disabled={dependents.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

     
    </div>
  )
}