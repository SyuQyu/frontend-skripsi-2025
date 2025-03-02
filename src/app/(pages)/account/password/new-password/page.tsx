"use client"
import type { FormikErrors } from "formik"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button, Card, Input, StrengthBarPassword } from "@/components/common"
import { getPasswordStrength } from "@/lib/utils"

interface FormValues {
  password: string
  confirmPassword: string
}

export default function ChangePassword() {
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()
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
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false)
        router.push("/account/password/success")
      }, 400)
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
        title="Create a New Password"
        description="Enter a new password for your account. Make sure it’s something strong and secure."
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="xl:gap-8 gap-5 flex flex-col">
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              className="mb-4"
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
              Set new password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
