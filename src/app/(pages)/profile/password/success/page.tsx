"use client"
import { Button, Card } from "@/components/common"

export default function Agreement() {
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Password Updated Successfully"
        description="Your password has been updated. You will now use your new password to log in"
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <Button
          className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
          size="lg"
          link="/account"
        >
          Continue
        </Button>
      </Card>
    </div>
  )
}
