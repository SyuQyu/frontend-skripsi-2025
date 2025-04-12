"use client"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { Mail, X } from "lucide-react"
import { Button, Card, OTPInput } from "@/components/common"
import useForgotPasswordStep from "@/context/forgotPasswordStep"
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
  const { completeStep, canAccessStep } = useForgotPasswordStep()
  if (!canAccessStep("step2")) {
    router.push("/forgot-password/email")
  }

  const { email, verificationCheck, verificationSend } = useAuthStore()
  const { toast } = useToast()

  const resendCode = async () => {
    const response = await verificationSend("reset_password", email)
    if (response.error) {
      toast({
        icon: (<X className="size-6" />),
        title: "Resend failed.",
        description: "An unexpected error occurred. Please try again later.",
      })
    }
    else {
      toast({
        icon: <Mail className="size-6" />,
        title: "Verification code resent.",
        description: "Please check your email or spam folder for the code. Thanks for your patience",
      })
    }
  }

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      const res = await verificationCheck("reset_password", email, values.otp)
      if (res.message?.code) {
        toast({
          icon: (<X className="size-6" />),
          title: "Code validation failed.",
          description: "It looks like the code is incorrect. Please check and try again",
        })
        setSubmitting(false)
      }
      else {
        completeStep("step3")
        toast({
          icon: (<Mail className="size-6" />),
          title: "Verification success.",
          description: "Verification code is valid.",
        })
        setTimeout(() => {
          setSubmitting(false)
          router.push("/forgot-password/reset-password")
        }, 400)
      }
    },
  })

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Enter verification code"
        description="We’ve sent a code to testing@gmail.com"
        styleTitle="text-2xl text-center"
        styleCard="max-w-[700px] w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none"
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
              className="text-custom-blue underline font-medium mx-1 cursor-pointer"
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
