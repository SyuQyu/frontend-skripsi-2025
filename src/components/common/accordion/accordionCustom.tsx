"use client"
import { useState } from "react"
import clsx from "clsx"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface AccordionCustomProps {
  data: {
    title: string
    content: string
  }[]
  className?: string
  classNameTrigger?: string
  headline?: string
}

export default function AccordionCustom({
  data,
  className,
  classNameTrigger,
  headline,
}: AccordionCustomProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  // Toggle all items open/closed
  const toggleAll = () => {
    if (openItems.length === data.length) {
      setOpenItems([]) // Collapse all
    }
    else {
      setOpenItems(data.map((_, index) => index.toString())) // Expand all
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between space-x-4">
        <p className="font-medium text-base leading-5">
          {headline}
        </p>
        <button
          onClick={toggleAll}
          className="px-5 py-1 bg-blue-500 text-white rounded-md ml-4"
        >
          {openItems.length === data.length ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className={clsx("flex items-start w-full", className)}>
        <div className="flex-1">
          <Accordion
            type="multiple" // Support multiple open items
            value={openItems} // Array of open items
            onValueChange={setOpenItems} // Handle multiple values
          >
            {data.map((item, index) => (
              <AccordionItem value={index.toString()} key={index}>
                <AccordionTrigger
                  className={clsx("!justify-between w-full font-bold", classNameTrigger)}
                >
                  {index + 1}
                  .
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}
