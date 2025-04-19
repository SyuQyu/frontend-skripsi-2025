"use client"
import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getAccessToken } from "@/lib/cookies"
import { Card, PostCard } from "@/components/common"
import usePostStore from "@/context/post"

export default function Home() {
  const router = useRouter()
  const { fetchPostByTags, posts } = usePostStore()
  const params = useParams<{ tags: string }>()
  useEffect(() => {
    fetchPostByTags(params.tags)
    const accessToken = getAccessToken()
    if (!accessToken) {
      router.push("/login")
    }
  }, [router, fetchPostByTags])

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
            <p className="text-xl text-blue-600">{params.tags}</p>
          </div>
          {posts.map((post, idx) => (
            <PostCard key={idx} post={post} />
          ))}
        </div>
      </Card>
    </div>
  )
}
