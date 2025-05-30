import Link from "next/link"
import { ImageWithFallback } from "@/components/common"

export default function Header() {
  return (
    <header id="authHeader">
      <Link href="/" className="flex flex-row justify-start items-center gap-2">
        <p className="text-blue-500 text-xl font-bold">AnonChat</p>
      </Link>
    </header>
  )
}
