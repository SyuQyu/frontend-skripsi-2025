"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useTagStore from "@/context/tags"
import { getAccessToken } from "@/lib/cookies"

interface Option {
  label: string
  value: string
}

const peopleOptions: Option[] = [
  { label: "Just Me", value: "justme" },
  { label: "My mother", value: "mymother" },
  { label: "My father", value: "myfather" },
  { label: "My sister", value: "mysister" },
  { label: "My step-father", value: "mystepfather" },
  { label: "My step-mother", value: "mystepmother" },
  { label: "My grandfather", value: "mygrandfather" },
  { label: "My grandmother", value: "mygrandmother" },
]

export default function Header() {
  const [activeTab, setActiveTab] = useState<"tags" | "people">("tags")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { fetchPopularTags, popularTags } = useTagStore()
  const router = useRouter()

  useEffect(() => {
    fetchPopularTags()
    const accessToken = getAccessToken()
    if (!accessToken) {
      router.push("/login")
    }
  }, [router, fetchPopularTags])

  const tagOptions: Option[] = popularTags.map(tag => ({ label: tag.tag, value: tag.id }))
  const options = activeTab === "tags" ? tagOptions : peopleOptions

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
    if (activeTab === "tags") {
      router.push(`/tags/${option.label}`)
    }
  }

  return (
    <div id="sideNavigationRight">
      <div className="px-4">
        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 ${activeTab === "tags" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("tags")}
          >
            By Tags
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "people" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
            onClick={() => setActiveTab("people")}
          >
            Top Post
          </button>
        </div>

        {/* Selected item display and dropdown toggle */}
        {
          activeTab === "tags" && (
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
          )
        }
      </div>
    </div>
  )
}
