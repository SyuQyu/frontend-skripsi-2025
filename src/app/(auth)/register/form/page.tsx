"use client"
import React, { useState } from "react"
import { useFormik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IoMailSharp, IoWarningOutline } from "react-icons/io5"
import { Button, Card, Input, StrengthBarPassword } from "@/components/common"
import { getPasswordStrength } from "@/lib/utils"
import useRegisterStep from "@/context/registerStep"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

interface FormValues {
  email: string
  password: string
  confirmPassword: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.email) {
    errors.email = "Required"
  }
  else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }
  if (!values.password) {
    errors.password = "Required"
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "Required"
  }
  else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords must match"
  }
  return errors
}

export default function Form() {
  const router = useRouter()
  const { completeStep, canAccessStep } = useRegisterStep()
  const { register } = useAuthStore()
  const { toast } = useToast()

  if (!canAccessStep("step2")) {
    router.push("/register/posting-rules")
  }

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [emailError, setEmailError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setEmailError(null)
      const response = await register(values.email, values.password, values.confirmPassword)
      if (response.error) {
        if (response.message?.email[0]) {
          toast({
            icon: (<IoWarningOutline className="size-6" />),
            title: "Registration failed.",
            description: response.message?.email[0],
          })
        }
        else {
          toast({
            icon: (<IoWarningOutline className="size-6" />),
            title: "Registration failed.",
            description: "An unexpected error occurred. Please try again later.",
          })
        }
      }
      else {
        completeStep("step3")
        toast({
          icon: (<IoMailSharp className="size-6" />),
          title: "Code sent.",
          description: "Please check your email or spam folder for the code. Thanks for your patience.",
        })
        setTimeout(() => {
          router.push("/register/verification-account")
        }, 400)

        setSubmitting(false)
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
        title="Create an account"
        footer={(
          <p className="text-[#A7A7A7]">
            By signing in you agree to our
            <span className="underline mx-1">Terms of Service</span>
            and
            <span className="underline mx-1">Privacy Policy</span>
          </p>
        )}
        styleTitle="text-2xl text-center"
        styleFooter="text-[#A7A7A7] flex justify-center items-center !p-0"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
      >
        <form onSubmit={formik.handleSubmit} className="gap-8 flex flex-col">
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={emailError || (formik.touched.email && formik.errors.email ? formik.errors.email : null)}
          />
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
              Create account
            </Button>
            <p>
              Already have an account?
              <Link href="/login" className="text-custom-blue"> Sign In</Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}
