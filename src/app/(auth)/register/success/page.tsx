"use client"
import { useRouter } from "next/navigation"
import { Button, Card } from "@/components/common"
import useRegisterStep from "@/context/registerStep"

export default function Agreement() {
  const router = useRouter()
  const { canAccessStep } = useRegisterStep()
  if (!canAccessStep("step5")) {
    router.push("/register/verification-account")
  }
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="You're all set!"
        description="Congratulations! Your account has been successfully created. We’re so glad to have you with us."
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <Button
          className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
          size="lg"
          link="/login"
        >
          Continue
        </Button>
      </Card>
    </div>
  )
}
