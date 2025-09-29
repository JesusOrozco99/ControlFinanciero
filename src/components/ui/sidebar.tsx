"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

interface SidebarContextProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <SidebarContext.Provider
      value={{ isOpen, setIsOpen, isCollapsed, setIsCollapsed }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "fixed inset-y-0 z-50 flex-col border-r bg-background transition-all duration-300 ease-in-out",
  {
    variants: {
      collapsed: {
        true: "w-16",
        false: "w-64",
      },
    },
    defaultVariants: {
      collapsed: false,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  asChild?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { isCollapsed } = useSidebar()
    const Comp = asChild ? Slot : "aside"
    return (
      <Comp
        ref={ref}
        className={cn(
          "hidden md:flex",
          sidebarVariants({ collapsed: isCollapsed }),
          className
        )}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed } = useSidebar()
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-16 items-center border-b px-4",
        isCollapsed ? "justify-center" : "justify-between",
        className
      )}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto border-t p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-1 p-2", className)} {...props} />
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "flex w-full items-center justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-primary text-primary-foreground",
        false: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      },
      isCollapsed: {
        true: "justify-center",
        false: "justify-start",
      },
    },
    defaultVariants: {
      isActive: false,
      isCollapsed: false,
    },
  }
)

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean
  tooltip?: string
}

const SidebarMenuButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuButtonProps
>(
  (
    { className, asChild = false, isActive, isCollapsed, tooltip, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "a"
    const button = (
      <Comp
        ref={ref}
        className={cn(
          sidebarMenuButtonVariants({ isActive, isCollapsed }),
          className
        )}
        {...props}
      />
    )

    if (isCollapsed && tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )
    }

    return button
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarToggle = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isCollapsed, setIsCollapsed } = useSidebar()

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("hidden md:flex", className)}
      onClick={() => setIsCollapsed(!isCollapsed)}
      {...props}
    >
      {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
})
SidebarToggle.displayName = "SidebarToggle"

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { isOpen, setIsOpen } = useSidebar()
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    />
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const insetVariants = cva("transition-all duration-300 ease-in-out", {
  variants: {
    isCollapsed: {
      true: "md:pl-16",
      false: "md:pl-64",
    },
  },
  defaultVariants: {
    isCollapsed: false,
  },
})

interface SidebarInsetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof insetVariants> {
  asChild?: boolean
}

const SidebarInset = React.forwardRef<HTMLDivElement, SidebarInsetProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { isCollapsed } = useSidebar()
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(insetVariants({ isCollapsed }), className)}
        {...props}
      />
    )
  }
)
SidebarInset.displayName = "SidebarInset"

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarToggle,
  SidebarTrigger,
  SidebarInset,
}