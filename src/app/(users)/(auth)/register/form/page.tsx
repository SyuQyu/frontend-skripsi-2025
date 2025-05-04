"use client"
import React, { useCallback, useState } from "react"
import { useFormik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, X } from "lucide-react"
import debounce from "lodash.debounce"
import { Button, Card, Input, StrengthBarPassword } from "@/components/common"
import { getPasswordStrength } from "@/lib/utils"
import useRegisterStep from "@/context/registerStep"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"

interface FormValues {
  username: string
  email: string
  password: string
  confirmPassword: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}

  if (!values.username) {
    errors.username = "Required"
  }
  else if (!/^\w+$/.test(values.username)) {
    errors.username = "Username can only contain letters, numbers, and underscores"
  }

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
  const { register, checkUsername, checkEmail } = useAuthStore()
  const { toast } = useToast()

  if (!canAccessStep("step2")) {
    router.push("/register/posting-rules")
  }

  const [passwordStrength, setPasswordStrength] = useState(0)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)

  // Debounced async check for username
  const debouncedCheckUsername = useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setUsernameError(null)
        return
      }
      const res = await checkUsername(username)
      setUsernameError(!res.data?.available ? "Username is already taken" : null)
    }, 400),
    [],
  )

  // Debounced async check for email
  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setEmailError(null)
        return
      }
      const res = await checkEmail(email)
      setEmailError(!res.data?.available ? "Email is already taken" : null)
    }, 400),
    [],
  )

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      // Berhentikan submit kalau sudah ada error async username/email
      if (usernameError || emailError) {
        setErrors({
          username: usernameError || undefined,
          email: emailError || undefined,
        })
        setSubmitting(false)
        return
      }

      const response = await register(values.username, values.email, values.password, values.confirmPassword)

      if (response.error) {
        toast({
          icon: (<X className="size-6" />),
          title: "Registration failed.",
          description: response.message?.email?.[0] || "An unexpected error occurred. Please try again later.",
        })
        setSubmitting(false)
      }
      else {
        completeStep("step3")
        toast({
          icon: (<Mail className="size-6" />),
          title: "Registration success.",
          description: "Thank you for registering with us.",
        })
        setTimeout(() => {
          router.push("/login")
        }, 400)
        setSubmitting(false)
      }
    },
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.handleChange(e)
    setPasswordStrength(getPasswordStrength(e.target.value))
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
        <form onSubmit={formik.handleSubmit} className="sm:gap-8 gap-4 flex flex-col">
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={(e) => {
              formik.handleChange(e)
              debouncedCheckUsername(e.target.value)
            }}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={usernameError || (formik.touched.username && formik.errors.username ? formik.errors.username : null)}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={(e) => {
              formik.handleChange(e)
              debouncedCheckEmail(e.target.value)
            }}
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
            {formik.values.password && <StrengthBarPassword strength={passwordStrength} />}
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
