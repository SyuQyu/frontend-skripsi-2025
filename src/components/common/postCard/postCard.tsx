"use client"
import React from "react"
import Link from "next/link"
import { FaRegEdit, FaShareAlt } from "react-icons/fa"
import { PiHandHeart } from "react-icons/pi"
import { IoHeartCircleOutline } from "react-icons/io5"
import { MdMoreHoriz, MdOutlineReport } from "react-icons/md"
import { timeAgo } from "@/lib/utils"

function PostCard({ post }: any) {
  const createdAt = timeAgo(post.createdAt)
  const author = post.user?.username || "Unknown"
  const content = post.content || "No content available"
  const filteredContent = post.filteredContent !== null ? post.filteredContent : content
  const likes = post.likes?.length || 0
  const comments = post.replies?.length || 0
  const shares = 0 // Placeholder since shares data is not available in API response

  // Format teks: tambahkan <br /> untuk newline dan warna biru untuk tag #
  const formatContent = (text: string) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line.split(/(#\w+)/g).map((part, i) =>
          part.startsWith("#")
            ? (
                <Link key={i} href={`/tags/${part.slice(1)}`} className="text-blue-500 hover:underline">
                  {part}
                </Link>
              )
            : (
                part
              ),
        )}
        <br />
      </React.Fragment>
    ))
  }

  return (
    <div className="border rounded-lg shadow-md p-4 mb-4 bg-white relative">
      <div className="flex flex-row justify-between items-center w-full mb-3">
        <div className="flex flex-start justify-start w-full gap-4 items-center">
          <p className="text-sm text-gray-700">
            <Link href={`/profile/${author}`} className="hover:underline">
              {author}
            </Link>
          </p>
          <span className="text-sm text-gray-500">{createdAt}</span>
        </div>
        <MdMoreHoriz className="size-5 cursor-pointer text-black" />
      </div>

      {/* Menampilkan teks yang sudah diformat */}
      <p className="text-sm text-gray-600 mb-4 break-words">{formatContent(filteredContent)}</p>

      <div className="flex space-x-2 justify-start items-center gap-1 text-gray-500">
        <PiHandHeart className="size-4 text-pink-700" />
        {likes}
        <FaShareAlt className="size-4 text-blue-600" />
        {shares}
        <MdOutlineReport className="size-4 text-red-500" />
        {comments}
      </div>
    </div>
  )
}

export default PostCard
