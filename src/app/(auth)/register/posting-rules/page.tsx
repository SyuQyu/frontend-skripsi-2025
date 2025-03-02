"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import Link from "next/link"
import useRegisterStep from "@/context/registerStep"
import { AccordionCustom, Button, Card } from "@/components/common"

export default function Agreement() {
  const router = useRouter()
  const [isAccepted] = useState(false)
  const { completeStep, canAccessStep } = useRegisterStep()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!canAccessStep("step2")) {
    router.push("/register/agreement")
  }

  const handleContinue = () => {
    setIsModalOpen(true) // Show the modal first
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    completeStep("step3")
    setTimeout(() => {
      router.push("/register/posting-rules/yes") // Navigate to the next step after modal closes
    }, 400)
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Create an account"
        description={(
          <div className="flex flex-row justify-center items-center gap-3">
            <p className="text-[20px] leading-5 font-bold">T&E’s Best Practices for Posting</p>
          </div>
        )}
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] text-left min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0 text-[20px]"
        styleDescription="text-base text-black"
      >
        {/* Main content */}
        <div className="flex flex-col justify-center items-center gap-5 !text-base">
          <p className="text-base text-black text-left leading-5">
            Welcome to
            <Link passHref target="_blank" href="https://www.traumaandempathy.com" className="underline mx-1 text-custom-blue">www.traumaandempathy.com,</Link>
            Our platform is dedicated to sharing childhood trauma. Here, we invite you to share detailed accounts of traumatic episodes that have profoundly affected you...
          </p>

          <p className="text-left">
            Given the sensitive nature of childhood trauma, we must set clear boundaries to create a safe space for user interaction and communication. To maintain this safety, our website is anonymous. We have moderators who monitor posts, and direct messaging, commenting, and replies are not allowed. We also offer Best Practices for Posting, inspired by the Adult Attachment Interview (AAI; George, Main, & Kaplan, 1985), which incorporates communication principles that promote a more secure way of discussing traumatic childhood experiences.
          </p>

          <AccordionCustom
            headline="T&E’s Best Practices criteria:"
            data={[
              {
                title: "Narratives of Past Traumatic Events",
                content: "Posts that describe your memory of the original traumatic experience.",
              },
              {
                title: "Self-Contained Episodes",
                content: "Posts that focus on a single, self-contained event.",
              },
              {
                title: "Focusing on a Specific Episode",
                content: "Posts that concentrate on what occurred during the specific episode, without describing later events.",
              },
              {
                title: "Factual and Behavior-Focused",
                content: "Posts that maintain a reality-based and factual tone by documenting your age at the time of the event, the people involved, and the specific events and behaviors, including their actions, words, and interactions.",
              },
              {
                title: "Truthful and Objective",
                content: "Posts that are truthful and do not exaggerate, embellish or worsen the facts.",
              },
              {
                title: "Succinct and Complete",
                content: "Posts that provide a clear, vivid and detailed account from start to finish. These posts do not exhibit incoherent rambling and are neither too short to be understood nor too long to stay engaging.",
              },
              {
                title: "Relevant and On-Topic",
                content: "Posts that stay on topic. They do not mix multiple episodes, past and current issues, and accumulated lifelong hurts. They do not go off on tangents or include information unrelated to the episode in question.",
              },
              {
                title: "Plain and Simple Language",
                content: "Posts that use simple language, avoiding generalizations and psychological jargon, and break down complex ideas into simple, understandable terms.",
              },
              {
                title: "Describing the Feelings",
                content: "Posts that describe your personal feelings at the time of the event.",
              },
              {
                title: "Describing the Effect",
                content: "Posts that describe the effect the episode had on you both at the time and later in life.",
              },
            ]}
          />
          <p className="text-base leading-5 text-left">
            While our Best Practices for Posting are merely suggestions, and you are free to use your own posting style, following them may help you engage with others in a way that more closely resembles how securely attached people discuss their childhood experiences.
          </p>
          <div className="flex w-full flex-start flex-col space-y-5">
            <p className="text-base leading-5 text-left">

              Thank you for becoming part of our community!
            </p>
            <p className="text-base leading-5 text-left">
              Best wishes on your journey to self-empathy and more secure attachments.
            </p>
            <p className="text-base leading-5 text-left">
              The Trauma & Empathy Team
            </p>
          </div>
          {/* Continue Button */}
          <div className="flex flex-col gap-4 w-full">
            <Button
              className={clsx("w-full", "bg-custom-blue hover:text-white", "text-white hover:bg-[#043ede] rounded-[10px] h-[55px] mb-10")}
              size="lg"
              disabled={isAccepted}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 text-left w-[400px]">
              <button className="absolute top-3 right-3 text-gray-500 hover:text-black" onClick={() => setIsModalOpen(false)}>
                &#10005;
              </button>
              <h3 className="text-lg font-bold">Would you like to share your first traumatic episode?</h3>
              <p className="text-sm text-gray-500 mb-4">
                A traumatic episode is a vivid memory of a specific adverse life event. Please avoid making posts that summarize your entire life.
              </p>
              <div className="flex flex-col justify-center space-y-4">
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={handleModalClose} // Close modal and continue
                >
                  Yes
                </Button>
                <Button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)} // Close modal but stay on current screen
                >
                  Not Now
                </Button>
              </div>

            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
