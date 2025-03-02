import Link from "next/link"
import { Button as UIButton } from "@/components/ui/button"

interface ButtonProps {
  variant?: "link" | "outline" | "default" | "destructive" | "secondary" | "ghost" | null | undefined
  children: React.ReactNode
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  className?: string
  type?: "button" | "submit" | "reset" | undefined
  disabled?: boolean
  link?: any
  onClick?: any
}

export default function ButtonCustom({
  variant = "outline",
  children,
  size,
  type,
  className,
  disabled,
  link,
  onClick,
}: ButtonProps) {
  return (
    link && !disabled
      ? (
          <Link className="w-full" href={link} onClick={onClick}>
            <UIButton type={type} className={className} variant={variant} size={size} disabled={disabled}>
              {children}
            </UIButton>
          </Link>
        )
      : (
          <UIButton onClick={onClick} type={type} className={className} variant={variant} size={size} disabled={disabled}>
            {children}
          </UIButton>
        )
  )
}
