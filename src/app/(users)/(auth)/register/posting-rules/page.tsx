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

  if (!canAccessStep("step1")) {
    router.push("/login")
  }

  const handleContinue = () => {
    completeStep("step2")
    router.push("/register/form") // Navigate immediately to next step
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Create an account"
        description={(
          <div className="flex flex-row justify-center items-center gap-3">
            <p className="text-[20px] leading-5 font-bold">Anon’s Best Practices for Posting</p>
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
            {" "}
            <Link passHref target="_blank" href="https://www.traumaandempathy.com" className="underline mx-1 text-custom-blue">
              www.traumaandempathy.com,
            </Link>
            Our platform encourages open and meaningful sharing of personal experiences. While your stories may cover a wide range of topics important to you, we ask that all contributions maintain respect and empathy for others.
          </p>

          <p className="text-left">
            To foster a safe and supportive community, we set clear guidelines to ensure discussions remain constructive. Hate speech, spreading misinformation or hoaxes, personal attacks, or content that unfairly targets others are not allowed. At the same time, we uphold your freedom to express opinions and share your perspectives openly within these respectful boundaries.
          </p>

          <AccordionCustom
            headline="Community Posting Best Practices:"
            data={[
              {
                title: "Respectful Language",
                content: "Use polite, considerate, and non-offensive language when sharing your stories or engaging with others.",
              },
              {
                title: "Stay On Topic",
                content: "Focus posts on a single experience or topic to maintain clarity and understanding for all readers.",
              },
              {
                title: "Fact-based Sharing",
                content: "When sharing factual information, aim for accuracy and avoid exaggeration or unfounded claims.",
              },
              {
                title: "Express Personal Feelings",
                content: "Do share your emotions and perspectives honestly, helping others gain insight into your experience.",
              },
              {
                title: "Avoid Hate Speech or Incitement",
                content: "Content that promotes hatred, violence, or discrimination against individuals or groups is prohibited.",
              },
              {
                title: "No Misinformation or Hoaxes",
                content: "Ensure your posts do not spread false information that could mislead others.",
              },
              {
                title: "Allow Freedom of Expression",
                content: "We respect diverse viewpoints and encourage you to share them within the framework of respect and openness.",
              },
              {
                title: "Clarity and Completeness",
                content: "Provide clear, detailed accounts to help others understand your perspective without confusion or ambiguity.",
              },
            ]}
          />

          <p className="text-base leading-5 text-left">
            These guidelines aim to nurture a community where everyone feels safe to share and learn. We appreciate your contribution to creating a positive and respectful environment.
          </p>

          <div className="flex w-full flex-start flex-col space-y-5">
            <p className="text-base leading-5 text-left">
              Thank you for becoming part of our community!
            </p>
            <p className="text-base leading-5 text-left">
              Best wishes on your journey of self-discovery, growth, and meaningful connection.
            </p>
            <p className="text-base leading-5 text-left">
              The AnonChat Team
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
      </Card>
    </div>
  )
}
