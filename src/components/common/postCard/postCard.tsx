"use client"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useFormik } from "formik"
import { Check, CircleAlert, Ellipsis, Heart, Reply, Trash, X } from "lucide-react"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { timeAgo } from "@/lib/utils"
import { Button, DropDownMenu, Input } from ".."
import { useToast } from "@/components/ui/use-toast"
import useReplyStore from "@/context/replies"
import usePostStore from "@/context/post"
import useAuthStore from "@/context/auth"
import useLikeStore from "@/context/likes"
import useReportStore from "@/context/reports"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function PostCard({ post, detail, profile }: any) {
  const { addReply, removeReply, IncrementReplyView } = useReplyStore()
  const { fetchPostById, removePost, fetchAllPosts, fetchPostByUser, IncrementPostView, checkWord, isLoading } = usePostStore()
  const { addLike, fetchLikesByParent } = useLikeStore()
  const { addReport } = useReportStore()
  const { user } = useAuthStore()
  const { toast } = useToast()
  const router = useRouter()
  const createdAt = timeAgo(post?.createdAt)
  const author = post?.user?.username || "Unknown"
  const content = post?.content || "No content available"
  const filteredContent = post?.filteredContent !== null ? post?.filteredContent : content
  const violationTypes = [
    { value: "spam", label: "Spam" },
    { value: "inappropriate_content", label: "Inappropriate content" },
    { value: "harassment", label: "Harassment" },
    { value: "hate_speech", label: "Hate speech" },
  ]
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [reportContent, setReportContent] = useState("")
  const [violationType, setViolationType] = useState("")
  const [reportFor, setReportFor] = useState({
    type: "post",
    id: post?.id,
  })

  // State untuk filtered words di reply
  const [filteredWords, setFilteredWords] = useState<any[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const refetchPost = () => {
    if (!profile) {
      fetchPostById(post?.id)
      fetchAllPosts()
    }
    else {
      fetchPostByUser(user?.id)
    }
  }

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
        let payload: any = {
          postId: post?.id,
          userId: user?.id,
          content: values.content,
        }
        if (activeReplyId !== null) {
          payload = {
            ...payload,
            parentId: activeReplyId,
          }
        }
        await addReply(payload)
        toast({
          icon: <Check className="size-6 text-green-500" />,
          title: "Reply Successful",
          description: "Your reply has been posted!",
        })
        fetchPostById(post?.id) // update replies
        resetForm()
        setFilteredWords([]) // reset filtered words setelah submit
      }
      catch {
        toast({
          icon: <X className="size-6 text-red-500" />,
          title: "Reply Failed",
          description: "Something went wrong. Please try again.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  // Handler input change reply dengan debounce dan cek kata tidak sesuai
  const handleReplyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = e.target.value
    formik.setFieldValue("content", rawValue)

    if (debounceRef.current)
      clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const result: any = await checkWord(rawValue)
        setFilteredWords(result.filteredWords || [])
      }
      catch (error) {
        console.error("Filtering failed:", error)
      }
    }, 500)
  }

  const handleReplyClick = (replyId: string) => {
    setActiveReplyId(prev => (prev === replyId ? null : replyId))
    formik.resetForm()
    setFilteredWords([]) // bersihkan saat pindah reply juga
  }

  const handleReportClick = (data: string, replyId?: string) => {
    setReportFor({
      type: data,
      id: replyId || post?.id,
    })
    setIsDialogOpen(true)
  }

  const handleReportSubmit = async () => {
    try {
      if (reportFor.type === "post") {
        await addReport({
          postId: reportFor.id,
          userId: user?.id,
          message: reportContent,
          violationCategory: violationType,
        })
      }
      else {
        await addReport({
          replyId: reportFor.id,
          userId: user?.id,
          message: reportContent,
          violationCategory: violationType,
        })
      }
      toast({
        icon: <Check className="size-6 text-green-500" />,
        title: "Report Successful",
        description: "Your report has been submitted!",
      })
      setIsDialogOpen(false)
      refetchPost()
    }
    catch {
      toast({
        icon: <X className="size-6 text-red-500" />,
        title: "Report Failed",
        description: "Something went wrong. Please try again.",
      })
    }
    finally {
      setReportContent("")
      setViolationType("")
    }
  }

  const handleDeleteClick = async (data: string, replyId?: string) => {
    try {
      if (data === "post") {
        await removePost(post?.id)
      }
      else if (data === "reply") {
        if (replyId) {
          await removeReply(replyId)
        }
        setActiveReplyId(null)
      }
      toast({
        icon: <Check className="size-6 text-green-500" />,
        title: "Delete Successful",
      })
      refetchPost()
      if (detail && data === "post") {
        router.push("/")
      }
    }
    catch {
      toast({
        icon: <X className="size-6 text-red-500" />,
        title: "Delete Failed",
      })
    }
  }

  const handlePostClick = () => {
    setActiveReplyId(null)
    setFilteredWords([]) // bersihkan juga
  }

  const handleLikes = async (type: string, id: string) => {
    try {
      if (type === "post") {
        await fetchLikesByParent(id, "post")
        await addLike({
          userId: user?.id,
          postId: id,
          type: "post",
        })
      }
      else {
        await fetchLikesByParent(id, "reply")
        await addLike({
          userId: user?.id,
          replyId: id,
          type: "reply",
        })
      }
      refetchPost()
    }
    catch {
      toast({
        icon: <X className="size-6 text-red-500" />,
        title: "Like Failed",
      })
    }
  }

  const ref = useRef<HTMLDivElement>(null)
  const hasBeenSeenRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !hasBeenSeenRef.current) {
          hasBeenSeenRef.current = true
          if (post?.id && !activeReplyId) {
            await IncrementPostView(post?.id, user?.id)
          }
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const replyRefs = useRef<Record<string, HTMLElement | null>>({})
  const seenRepliesRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      for (const entry of entries) {
        const id = entry.target.id
        if (entry.isIntersecting && !seenRepliesRef.current.has(id)) {
          seenRepliesRef.current.add(id)
          await IncrementReplyView(id, user?.id)
        }
      }
    }, { threshold: 0.5 })

    Object.values(replyRefs.current).forEach((el) => {
      if (el)
        observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const formatContent = (text: string) => {
    return text?.split("\n").map((line, index) => (
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

  const renderReplies = (replies: any[]) => {
    return replies?.map(reply => (
      <React.Fragment key={reply.id}>
        <div
          className="border rounded-lg shadow-md p-4 mb-4 bg-white relative"
          id={reply.id}
          ref={(el) => {
            if (el)
              replyRefs.current[reply.id] = el
          }}
        >
          <div className="flex flex-row justify-between items-center w-full mb-3">
            <div className="flex flex-start justify-start sm:flex-row flex-col w-full sm:gap-4 gap-1 sm:items-center items-start">
              <p className="text-sm text-gray-700">
                <Link href={`/profile/${reply?.user.id}?username=${reply?.user.username}`} className="hover:underline font-semibold">
                  @
                  {reply?.user.username}
                </Link>
              </p>
              <span className="text-sm text-gray-500">{timeAgo(reply?.createdAt)}</span>
            </div>
            <DropDownMenu trigger={<Ellipsis className="size-5 cursor-pointer text-black" />}>
              <div className="flex flex-col gap-2 justify-start items-start">
                <Button
                  className="text-sm text-gray-700 hover:text-gray-900 !border-none"
                  onClick={() => handleReportClick("reply", reply?.id)}
                >
                  <CircleAlert className="size-5 text-red-500 mr-1" />
                  Report
                </Button>
                {user?.id === reply?.user.id && (
                  <Button className="text-sm text-gray-700 hover:text-gray-900 !border-none" onClick={() => handleDeleteClick("reply", reply?.id)}>
                    <Trash className="size-5 text-blue-500 mr-1" />
                    delete
                  </Button>
                )}
              </div>
            </DropDownMenu>
          </div>

          <p
            className="text-sm text-gray-600 mb-4 break-words cursor-pointer"
            onClick={() => handleReplyClick(reply?.id)}
          >
            {formatContent(reply?.filteredContent || reply?.content)}
          </p>

          <div className="flex space-x-2 justify-start items-center gap-1 text-gray-500">
            <Heart className="size-4 cursor-pointer" fill={reply?.likes?.some((like: { userId: any }) => like.userId === user?.id) ? "#be185d" : "white"} onClick={() => handleLikes("reply", reply.id)} />
            {reply?.likes?.length}
            <Reply className="size-4 text-blue-600" />
            {reply?.replies?.length}
            <CircleAlert className="size-4 text-red-500" />
            {reply?.reports?.length}
          </div>

          {/* Input muncul di bawah reply yang ditekan */}
          {activeReplyId === reply?.id && (
            <>
              {filteredWords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {filteredWords.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-red-100 border border-red-400 rounded px-2 py-1">
                      <span className="text-red-700 font-semibold">{item.original}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-blue-600 hover:underline p-0 h-auto"
                        onClick={() => {
                          const replaced = formik.values.content.replace(
                            new RegExp(item.rawWord, "gi"),
                            item.replacement,
                          )
                          formik.setFieldValue("content", replaced)

                          checkWord(replaced).then((result: any) => {
                            setFilteredWords(result.filteredWords || [])
                          })
                        }}
                      >
                        Replace with
                        {" "}
                        <span className="font-bold ml-1">{item.replacement}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className={clsx(filteredWords.length > 0 ? "mt-1" : "mt-4")}>
                <Input
                  className="w-full"
                  isTextarea={true}
                  name="content"
                  value={formik.values.content}
                  onChange={handleReplyInputChange}
                  error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
                  length={formik.values.content.length.toString()}
                  placeholder="Balas komentar..."
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Reply</button>
              </form>
            </>
          )}
        </div>

        {/* Render child replies jika ada */}
        <div className="ml-2 border-l-2 pl-4">
          {reply?.replies?.length > 0 && renderReplies(reply?.replies)}
        </div>
      </React.Fragment>
    ))
  }

  return (
    <>
      <div
        className="border rounded-lg shadow-md p-4 mb-4 bg-white relative cursor-pointer z-10"
        onClick={handlePostClick}
      >
        {detail
          ? (
              <>
                <div className="flex flex-row justify-between items-center w-full mb-3">
                  <div className="flex flex-start justify-start sm:flex-row flex-col w-full sm:gap-4 gap-1 sm:items-center items-start">
                    <p className="text-sm text-gray-700">
                      <Link href={`/profile/${post?.user?.id}?username=${post?.user.username}`} className="hover:underline font-semibold">
                        @
                        {author}
                      </Link>
                    </p>
                    <span className="text-sm text-gray-500">{createdAt}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 break-words">
                  {formatContent(filteredContent)}
                </p>
              </>
            )
          : (
              <Link href={`/post/${post?.id}`} className="z-10">
                <div
                  className="flex flex-row justify-between items-center w-full mb-3"
                  ref={ref}
                >
                  <div className="flex flex-start justify-start sm:flex-row flex-col w-full sm:gap-4 gap-1 sm:items-center items-start">
                    <p className="text-sm text-gray-700">
                      <Link href={`/profile/${post?.user?.id}?username=${post?.user.username}`} className="hover:underline font-semibold">
                        @
                        {author}
                      </Link>
                    </p>
                    <span className="text-sm text-gray-500">{createdAt}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 break-words">
                  {formatContent(filteredContent)}
                </p>
              </Link>
            )}

        <div className="flex space-x-2 justify-start items-center gap-1 text-gray-500">
          <Heart className="size-4" fill={post?.likes?.some((like: { userId: any }) => like.userId === user?.id) ? "#be185d" : "white"} onClick={() => handleLikes("post", post.id)} />
          {post?.likes?.length}
          <Reply className="size-4 text-blue-600" />
          {post?.replies?.length}
          <CircleAlert className="size-4 text-red-500" />
          {post?.reports?.length}
        </div>

        {/* Input untuk post utama */}
        {activeReplyId === null && detail && (
          <>
            {filteredWords.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {filteredWords.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-red-100 border border-red-400 rounded px-2 py-1">
                    <span className="text-red-700 font-semibold">{item.original}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-blue-600 hover:underline p-0 h-auto"
                      onClick={() => {
                        const replaced = formik.values.content.replace(
                          new RegExp(item.rawWord, "gi"),
                          item.replacement,
                        )
                        formik.setFieldValue("content", replaced)

                        checkWord(replaced).then((result: any) => {
                          setFilteredWords(result.filteredWords || [])
                        })
                      }}
                    >
                      Replace with
                      {" "}
                      <span className="font-bold ml-1">{item.replacement}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className={clsx(filteredWords.length > 0 ? "mt-1" : "mt-4")}>
              <Input
                className="w-full"
                isTextarea={true}
                name="content"
                value={formik.values.content}
                onChange={handleReplyInputChange}
                error={formik.touched.content && formik.errors.content ? formik.errors.content : null}
                length={formik.values.content.length.toString()}
                placeholder="Balas komentar..."
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600">Reply</button>
            </form>
          </>
        )}
        <div className="absolute top-4 right-4 z-20">
          <DropDownMenu trigger={<Ellipsis className="size-5 cursor-pointer text-black" />}>
            <div className="flex flex-col gap-2 justify-start items-start">
              <Button
                className="text-sm text-gray-700 hover:text-gray-900 !border-none"
                onClick={() => handleReportClick("post")}
              >
                <CircleAlert className="size-5 text-red-500 mr-1" />
                Report
              </Button>
              {user?.id === post?.user.id && (
                <Button className="text-sm text-gray-700 hover:text-gray-900 !border-none" onClick={() => handleDeleteClick("post")}>
                  <Trash className="size-5 text-blue-500 mr-1" />
                  delete
                </Button>
              )}
            </div>
          </DropDownMenu>
        </div>
      </div>

      {post?.replies && detail && post?.replies.length > 0 && (
        <div className="mt-8 border-l-2 pl-4">
          <h3 className="text-sm font-semibold text-gray-700 pb-4">Replies:</h3>
          {renderReplies(post?.replies)}
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Laporkan Postingan</DialogTitle>
            <DialogDescription>Berikan alasan mengapa Anda ingin melaporkan konten ini.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Pilih Jenis Pelanggaran:
            </label>
            <Select value={violationType} onValueChange={setViolationType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih jenis pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                {violationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            className="w-full"
            isTextarea={true}
            name="content"
            value={reportContent}
            onChange={e => setReportContent(e.target.value)}
            placeholder="Tulis alasan laporan..."
          />
          <DialogFooter>
            <Button className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => handleReportSubmit()}>
              Kirim Laporan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PostCard
