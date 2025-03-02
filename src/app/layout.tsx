import type { Metadata } from "next"
import clsx from "clsx"
import { ROBOTO } from "@/constants/fonts"
import "@/styles/index.scss"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Trauma & Empathy",
  description: "Trauma & Empathy is a platform for sharing traumatic experiences from both childhood and adulthood. We aim to foster self-empathy by embracing our shared humanity and deepening our understanding of childhood trauma.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={clsx("scroll-smooth", ROBOTO.variable)}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="w-full flex justify-center items-center">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
