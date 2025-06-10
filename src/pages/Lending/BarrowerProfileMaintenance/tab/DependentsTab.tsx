"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    id: crypto.randomUUID(), // <-- unique and collision-safe
    name: "",
    birthdate: undefined,
  }
  onUpdateDependents([...dependents, newDependent])
  }

  

  const removeDependent = (id: string) => {
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

const getFieldError = (dependentId: string, field: string) => {
  return validationErrors[`${dependentId}_${field}`]
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
    <div className="flex flex-col">
      <Input
        placeholder="Enter dependent name"
        value={dependent.name}
        onChange={(e) => updateDependent(dependent.id, "name", e.target.value)}
        className={cn(
          getFieldError(dependent.id, "name") && "border-red-500 focus:border-red-500"
        )}
      />
      {getFieldError(dependent.id, "name") && (
        <span className="text-red-500 text-sm mt-1">{getFieldError(dependent.id, "name")}</span>
      )}
    </div>
    
    <div className="flex flex-col">
      <Input
        type="date"
        value={dependent.birthdate ? format(dependent.birthdate, "yyyy-MM-dd") : ""}
        onChange={(e) => updateDependent(dependent.id, "birthdate", e.target.value ? new Date(e.target.value) : undefined)}
        className={cn(
          "pr-10 relative",
          "[&::-webkit-calendar-picker-indicator]:absolute",
          "[&::-webkit-calendar-picker-indicator]:right-3",
          "[&::-webkit-calendar-picker-indicator]:top-1/2",
          "[&::-webkit-calendar-picker-indicator]:-translate-y-1/2",
          "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
          "[&::-webkit-calendar-picker-indicator]:text-black",
          getFieldError(dependent.id, "birthdate") && "border-red-500 focus:border-red-500"
        )}
        style={{
          colorScheme: "light",
        }}
      />
      {getFieldError(dependent.id, "birthdate") && (
        <span className="text-red-500 text-sm mt-1">{getFieldError(dependent.id, "birthdate")}</span>
      )}
    </div>
    
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