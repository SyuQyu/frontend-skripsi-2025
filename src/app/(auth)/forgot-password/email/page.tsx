"use client"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { IoMailSharp, IoWarningOutline } from "react-icons/io5"
import { Button, Card, Input } from "@/components/common"
import { useToast } from "@/components/ui/use-toast"
import useForgotPasswordStep from "@/context/forgotPasswordStep"
import useAuthStore from "@/context/auth"

interface FormValues {
  email: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.email) {
    errors.email = "Required"
  }
  else if (
    !/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address"
  }
  return errors
}

export default function ForgotPassword() {
  const router = useRouter()
  const { completeStep, canAccessStep } = useForgotPasswordStep()
  if (!canAccessStep("step1")) {
    router.push("/login")
  }

  const { toast } = useToast()
  const { verificationSend } = useAuthStore()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      const res: any = await verificationSend("reset_password", values.email)
      if (res.message?.email) {
        toast({
          icon: (<IoWarningOutline className="size-6" />),
          title: "Code sent failed.",
          description: "It looks like the email is incorrect. Please check and try again",
        })
        setSubmitting(false)
      }
      else {
        completeStep("step2")
        toast({
          icon: (<IoMailSharp className="size-6" />),
          title: "Code sent.",
          description: "Please check your email or spam folder for the code. Thanks for your patience.",
        })
        setTimeout(() => {
          setSubmitting(false)
          router.push("/forgot-password/verification-code")
        }, 400)
      }
    },
  })

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Forgot Your Password?"
        description="Don’t worry! Enter your email below, and we’ll send you a link to reset your password."
        styleTitle="text-2xl text-center"
        styleCard="max-w-[700px] w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="gap-5 flex flex-col">
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          />
          <div className="flex flex-col w-full gap-4 justify-center items-center">
            <Button
              type="submit"
              className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
              size="lg"
              disabled={formik.isSubmitting}
            >
              Send reset link
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
