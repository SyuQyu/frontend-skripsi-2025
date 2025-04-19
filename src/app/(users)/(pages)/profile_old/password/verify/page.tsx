"use client"
import React from "react"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { Button, Card, Input } from "@/components/common"

interface FormValues {
  email: string
  password: string
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
  return errors
}

export default function Login() {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        router.push("/account/password/verification-code")
        setSubmitting(false)
      }, 400)
    },
  })

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Change Your Password"
        description="Enter your email and old password below, to Change Your Password"
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="xl:gap-8 gap-5 flex flex-col">
          <Input
            label="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          />
          <Input
            label="Old Password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
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
