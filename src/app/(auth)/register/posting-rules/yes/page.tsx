"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Card } from "@/components/common"

interface Option {
  label: string
  value: string
}

const ageOptions: Option[] = [
  { label: "0-1 years old", value: "0-1" },
  { label: "1-2 years old", value: "1-2" },
  { label: "2-4 years old", value: "2-4" },
  { label: "4-6 years old", value: "4-6" },
  { label: "6-8 years old", value: "6-8" },
  { label: "8-10 years old", value: "8-10" },
  { label: "10-12 years old", value: "10-12" },
]

export default function Agreement() {
  const router = useRouter()
  const [selectedAge, setSelectedAge] = useState<string | null>(null)

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAge(event.target.value)
  }

  const handleContinue = () => {
    router.push("/register/form")
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] text-left min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0 text-[20px]"
        styleDescription="text-base text-black"
      >
        <div className="w-full max-w-[544px] p-4">
          <div className="flex flex-col gap-4">
            <div className="text-left mb-4">
              <p className="text-2xl font-bold">How old were you at the time?</p>
              <span className="text-base text-gray-400">Please select an approximate age when this episode took place: (Optional)</span>
            </div>

            <div className="relative">
              <select
                value={selectedAge || ""}
                onChange={handleSelectChange}
                className="w-full h-[64px] bg-white border border-gray-300 rounded-lg p-4 pr-10 opacity-30 appearance-none"
                style={{ background: "transparent" }} // Ensure select background is transparent
              >
                <option value="" disabled>Eg. 4-6 years old</option>
                {ageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl opacity-30" />
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <button
                onClick={handleContinue}
                className="w-full bg-custom-blue text-white rounded-lg h-[55px] flex items-center justify-center"
              >
                SKIP
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
