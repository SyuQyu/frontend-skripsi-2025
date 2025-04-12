"use client"
import { useEffect, useRef, useState } from "react"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

import { getAccessToken } from "@/lib/cookies"
import { Button, Card, Input, PostCard } from "@/components/common"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import usePostStore from "@/context/post"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const { fetchAllPosts, posts, addPost, checkWord } = usePostStore()
  const { user } = useAuthStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllPosts()
    }
    const accessToken = getAccessToken()
    if (!accessToken) {
      router.push("/login")
    }
    fetchData()
  }, [router, fetchAllPosts])

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
        const payload = {
          userId: user?.id,
          content: values.content,
        }

        await addPost(payload)
        toast({
          icon: <Check className="size-6 text-green-500" />,
          title: "Post Successful",
          description: "Your story has been shared!",
        })

        resetForm()
        fetchAllPosts()
        setIsDialogOpen(false)
      }
      catch {
        toast({
          icon: <X className="size-6 text-red-500" />,
          title: "Post Failed",
          description: "Something went wrong. Please try again.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawValue = e.target.value
    formik.setFieldValue("content", rawValue) // langsung update UI dulu

    if (debounceRef.current)
      clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        const result: any = await checkWord(rawValue)
        formik.setFieldValue("content", result.filtered)
      }
      catch (error) {
        console.error("Filtering failed:", error)
      }
    }, 500) // debounce selama 500ms
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        description=""
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-6 min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <div className="max-w-2xl mx-auto pb-8">
          <div className="mb-4">
            <div className="mt-4 w-full">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                    Post Your Stories
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Posting</DialogTitle>
                    <DialogDescription>
                      Share your experience with the community.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={formik.handleSubmit} className="w-full flex flex-col gap-4">
                    <Input
                      className="w-full"
                      isTextarea={true}
                      name="content"
                      value={formik.values.content}
                      onChange={handleInputChange} // Ganti handler
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.content && formik.errors.content
                          ? formik.errors.content
                          : null
                      }
                      length={formik.values.content.length.toString()}
                      placeholder="Share your story..."
                    />
                    <DialogFooter>
                      <Button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        type="submit"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Posting..." : "Post"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {posts.map((post, idx) => (
            <PostCard key={idx} post={post} />
          ))}
        </div>
      </Card>
    </div>
  )
}
