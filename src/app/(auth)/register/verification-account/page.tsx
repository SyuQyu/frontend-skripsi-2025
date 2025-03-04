"use client"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { IoMailSharp, IoWarningOutline } from "react-icons/io5"
import { useState } from "react"
import { Button, Card, OTPInput } from "@/components/common"
import useRegisterStep from "@/context/registerStep"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

interface FormValues {
  otp: string
}

const REGEXP_ONLY_DIGITS_AND_CHARS: RegExp = /^[a-z0-9]+$/i

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.otp) {
    errors.otp = "Required"
  }
  else if (!REGEXP_ONLY_DIGITS_AND_CHARS.test(values.otp) || values.otp.length !== 4) {
    errors.otp = "Invalid OTP"
  }
  return errors
}

export default function VerificationCode() {
  const router = useRouter()
  const { completeStep, canAccessStep } = useRegisterStep()
  const { email, verificationCheck, verificationSend } = useAuthStore()
  const { toast } = useToast()

  const [canResend, setCanResend] = useState<boolean>(true)

  if (!canAccessStep("step3")) {
    router.push("/register/form")
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      otp: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      const response = await verificationCheck("account_verification", email, values.otp)
      if (response.error) {
        toast({
          icon: (<IoWarningOutline className="size-6" />),
          title: "Verification failed.",
          description: "It looks like the code is incorrect. Please check and try again",
        })
      }
      else {
        completeStep("step4")
        toast({
          icon: <IoMailSharp className="size-6" />,
          title: "Verification Success.",
        })
        setTimeout(() => {
          router.push("/register/success")
        }, 400)

        setSubmitting(false)
      }
    },
  })

  const resendCode = async () => {
    if (!canResend)
      return
    setCanResend(false)

    const response = await verificationSend("account_verification", email)
    if (response.error) {
      toast({
        icon: (<IoWarningOutline className="size-6" />),
        title: "Resend failed.",
        description: "An unexpected error occurred. Please try again later.",
      })
    }
    else {
      toast({
        icon: <IoMailSharp className="size-6" />,
        title: "Verification code resent.",
        description: "Please check your email or spam folder for the code. Thanks for your patience",
      })
    }
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Verify your account"
        description="To complete your registration, please enter the verification code we have sent to your email address"
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="gap-5 flex flex-col">
          <div className="flex justify-center items-center">
            <OTPInput
              length={1}
              value={formik.values.otp}
              onChange={value => formik.setFieldValue("otp", value)}
              error={formik.touched.otp && formik.errors.otp ? formik.errors.otp : null}
            />
          </div>

          <p className="text-center">
            Didn’t receive the code?
            <span
              className={`text-custom-blue underline font-medium mx-1 ${canResend ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={resendCode}
            >
              Resend it
            </span>
          </p>
          <div className="flex flex-col w-full gap-4 justify-center items-center">
            <Button
              type="submit"
              className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
              size="lg"
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
