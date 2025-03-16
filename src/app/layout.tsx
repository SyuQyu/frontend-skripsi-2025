import type { Metadata } from "next"
import clsx from "clsx"
import { ROBOTO } from "@/constants/fonts"
import "@/styles/index.scss"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "AnonChat",
  description: "AnonChat is a platform for sharing traumatic experiences from both childhood and adulthood. We aim to foster self-empathy by embracing our shared humanity and deepening our understanding of childhood trauma.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={clsx("scroll-smooth", ROBOTO.variable)}>
      <body className="w-full flex justify-center items-center">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
