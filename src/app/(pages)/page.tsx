"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAccessToken } from "@/lib/cookies"
import { Card, PostCard } from "@/components/common"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      router.push("/login")
    }
  }, [router])

  const [showYourPosts, setShowYourPosts] = useState(false)

  const allPosts = [
    {
      time: "7 minutes ago",
      age: "6-8 years old",
      title: "My father, assaulted me physically, assaulted me verbally, assaulted my siblings.",
      content: "Lorem ipsum dolor sit amet...",
      status: "Severe Impact",
      likes: 22,
      comments: 4,
      shares: 23,
    },
    {
      time: "1 hours ago",
      age: "6-8 years old",
      title: "My father, assaulted me physically, assaulted me verbally, assaulted my siblings.",
      content: "Lorem ipsum dolor sit amet...",
      status: "Fully Resolved",
      likes: 22,
      comments: 4,
      shares: 23,
    },
  ]

  const yourPosts = [
    {
      time: "3 days ago",
      age: "10-12 years old",
      title: "My mother, neglected my needs during my childhood.",
      content: "Lorem ipsum dolor sit amet...",
      status: "Partially Resolved",
      likes: 12,
      comments: 2,
      shares: 8,
    },
  ]

  const postsToShow = showYourPosts ? yourPosts : allPosts

  return (

    <div className="flex flex-row justify-center items-center">
      <Card
        description=""
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"

      >
        <div className="max-w-2xl mx-auto py-8">
          <div className="mb-4">
            <div className="flex justify-center items-center mb-4">
              <div className="flex space-x-8">
                <button
                  className={`text-lg py-2 px-6 ${!showYourPosts ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                  onClick={() => setShowYourPosts(false)}
                >
                  All posts
                </button>
                <button
                  className={`text-lg py-2 px-6 ${showYourPosts ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"
                    }`}
                  onClick={() => setShowYourPosts(true)}
                >
                  Your posts
                </button>
              </div>
            </div>
            <div className="mt-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
                Post Your Traumatic Episode
              </button>
            </div>
          </div>
          {postsToShow.map((post, idx) => (
            <PostCard key={idx} {...post} />
          ))}
        </div>
      </Card>
    </div>
  )
}
