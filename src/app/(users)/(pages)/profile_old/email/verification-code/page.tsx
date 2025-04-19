"use client"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { Button, Card, OTPInput } from "@/components/common"

interface FormValues {
  otp: string
}

const REGEXP_ONLY_DIGITS_AND_CHARS: any = /^[a-z0-9]+$/i

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
  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false)
        router.push("/account/email/success")
      }, 400)
    },
  })

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Enter verification code"
        description="Check your email for the verification code and enter it below to proceed"
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="xl:gap-8 gap-5 flex flex-col">
          <div className="flex justify-center items-center">
            <OTPInput
              length={4}
              value={formik.values.otp}
              onChange={value => formik.setFieldValue("otp", value)}
              error={formik.touched.otp && formik.errors.otp ? formik.errors.otp : null}
            />
          </div>

          <p className="text-center">
            Didn’t receive the code,
            <span className="text-custom-blue underline font-medium mx-1">Resend it</span>
            (20s)
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
