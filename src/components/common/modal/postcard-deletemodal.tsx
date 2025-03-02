"use client"
import React from "react"
import { MdClose } from "react-icons/md"

function Postcarddeletemodal({ onClose, onConfirm }: { onClose: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-2/5 max-w-full relative">
        <button
          className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <MdClose className="w-6 h-6" />
        </button>
        <h3 className="text-lg font-semibold mb-4">Are you sure you wish to delete this episode</h3>
        <p className="text-gray-700 mb-4">
          This action cannot be undone, and any unsaved changes or progress will be lost.
        </p>
        <div className="flex flex-col mt-4 space-y-4">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-white hover:text-blue-500 border border-blue-500"
            onClick={onClose}
          >
            No, go back
          </button>
          <button
            className="bg-white text-red-500 px-6 py-2 rounded hover:bg-red-500 hover:text-white border border-red-500"
            onClick={onConfirm}
          >
            Yes, I want to delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default Postcarddeletemodal
