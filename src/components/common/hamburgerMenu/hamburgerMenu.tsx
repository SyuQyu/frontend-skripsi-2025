import React from "react"
import { IoMenu } from "react-icons/io5"

export default function HamburgerMenu() {
  return (
    <div
      id="toggleMenu"
      className="w-auto h-auto flex justify-center items-center"
    >
      <IoMenu size={24} className="transition-transform duration-150" />
    </div>
  )
}
