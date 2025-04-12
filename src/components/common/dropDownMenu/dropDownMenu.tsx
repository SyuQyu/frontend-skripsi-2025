import { ReactNode } from "react"
import clsx from "clsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DropDownMenuProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({ trigger, children, className }) => {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={clsx(className)}>{children}</PopoverContent>
    </Popover>
  )
}

export default DropDownMenu
