import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  labels: Record<string, React.ReactNode>
  registerLabel: (value: string, label: React.ReactNode) => void
} | null>(null)

export const Select = ({
  children,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
}: {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "")
  const [open, setOpen] = React.useState(false)
  const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({})

  const value = controlledValue !== undefined ? controlledValue : uncontrolledValue
  const onValueChange = controlledOnValueChange || setUncontrolledValue

  const registerLabel = React.useCallback((val: string, label: React.ReactNode) => {
    setLabels((prev) => {
      // Avoid infinite loop by checking equality. Simple reference/string equality check.
      // If label is complex object, this might be tricky, but usually it's string.
      if (prev[val] === label) return prev
      return { ...prev, [val]: label }
    })
  }, [])

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, labels, registerLabel }}
    >
      <div className="relative">
        {children}
        {open && (
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        )}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectTrigger must be used within Select")
  
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
          e.stopPropagation() 
          context.setOpen(!context.open)
      }}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0B1220] dark:border-white/12 dark:text-white/92 dark:ring-offset-[#070B12] dark:focus:ring-yellow-500",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")

  const content = (context.value && context.labels[context.value]) ? context.labels[context.value] : placeholder

  return (
    <span ref={ref} className={cn("block truncate", className)} {...props}>
      {content}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")

  // Always render to allow label registration, but toggle visibility
  if (!context.open) {
      return (
        <div className="hidden">
           {children} 
        </div>
      )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-80 dark:bg-[#101A2E] dark:border-white/12 dark:text-white/92",
        className
      )}
      style={{ top: "calc(100% + 4px)", width: "100%" }}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")

  React.useEffect(() => {
    context.registerLabel(value, children)
  }, [value, children, context])

  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        context.onValueChange(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {context.value === value && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
})
SelectItem.displayName = "SelectItem"
