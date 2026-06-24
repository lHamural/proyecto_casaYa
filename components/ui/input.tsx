// components/ui/input.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
  "w-full h-11 border px-5 rounded-2xl border border-primary-200 bg-white",
  "text-gray-900 placeholder:text-gray-400 text-[15px]",
  "transition-all duration-300",
  "hover:border-gray-300 hover:shadow",
  "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 focus:outline-none",
  "shadow-sm",
  className
)}
      {...props}
    />
  )
}

export { Input }