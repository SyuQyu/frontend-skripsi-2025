"use client"
import Link from "next/link"
import { useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, ImageWithFallback, PostCard } from "@/components/common"
import useAuthStore from "@/context/auth"
import usePostStore from "@/context/post"

export default function ProfileByUsername() {
  const { fetchPostByUser, posts } = usePostStore()
  const params = useParams<{ userId: string }>()
  const searchParams = useSearchParams()
  const username = searchParams.get("username")

  useEffect(() => {
    const fetchData = async () => {
      await fetchPostByUser(params.userId)
    }
    fetchData()
  }, [fetchPostByUser, params.userId])
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        description=""
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0 relative"
        styleDescription="text-base text-black text-center"
      >
        <div className="w-full flex flex-col items-center relative sm:mb-24 mb-14">
          <div className="relative w-full rounded-lg overflow-hidden md:max-h-[200px] max-h-[150px]">
            <ImageWithFallback
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
              priority={false}
              src="/images/bg-img.jpg"
              alt="logo"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Post count and like count at bottom left */}
            <div className="absolute bottom-2 left-4 z-[2]">
              <p className="text-white text-sm md:text-base font-medium">
                {posts?.length}
                {" "}
                Posts
              </p>
            </div>

            {/* Username at bottom right */}
            <div className="absolute bottom-2 right-4 z-[2]">
              <p className="text-white text-sm md:text-base font-semibold">
                @
                {username}
              </p>
            </div>
          </div>
          <ImageWithFallback
            width={0}
            height={0}
            sizes="100vw"
            className="md:size-[100px] z-[2] size-[80px] object-cover border rounded-full absolute -bottom-10 left-1/2 -translate-x-1/2"
            priority={false}
            src="/images/person.jpg"
            alt="logo"
          />
        </div>
        <div className="w-full flex flex-col mb-10">
          {
            posts.length > 0
              ? posts.map((post, idx) => (
                  <PostCard key={idx} post={post} profile={true} />
                ))
              : (
                  <p className="text-center text-gray-500">No posts available</p>
                )
          }
        </div>
      </Card>
    </div>
  )
}
