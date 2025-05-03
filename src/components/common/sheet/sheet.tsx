"use client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface SheetComponentProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  button?: string | React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  header?: boolean
}

export default function SheetComponent({
  open,
  onOpenChange,
  button = "Open",
  title = "Title",
  description = "Description",
  header = false,
  children,
}: SheetComponentProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger>{button}</SheetTrigger>
      <SheetContent>
        {header && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
        )}
        {children}
      </SheetContent>
    </Sheet>
  )
}
