"use client"
import clsx from "clsx"
import type { ImageProps } from "next/image"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ImageWithFallback({
  src,
  alt,
  className,
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    setFallback(false)
  }, [src])

  return (
    <Image
      src={src}
      alt={alt}
      className={clsx(className, { hidden: fallback })}
      onError={() => setFallback(true)}
      {...props}
    />
  )
}
