"use client"
import React, { useEffect, useState } from "react"
import { useFormik } from "formik"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"
import { Button, Card, Input } from "@/components/common"
import { Checkbox } from "@/components/ui/checkbox"
import useAuthStore from "@/context/auth"
import { useToast } from "@/components/ui/use-toast"
import { getAccessToken } from "@/lib/cookies"

interface FormValues {
  username: string
  password: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.username) {
    errors.username = "Required"
  }
  if (!values.password) {
    errors.password = "Required"
  }
  return errors
}

export default function Login() {
  const router = useRouter()
  const accessToken = getAccessToken()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login } = useAuthStore()
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setErrors({})
      setSuccessMessage(null)
      setErrorMessage(null)
      try {
        const response = await login(values.username, values.password)
        if (response.error) {
          toast({
            icon: (<X className="size-6" />),
            title: "Login failed.",
            description: response.message.detail,
          })
        }
        else {
          toast({
            icon: (<Check className="size-6 text-green-600" />),
            title: "Login Success.",
          })

          if (response?.data?.role === "Admin" || response?.data?.role === "SuperAdmin") {
            router.push("/admin")
          }
          else {
            router.push("/")
          }
        }
      }
      catch (error) {
        // Tangani error unexpected
        toast({
          icon: (<X className="size-6" />),
          title: "Login failed.",
          description: "Unexpected error occurred.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (accessToken) {
      router.push(`/`)
    }
  }, [router])

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Sign into your account"
        description="Welcome back! Log in to continue your self-empathy journey."
        footer={(
          <div className="text-center">
            <p className="text-[#A7A7A7] space-x-1 mb-4">
              <span>By signing in you agree to our</span>
              <span className="underline">Terms of Service</span>
              <span>and</span>
              <span className="underline">Privacy Policy</span>
            </p>
          </div>
        )}
        styleTitle="text-2xl text-center"
        styleFooter="text-[#A7A7A7] flex justify-center items-center !p-0"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="sm:gap-8 gap-4 flex flex-col">
          <Input
            label="Username"
            type="text"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            error={formik.touched.username && formik.errors.username ? formik.errors.username : null}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
          />
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-2">
              <label htmlFor="rememberMe" className="flex flex-row items-center gap-2 cursor-pointer">
                <Checkbox
                  id="rememberMe"
                  className="rounded-[4px]"
                />
                <p>Remember Me</p>
              </label>
            </div>

            <Link href="/forgot-password/username" className="text-custom-blue">
              Forgot Password?
            </Link>
          </div>
          <div className="flex flex-col w-full gap-4 justify-center items-center">
            <Button
              type="submit"
              className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
              size="lg"
              disabled={formik.isSubmitting}
            >
              Sign in
            </Button>
            <p className="text-center">
              Don’t have an account?
              <Link href="/register/posting-rules" className="text-custom-blue"> Create an account</Link>
            </p>
          </div>
          {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        </form>

      </Card>

    </div>

  )
}
