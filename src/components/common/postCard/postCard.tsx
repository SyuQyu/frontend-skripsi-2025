"use client"
import React, { useEffect, useRef, useState } from "react"
import { FaRegEdit, FaShareAlt } from "react-icons/fa"
import { PiHandHeart } from "react-icons/pi"
import { IoHeartCircleOutline } from "react-icons/io5"
import { RiDeleteBinLine } from "react-icons/ri"
import { MdClose, MdMoreHoriz, MdOutlineReport } from "react-icons/md"
import ConfirmationModal from "@/components/common/modal/postcard-deletemodal" // Import the new component

function Modal({ onClose }: { onClose: () => void }) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([])
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [otherReason, setOtherReason] = useState("")

  const reportReasons = [
    "Not a traumatic episode",
    "Too short",
    "Few facts",
    "Rant",
    "Vent",
    "Threats",
    "Hate speech",
    "Graphic",
    "Life story",
    "Jargon",
    "Labeling",
    "Diagnosing",
    "Promoting solutions",
    "Mentions names",
    "Suicidal ideation",
    "Comment",
    "Spam",
    "Other",
  ]

  const handleButtonClick = (reason: string) => {
    setSelectedReasons(prev =>
      prev.includes(reason)
        ? prev.filter(item => item !== reason)
        : [...prev, reason],
    )
  }

  const handleSubmit = () => {
    if (selectedReasons.length > 0) {
      setNotificationVisible(true)
      setTimeout(() => {
        setNotificationVisible(false)
        onClose()
      }, 3000)
    }
    else {
      alert("Please select at least one reason.")
    }
  }

  const handleOtherReasonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherReason(event.target.value)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/5 max-w-full relative">
          <button
            className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            <MdClose className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold mb-4">Report this traumatic episode</h3>
          <p className="text-gray-700 mb-4">
            We want to keep our users safe from content that violates our Posting Rules. Please select the reasons why you are reporting this episode.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {reportReasons.map(reason => (
              <button
                key={reason}
                onClick={() => handleButtonClick(reason)}
                className={`px-4 py-2 rounded-full border-2 ${
                      selectedReasons.includes(reason)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300"
                    }`}
              >
                {reason}
              </button>
            ))}
          </div>
          {selectedReasons.includes("Other") && (
            <textarea
              rows={4}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter details here..."
              value={otherReason}
              onChange={handleOtherReasonChange}
            />
          )}
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 text-white px-40 py-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      {/* Notification */}
      {notificationVisible && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-60 flex items-center">
          <MdOutlineReport className="w-5 h-5 mr-2" />
          <p className="text-white">Your report has been sent successfully!</p>
        </div>
      )}
    </>
  )
}

interface PostCardProps {
  time: string
  age: string
  title: string
  content: string
  status: string
  likes: number
  comments: number
  shares: number
}

function PostCard({
  time,
  age,
  title,
  content,
  status,
  likes,
  comments,
  shares,
}: PostCardProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null) // Add reference for dropdown

  const statusColor = status === "Severe Impact" ? "text-purple-500 border-purple-500" : "text-green-500 border-green-500"

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleMoreClick = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleReportClick = () => {
    setModalVisible(true)
    setDropdownVisible(false) // Hide the dropdown after clicking
  }

  const handleEditClick = () => {
    alert("Edit option selected") // Replace with actual edit logic
    setDropdownVisible(false) // Hide the dropdown after clicking
  }

  const handleDeleteClick = () => {
    setConfirmationModalVisible(true)
    setDropdownVisible(false) // Hide the dropdown after clicking
  }

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleCloseConfirmationModal = () => {
    setConfirmationModalVisible(false)
  }

  const handleConfirmDelete = () => {
    alert("Delete option selected") // Replace with actual delete logic
    setConfirmationModalVisible(false)
  }

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">{time}</span>
        <div className="relative flex items-center" ref={dropdownRef}>
          <div
            className={`flex items-center border-2 px-3 py-1 rounded-full text-sm ${statusColor}`}
          >
            <span className="mr-2">{status}</span>
            <IoHeartCircleOutline className={`w-4 h-4 ${statusColor.split(" ")[0]}`} />
          </div>
          <MdMoreHoriz
            className={`w-4 h-4 ml-2 cursor-pointer ${statusColor.split(" ")[0]}`}
            onClick={handleMoreClick}
          />
          {/* Dropdown Menu */}
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-48">
              <button
                className="flex items-center px-4 py-2 text-gray-700 w-full text-left hover:bg-blue-500 hover:text-white"
                onClick={handleReportClick}
              >
                <MdOutlineReport className="w-5 h-5 mr-2 text-grey-500 " />
                Report
              </button>
              <button
                className="flex items-center px-4 py-2 text-gray-700 w-full text-left hover:bg-blue-500 hover:text-white"
                onClick={handleEditClick}
              >
                <FaRegEdit className="w-5 h-5 mr-2 text-grey-500" />
                Edit
              </button>
              <button
                className="flex items-center px-4 py-2 text-gray-700 w-full text-left hover:bg-blue-500 hover:text-white"
                onClick={handleDeleteClick}
              >
                <RiDeleteBinLine className="w-5 h-5 mr-2 text-grey-600" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        At age:
        {" "}
        {age}
      </p>
      <h3 className="text-blue-500 font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">
        {content}
        <span className="text-blue-400 cursor-pointer">...See More</span>
      </p>
      <div className="flex justify-between items-center text-gray-500">
        <div className="flex space-x-2">
          <span className="flex items-center">
            <PiHandHeart className="w-4 h-4 mr-1 text-pink-700" />
            {likes}
          </span>
          <span className="flex items-center">
            <FaShareAlt className="w-4 h-4 mr-1 text-blue-600" />
            {shares}
          </span>
          <span className="flex items-center">
            <MdOutlineReport className="w-4 h-4 mr-1 text-red-500" />
            {comments}
          </span>
        </div>
      </div>
      {/* Modal for reporting */}
      {modalVisible && <Modal onClose={handleCloseModal} />}
      {/* Confirmation Modal for deletion */}
      {confirmationModalVisible && (
        <ConfirmationModal
          onClose={handleCloseConfirmationModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default PostCard
