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
  button?: string | React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  header?: boolean
  onOpenChange?: (open: boolean) => void // Add this prop
}

export default function SheetComponent({
  button = "Open",
  title = "Title",
  description = "Description",
  header = false,
  children,
  onOpenChange, // Destructure the prop
}: SheetComponentProps) {
  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger>{button}</SheetTrigger>
      <SheetContent>
        {
          header && (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          )
        }
        {children}
      </SheetContent>
    </Sheet>
  )
}
