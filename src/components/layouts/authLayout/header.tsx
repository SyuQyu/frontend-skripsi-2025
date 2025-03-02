import Link from "next/link"
import { ImageWithFallback } from "@/components/common"

export default function Header() {
  return (
    <header id="authHeader">
      <Link href="/" className="flex flex-row justify-start items-center gap-2">
        <ImageWithFallback
          width={0}
          height={0}
          sizes="10vw"
          className="w-8 h-8 object-contain"
          priority={true}
          src="/images/Logo.png"
          alt="Logo"
        />
      </Link>
    </header>
  )
}
