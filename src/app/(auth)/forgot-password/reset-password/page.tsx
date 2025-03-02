"use client"
import type { FormikErrors } from "formik"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { IoMailSharp, IoWarningOutline } from "react-icons/io5"
import { Button, Card, Input, StrengthBarPassword } from "@/components/common"
import { getPasswordStrength } from "@/lib/utils"
import useForgotPasswordStep from "@/context/forgotPasswordStep"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

interface FormValues {
  password: string
  confirmPassword: string
}

export default function ChangePassword() {
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
  const { canAccessStep } = useForgotPasswordStep()
  const { email, codeVerificationPassword, resetPassword } = useAuthStore()
  const { toast } = useToast()
  if (!canAccessStep("step3")) {
    router.push("/forgot-password/verification-code")
  }
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (values: FormValues) => {
      const errors: FormikErrors<FormValues> = {}
      if (!values.password) {
        errors.password = "Required"
      }
      else if (values.password.length < 8) {
        errors.password = "Password must be at least 8 characters"
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Required"
      }
      else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords must match"
      }
      return errors
    },
    onSubmit: async (values, { setSubmitting }) => {
      const res = await resetPassword(email, values.password, values.confirmPassword, codeVerificationPassword)
      if (res.message?.code) {
        toast({
          icon: (<IoWarningOutline className="size-6" />),
          title: "Code validation failed.",
          description: "It looks like the code is incorrect. Please check and try again",
        })
        setSubmitting(false)
      }
      else {
        toast({
          icon: (<IoMailSharp className="size-6" />),
          title: "Reset success.",
          description: "Your password has been successfully reset. Redirecting to login.",
        })
        setTimeout(() => {
          setSubmitting(false)
          router.push("/login")
        }, 400)
      }
    },
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e)
    const strength = getPasswordStrength(e.target.value)
    setPasswordStrength(strength)
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Reset Your Password"
        description="Enter a new password for your account. Make sure it’s something strong and secure."
        styleTitle="text-2xl text-center"
        styleCard="max-w-[700px] w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"

      >
        <form onSubmit={formik.handleSubmit} className="gap-8 flex flex-col">
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              onChange={handlePasswordChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
            />
            {
              formik.values.password && (
                <StrengthBarPassword strength={passwordStrength} />
              )
            }
          </div>
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : null}
          />
          <div className="flex flex-col w-full gap-4 justify-center items-center">
            <Button
              type="submit"
              className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
              size="lg"
              disabled={formik.isSubmitting}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
