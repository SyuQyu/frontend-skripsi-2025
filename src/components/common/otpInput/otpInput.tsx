"use client"
import React, { useState } from "react"
import clsx from "clsx"

interface OtpInputCustomProps {
  length: number
  value: string
  onChange: (value: string) => void
  error?: string | undefined | null
  className?: string
  style?: React.CSSProperties
}

const OtpInputCustom: React.FC<OtpInputCustomProps> = ({
  length,
  onChange,
  error,
  className,
  style,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/[^a-z0-9]/gi, "")
    if (val.length <= 4) {
      const newOtp = [...otp]
      newOtp[index] = val
      setOtp(newOtp)
      onChange(newOtp.join(""))
      if (val !== "" && index < length - 1) {
        (element.nextSibling as HTMLInputElement).focus()
      }
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace" && !otp[index]) {
      const previousSibling = (event.target as HTMLInputElement).previousSibling
      if (previousSibling instanceof HTMLInputElement) {
        previousSibling.focus()
      }
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-start items-start">
      <div className={clsx("flex gap-2", className)} style={style}>
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={4}
            value={data}
            onChange={e => handleChange(e.target as HTMLInputElement, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={clsx(
              "w-96 h-12 rounded text-center text-xl ",
              isFocused ? "!border-[#0469DE] border-2" : "border-[#CBD5E1] border",
              error ? "border-red-500" : "",
            )}
          />
        ))}
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  )
}

export default OtpInputCustom
