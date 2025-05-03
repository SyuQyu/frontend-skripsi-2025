"use client"
import React, { useState } from "react"
import clsx from "clsx"
import { LockKeyhole, LockOpen } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface InputCustomProps {
  id?: string
  label?: string
  placeholder?: string
  type?: string
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLInputElement | HTMLTextAreaElement>) => void
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  error?: string | undefined | null
  name?: string
  disabled?: boolean
  isTextarea?: boolean
  length?: string
  autoFocus?: boolean
  readOnly?: boolean
  autoComplete?: string
}

export default function InputCustom({
  id,
  label,
  placeholder,
  type = "text",
  value,
  defaultValue,
  name,
  onChange,
  onBlur,
  onClick,
  className,
  style,
  icon,
  error,
  disabled,
  isTextarea = false,
  length = "",
  autoFocus = false,
  readOnly = false,
  autoComplete,
}: InputCustomProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={clsx("w-full flex flex-col gap-2", className)} onClick={onClick} style={style}>
      {label && (
        <label htmlFor={id} className="text-base font-bold text-black">
          {label}
        </label>
      )}
      <div
        className={clsx(
          "flex items-center rounded-md",
          isFocused ? "border-[#0469DE] border-2" : "border-[#CBD5E1] border",
          error ? "border-red-500" : "",
        )}
      >
        {isTextarea
          ? (
              <Textarea
                id={id}
                autoFocus={autoFocus && !disabled}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                autoComplete={autoComplete}
                name={name}
                onChange={onChange}
                onClick={onClick}
                onBlur={(e) => {
                  onBlur?.(e)
                  setIsFocused(false)
                }}
                onFocus={() => setIsFocused(true)}
                className="w-full py-2 px-3 border-none outline-none rounded-md bg-none resize-none"
                disabled={disabled}
                readOnly={readOnly}
              />
            )
          : (
              <input
                id={id}
                autoFocus={autoFocus && !disabled}
                type={type === "password" && !showPassword ? "password" : "text"}
                placeholder={placeholder}
                value={value}
                defaultValue={defaultValue}
                autoComplete={autoComplete}
                onClick={onClick}
                name={name}
                onChange={onChange}
                onBlur={(e) => {
                  onBlur?.(e)
                  setIsFocused(false)
                }}
                onFocus={() => setIsFocused(true)}
                className="w-full py-2 px-3 border-none outline-none rounded-md bg-none"
                disabled={disabled}
                readOnly={readOnly}
              />
            )}
        {type === "password" && !disabled && !isTextarea && (
          <span className="px-2 cursor-pointer" onClick={handleTogglePasswordVisibility}>
            {showPassword ? <LockOpen /> : <LockKeyhole />}
          </span>
        )}
        {icon && type !== "password" && !isTextarea && (
          <span className="px-2">{icon}</span>
        )}
      </div>
      <div className={clsx("flex flex-row items-center", error ? "justify-between" : "justify-end")}>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        {length !== "" && (
          <div className="text-right text-sm text-gray-500">
            {length}
            {" "}
            / 500 characters
          </div>
        )}
      </div>
    </div>
  )
}
