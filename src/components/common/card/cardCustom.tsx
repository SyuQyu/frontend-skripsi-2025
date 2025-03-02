import * as React from "react"

import clsx from "clsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardCustomProps {
  children: React.ReactNode
  title?: string
  description?: React.ReactNode | string
  footer?: React.ReactNode | string
  styleCard?: string
  styleTitle?: string
  styleDescription?: string
  styleContent?: string
  styleFooter?: string
}

export default function CardCustom({
  children,
  title,
  description,
  footer,
  styleCard,
  styleTitle,
  styleDescription,
  styleContent,
  styleFooter,
}: CardCustomProps) {
  return (
    <Card className={clsx(styleCard, "rounded-2xl")}>
      {
        title || description
          ? (
              <CardHeader className="flex flex-col gap-3 !p-0">
                <CardTitle className={styleTitle}>{title}</CardTitle>
                <CardDescription className={styleDescription}>{description}</CardDescription>
              </CardHeader>
            )
          : null
      }
      <CardContent className={styleContent}>
        {children}
      </CardContent>
      {
        footer && <CardFooter className={styleFooter}>{footer}</CardFooter>
      }
    </Card>
  )
}
