"use client"
import React from "react"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { Button, Card } from "@/components/common"
import useContactUsStep from "@/context/contactUsStep"

export default function Contact() {
  const router = useRouter()
  const { canAccessStep } = useContactUsStep()
  if (!canAccessStep("step2")) {
    router.push("/contact-us")
  }
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Your Message Has Been Sent!"
        description="Thank you for reaching out, We’re so glad to have you with us. We have received your message and will respond to you as soon as possible."
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <Button
          type="submit"
          className={clsx("w-full bg-custom-blue hover:text-white text-white hover:bg-[#043ede] rounded-[10px] h-[55px] font-bold")}
          size="lg"
          link="/"
        >
          Done
        </Button>
      </Card>
    </div>
  )
}
