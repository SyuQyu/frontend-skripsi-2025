"use client"
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import { useParams, useRouter } from "next/navigation"
import { IoWarningOutline } from "react-icons/io5"
import { getAccessToken } from "@/lib/cookies"
import { Button, Card, Input, PostCard } from "@/components/common"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import usePostStore from "@/context/post"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const router = useRouter()
  const { fetchAllPosts, fetchPostById, selectedPost } = usePostStore()
  const params = useParams<{ postId: string }>()
  useEffect(() => {
    fetchPostById(params.postId)
    const accessToken = getAccessToken()
    if (!accessToken) {
      router.push("/login")
    }
  }, [router, fetchAllPosts])

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
            </div>
          </div>
          <PostCard post={selectedPost} detail={true} />
        </div>
      </Card>
    </div>
  )
}
