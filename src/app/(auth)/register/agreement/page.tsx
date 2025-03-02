"use client"
import { useState } from "react"
import { IoWarningOutline } from "react-icons/io5"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import useRegisterStep from "@/context/registerStep"
import { Button, Card } from "@/components/common"

export default function Agreement() {
  const router = useRouter()
  const [isAccepted, setIsAccepted] = useState(false)
  const { completeStep } = useRegisterStep()
  const handleContinue = () => {
    completeStep("step2")
    setTimeout(() => {
      router.push("/register/posting-rules")
    }, 400)
  }
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Create an account"
        description={(
          <div className="flex flex-row justify-center items-center gap-3">
            <IoWarningOutline className="text-2xl" />
            <p className="text-xl">Mental Health Warning</p>
          </div>
        )}
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black"
      >
        <div className="border-[#7090B033] flex flex-col justify-center items-center gap-12">
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-base text-black text-left">
              Reading and posting traumatic episodes may evoke strong negative emotions and flashbacks. This could re-traumatize or otherwise impact your emotional and mental well-being.
            </p>
            <p className="text-base text-black text-left">
              Additionally, some elements of our site’s design, such as the names of labels and buttons, might be triggering, for example, buttons like “Me Too” that are intended to acknowledge all types of shared traumatic experiences, regardless of the type of trauma, and across all ages, genders, and situations.
            </p>
            <p className="text-base text-black text-left">
              These design features could evoke strong emotions or memories in you, including those related to the broader #MeToo movement or other past traumas.
            </p>
            <p className="text-base text-black text-left">
              We encourage you to talk with people you trust to determine whether becoming a member of
              <Link passHref target="_blank" href="https://www.traumaandempathy.com" className="underline mx-1 text-custom-blue">www.traumaandempathy.com</Link>
              is right for you.
            </p>
          </div>
          <div className="flex flex-row justify-start items-center gap-2">
            <label htmlFor="accept" className="flex flex-row items-center gap-2 cursor-pointer">
              <Checkbox
                id="accept"
                className="rounded-[4px]"
                checked={isAccepted}
                onCheckedChange={(checked: boolean) => setIsAccepted(checked)}
              />
              <p>I accept this</p>
            </label>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <Button
              className={clsx("w-full", isAccepted ? "bg-custom-blue hover:text-white" : "bg-[#A5B4C7]", "text-white hover:bg-[#043ede] rounded-[10px] h-[55px]")}
              size="lg"
              disabled={!isAccepted}
              onClick={handleContinue}
            >
              Continue
            </Button>
            <Button
              link="/login"
              className="w-full border-[#0469DE] text-custom-blue hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
