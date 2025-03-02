import type { Metadata } from "next"
import AuthLayout from "@/components/layouts/authLayout/authLayout"

export const metadata: Metadata = {
  title: "Trauma & Empathy",
  description: "Trauma & Empathy is a platform for sharing traumatic experiences from both childhood and adulthood. We aim to foster self-empathy by embracing our shared humanity and deepening our understanding of childhood trauma.",
}

export default function AuthLayouts({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthLayout>{children}</AuthLayout>
  )
}
