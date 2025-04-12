import clsx from "clsx"
import { Check, X } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function StrengthBar({ strength }: { strength: number }) {
  return (
    <div className="password-strength">
      <div className="flex flex-row justify-between items-center w-full gap-2">
        <p className="whitespace-nowrap">
          Strength:
          {["Low", "Medium", "High"][strength - 1]}
        </p>
        <div className="flex flex-row justify-between items-center gap-2 w-full">
          {Array.from({ length: 3 }).map((_, idx) => (
            <HoverCard key={idx}>
              <HoverCardTrigger className="w-full">
                <div className={clsx("h-3 w-full rounded", strength > idx ? ["bg-red-600", "bg-yellow-400", "bg-green-400"][idx] : "bg-[#D9D9D9]")}></div>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="requirements">
                  <p>Your password must have:</p>
                  <ul>
                    <li className="flex flex-row justify-start items-center gap-2">
                      {strength >= 1 ? <Check className="text-green-400 size-4" /> : <X className="text-red-600 size-4" />}
                      At least 8 characters
                    </li>
                    <li className="flex flex-row justify-start items-center gap-2">
                      {strength >= 2 ? <Check className="text-green-400 size-4" /> : <X className="text-red-600 size-4" />}
                      At least one number
                    </li>
                    <li className="flex flex-row justify-start items-center gap-2">
                      {strength >= 3 ? <Check className="text-green-400 size-4" /> : <X className="text-red-600 size-4" />}
                      At least one special case character
                    </li>
                  </ul>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StrengthBar
