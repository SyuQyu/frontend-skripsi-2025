"use client"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { Button, Card, Input } from "@/components/common"

interface FormValues {
  password: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.password) {
    errors.password = "Required"
  }
  return errors
}

export default function Account() {
  const router = useRouter()
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        router.push("/account/email/new-email")
        setSubmitting(false)
      }, 400)
    },
  })

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Verify Your Account Password"
        description="To change your email address, please enter your current password first"
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="xl:gap-8 gap-5 flex flex-col w-full">
          <div className="flex flex-col gap-2 justify-start items-start">
            <Input
              label="Password"
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-custom-blue text-white hover:bg-[#043ede] rounded-[10px] hover:text-white h-[55px]"
            size="lg"
            disabled={formik.isSubmitting}
          >
            Verify
          </Button>
        </form>
      </Card>
    </div>
  )
}
