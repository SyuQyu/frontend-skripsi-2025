"use client"
import React, { useState } from "react"
import Link from "next/link"
import { FaRegEdit, FaShareAlt } from "react-icons/fa"
import { PiHeart } from "react-icons/pi"
import { IoHeartCircleOutline } from "react-icons/io5"
import { MdMoreHoriz, MdOutlineReport } from "react-icons/md"
import { useFormik } from "formik"
import { timeAgo } from "@/lib/utils"
import { Input } from ".."
import { useToast } from "@/components/ui/use-toast"

function PostCard({ post, detail }: any) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const { toast } = useToast()
  const createdAt = timeAgo(post?.createdAt)
  const author = post.user?.username || "Unknown"
  const content = post.content || "No content available"
  const filteredContent = post.filteredContent !== null ? post.filteredContent : content

  const formik = useFormik({
    initialValues: { content: "" },
    validate: (values) => {
      const errors: { content?: string } = {}
      if (!values.content.trim()) {
        errors.content = "Content cannot be empty"
      }
      else if (values.content.length > 500) {
        errors.content = "Content must not exceed 500 characters"
      }
      return errors
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        // const payload = {
        //   replyId: activeReplyId,
        //   userId: post.user?.id,
        //   content: values.content,
        // }
        // console.log(payload)
        // await addPost(payload)
        toast({
          icon: <IoHeartCircleOutline className="size-6 text-green-500" />,
          title: "Reply Successful",
          description: "Your reply has been posted!",
        })

        resetForm() // Reset form after posting
      }
      catch {
        toast({
          icon: <IoHeartCircleOutline className="size-6 text-red-500" />,
          title: "Reply Failed",
          description: "Something went wrong. Please try again.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

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

  const handleReplyClick = (replyId: string) => {
    setActiveReplyId(prev => (prev === replyId ? null : replyId))
    formik.resetForm() // Reset agar input bersih saat pindah reply
  }

  const handlePostClick = () => {
    setActiveReplyId(null) // Reset ke post utama
  }

  const renderReplies = (replies: any[]) => {
    return replies.map(reply => (
      <React.Fragment key={reply.id}>
        <div
          className="border rounded-lg shadow-md p-4 mb-4 bg-white relative"
        >
          <div className="flex flex-row justify-between items-center w-full mb-3">
            <div className="flex flex-start justify-start w-full gap-4 items-center">
              <p className="text-sm text-gray-700">
                <Link href={`/profile/${reply.user.username}`} className="hover:underline">
                  {reply.user.username}
                </Link>
              </p>
              <span className="text-sm text-gray-500">{timeAgo(reply.createdAt)}</span>
            </div>
            <MdMoreHoriz className="size-5 cursor-pointer text-black" />
          </div>

          <p
            className="text-sm text-gray-600 mb-4 break-words cursor-pointer"
            onClick={() => handleReplyClick(reply.id)}
          >
            {formatContent(reply.filteredContent || reply.content)}
          </p>

          <div className="flex space-x-2 justify-start items-center gap-1 text-gray-500">
            <PiHeart className="size-4 text-pink-700" />
            {reply.likes.length}
            <FaShareAlt className="size-4 text-blue-600" />
            {reply.replies.length}
            <MdOutlineReport className="size-4 text-red-500" />
            {reply.reports.length}
          </div>

          {/* Input muncul di bawah reply yang ditekan */}
          {activeReplyId === reply.id && (
            <form onSubmit={formik.handleSubmit} className="mt-4">
              <Input
                className="w-full"
                isTextarea={true}
                name="content"
                value={formik.values.content}
                onChange={(e) => {
                  formik.setFieldValue("content", e.target.value)
                }}

                error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
                length={formik.values.content.length.toString()}
                placeholder="Balas komentar..."
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Reply</button>
            </form>
          )}
        </div>

        {/* Render child replies jika ada */}
        <div className="ml-2 border-l-2 pl-4">
          {reply.replies.length > 0 && renderReplies(reply.replies)}
        </div>
      </React.Fragment>
    ))
  }

  return (
    <div>
      <div
        className="border rounded-lg shadow-md p-4 mb-4 bg-white relative cursor-pointer"
        onClick={handlePostClick} // Klik post utama untuk memunculkan input
      >
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

        <p className="text-sm text-gray-600 mb-4 break-words">
          {formatContent(filteredContent)}
        </p>

        <div className="flex space-x-2 justify-start items-center gap-1 text-gray-500">
          <PiHeart className="size-4 text-pink-700" />
          {post.likes.length}
          <FaShareAlt className="size-4 text-blue-600" />
          {post.replies.length}
          <MdOutlineReport className="size-4 text-red-500" />
          {post.reports.length}
        </div>

        {/* Input untuk post utama */}
        {activeReplyId === null && detail && (
          <form onSubmit={formik.handleSubmit} className="mt-4">
            <Input
              className="w-full"
              isTextarea={true}
              name="content"
              value={formik.values.content}
              onChange={(e) => {
                formik.setFieldValue("content", e.target.value)
              }}

              error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
              length={formik.values.content.length.toString()}
              placeholder="Balas komentar..."
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Reply</button>
          </form>
        )}
      </div>

      {post.replies && detail && post.replies.length > 0 && (
        <div className="mt-8 border-l-2 pl-4">
          <h3 className="text-sm font-semibold text-gray-700 pb-4">Replies:</h3>
          {renderReplies(post.replies)}
        </div>
      )}
    </div>
  )

  // return detail ? <PostContent /> : <Link href={`/post/${post.id}`} className="w-full cursor-pointer"><PostContent /></Link>
}

export default PostCard
