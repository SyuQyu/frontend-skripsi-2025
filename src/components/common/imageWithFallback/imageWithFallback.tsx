"use client"
import clsx from "clsx"
import type { ImageProps } from "next/image"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackSrc = "/images/error-image-generic.png",
  ...props
}: ImageProps & { fallbackSrc?: string }) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={clsx(className)}
      onError={() => setImgSrc(fallbackSrc)}
    />
  )
}
