"use client"
import React, { useState } from "react"

interface Option {
  label: string
  value: string
}

const ageOptions: Option[] = [
  { label: "0-1 years old", value: "0-1" },
  { label: "1-2 years old", value: "1-2" },
  { label: "2-4 years old", value: "2-4" },
  { label: "4-6 years old", value: "4-6" },
  { label: "6-8 years old", value: "6-8" },
  { label: "8-10 years old", value: "8-10" },
  { label: "10-12 years old", value: "10-12" },
]

const peopleOptions: Option[] = [
  { label: "Just Me", value: "justme" },
  { label: "My mother", value: "mymother" },
  { label: "My father", value: "myfather" },
  { label: "My sister", value: "mysister" },
  { label: "My step-father", value: "mystepfather" },
  { label: "My step-mother", value: "mystepmother" },
  { label: "My grandfather", value: "mygrandfather" },
  { label: "My grandmother", value: "mygrandmother" },
  // Add more people options here
]

export default function Header() {
  const [activeTab, setActiveTab] = useState<"age" | "people">("age")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const options = activeTab === "age" ? ageOptions : peopleOptions

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option)
    setSearchTerm("") // Clear the search input when an option is selected
    setIsDropdownOpen(false) // Optionally close dropdown after selection
  }

  return (
    <div id="sideNavigation">
      <div className="p-4">
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 ${activeTab === "age" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("age")}
          >
            By age
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "people" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("people")}
          >
            By people
          </button>
        </div>

        {/* Selected item display and dropdown toggle */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="w-full p-2 mb-4 border rounded-lg border-gray-300 text-left"
          >
            {selectedOption ? selectedOption.label : "Search"}
          </button>

          {/* Dropdown list */}
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Search input */}
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border-b border-gray-300 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Options list */}
              <ul className="max-h-60 overflow-y-auto">
                {filteredOptions.map(option => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className={`p-2 cursor-pointer hover:bg-blue-50 ${selectedOption === option ? "bg-blue-100" : ""}`}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
