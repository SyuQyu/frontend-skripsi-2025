"use client"
import React, { useState } from "react"
import clsx from "clsx"

interface TextAreaCustomProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  error?: string | undefined | null
  name?: string
  disabled?: boolean
}

export default function TextAreaCustom({
  label,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  className,
  style,
  icon,
  error,
  disabled,
}: TextAreaCustomProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={clsx("w-full flex flex-col gap-2", className)} style={style}>
      {label && (
        <label className="text-sm text-black">{label}</label>
      )}
      <div className={clsx(
        "flex items-center rounded-md",
        isFocused ? "border-[#0469DE] border-2" : "border-[#CBD5E1] border",
        error ? "border-red-500" : "",
      )}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={(e) => {
            if (onBlur) {
              onBlur(e)
            }
            setIsFocused(false)
          }}
          onFocus={() => setIsFocused(true)}
          className="w-full py-2 px-3 border-none outline-none rounded-md bg-none resize-y min-h-[120px]"
          disabled={disabled}
        />
        {icon && (
          <span className="px-2">
            {icon}
          </span>
        )}
      </div>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  )
}
