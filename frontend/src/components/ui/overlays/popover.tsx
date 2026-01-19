import * as React from "react"
import { clsx, type ClassValue } from "clsx"

// Utility for class names
function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

interface PopoverContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined)

const Popover = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverTrigger must be used within Popover")

  const handleClick = (e: React.MouseEvent) => {
    context.setOpen(!context.open)
    props.onClick?.(e as any)
  }

  // If asChild is true, we just clone the child and add the onClick handler
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
      // @ts-ignore
      ref,
      ...props
    })
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "end" | "center" }
>(({ className, align = "center", ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("PopoverContent must be used within Popover")
  
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        // Check if the click was on the trigger (which is handled by the trigger itself)
        // This is a simplified check; in a real app we might need more robust logic
        context.setOpen(false)
      }
    }

    if (context.open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [context.open, context])

  if (!context.open) return null

  const alignClass = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 -translate-x-1/2",
  }[align]

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 mt-2 rounded-md border border-slate-200 bg-white text-slate-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 slide-in-from-top-2",
        alignClass,
        className
      )}
      {...props}
    />
  )
})
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
