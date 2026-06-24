import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        "ring-1 ring-gray-900/5",
        "data-[size=sm]:rounded-2xl",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "px-6 pt-6 pb-4 border-b border-gray-100",
        "group-data-[size=sm]/card:px-5 group-data-[size=sm]/card:pt-5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold text-xl tracking-tight text-gray-900",
        "group-data-[size=sm]/card:text-lg",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-gray-600 text-[15px] leading-relaxed mt-1.5",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-6 right-6",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "flex-1 px-6 py-6 text-gray-700",
        "group-data-[size=sm]/card:px-5 group-data-[size=sm]/card:py-5",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "border-t border-gray-100 bg-gray-50 px-6 py-5 flex items-center gap-3 rounded-b-3xl mt-auto",
        "group-data-[size=sm]/card:px-5 group-data-[size=sm]/card:py-4",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}