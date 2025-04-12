import { Menu } from "lucide-react"
import React from "react"

export default function HamburgerMenu() {
  return (
    <div
      id="toggleMenu"
      className="w-auto h-auto flex justify-center items-center"
    >
      <Menu size={24} className="transition-transform duration-150" />
    </div>
  )
}
