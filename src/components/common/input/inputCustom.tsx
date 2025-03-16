"use client"
import React, { useState } from "react"
import clsx from "clsx"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { Textarea } from "@/components/ui/textarea"

interface InputCustomProps {
  label?: string
  placeholder?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  error?: string | undefined | null
  name?: string
  disabled?: boolean
  isTextarea?: boolean
  length?: string
}

export default function InputCustom({
  label,
  placeholder,
  type = "text",
  value,
  name,
  onChange,
  onBlur,
  className,
  style,
  icon,
  error,
  disabled,
  isTextarea = false,
  length = "",
}: InputCustomProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={clsx("w-full flex flex-col gap-2", className)} style={style}>
      {label && (
        <label className="text-lg font-bold text-black">{label}</label>
      )}
      <div className={clsx(
        "flex items-center rounded-md",
        isFocused ? "border-[#0469DE] border-2" : "border-[#CBD5E1] border",
        error ? "border-red-500" : "",
      )}
      >
        {isTextarea
          ? (
              <Textarea
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
                className="w-full py-2 px-3 border-none outline-none rounded-md bg-none resize-none"
                disabled={disabled}
              />
            )
          : (
              <input
                type={type === "password" && !showPassword ? "password" : "text"}
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
                className="w-full py-2 px-3 border-none outline-none rounded-md bg-none"
                disabled={disabled}
              />
            )}
        {type === "password" && !disabled && !isTextarea && (
          <span className="px-2 cursor-pointer" onClick={handleTogglePasswordVisibility}>
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        )}
        {icon && type !== "password" && !isTextarea && (
          <span className="px-2">
            {icon}
          </span>
        )}
      </div>
      <div className={clsx("flex flex-row items-center", error ? "justify-between" : "justify-end")}>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {length !== ""
          ? (
              <div className="text-right text-sm text-gray-500">
                {length}
                {" "}
                / 500 characters
              </div>
            )
          : null}
      </div>
    </div>
  )
}
