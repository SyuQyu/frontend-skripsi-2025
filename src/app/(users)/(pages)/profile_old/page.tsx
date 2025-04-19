import Link from "next/link"
import { Card, Input } from "@/components/common"

export default function Account() {
  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Your Account Information"
        description=""
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <div className="flex flex-col xl:gap-8 gap-5">
          <div className="flex flex-col gap-2 justify start items-start">
            <Input
              label="Email"
              type="email"
              name="email"
              value="email@gmail.com"
              disabled={true}
            />
            <Link href="/account/email/verify" className="font-medium text-custom-blue text-base">Change email</Link>
          </div>
          <div className="flex flex-col gap-2 justify start items-start">
            <Input
              label="Password"
              type="password"
              name="password"
              value="awdawdawdawd"
              disabled={true}
            />
            <Link href="/account/password/verify" className="font-medium text-custom-blue text-base">Change password</Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
