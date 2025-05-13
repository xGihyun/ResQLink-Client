import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "h-20 px-3 py-2 bg-input-background rounded-md text-xs font-normal font-['Poppins'] leading-tight flex min-h-16 w-full border-none shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      placeholder="Type your message here"
      {...props}
    />
  )
}

export { Textarea }
