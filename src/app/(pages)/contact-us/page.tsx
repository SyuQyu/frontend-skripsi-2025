"use client"
import React from "react"
import { useFormik } from "formik"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import useContactUsStep from "@/context/contactUsStep"
import { Button, Card, Input, TextArea } from "@/components/common"

interface FormValues {
  first_name: string
  email: string
  subject: string
  message: string
}

function validate(values: FormValues) {
  const errors: Partial<FormValues> = {}
  if (!values.first_name) {
    errors.first_name = "Required"
  }
  if (!values.email) {
    errors.email = "Required"
  }
  else if (!/^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Invalid email address"
  }
  if (!values.subject) {
    errors.subject = "Required"
  }
  if (!values.message) {
    errors.message = "Required"
  }
  return errors
}

export default function Contact() {
  const router = useRouter()
  const { completeStep } = useContactUsStep()
  const formik = useFormik({
    initialValues: {
      first_name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      completeStep("step2")
      setTimeout(() => {
        router.push("/contact-us/success")
        setSubmitting(false)
      }, 400)
    },
  })

  const isFormValid
    = Object.values(formik.values).every(value => value !== "")
    && Object.keys(formik.errors).length === 0

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        title="Contact Support"
        description=""
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-5"
        styleDescription="text-base text-black text-center"
      >
        <form onSubmit={formik.handleSubmit} className="gap-5  flex flex-col w-full">
          <Input
            label="First name"
            type="text"
            name="first_name"
            placeholder="Add your first name here..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.first_name}
            error={formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : null}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Add your email address here..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          />
          <Input
            label="Subject"
            type="text"
            name="subject"
            placeholder="Add your subject here..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.subject}
            error={formik.touched.subject && formik.errors.subject ? formik.errors.subject : null}
          />
          <TextArea
            label="Message"
            name="message"
            placeholder="Add your message here..."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
            error={formik.touched.message && formik.errors.message ? formik.errors.message : null}
          />
          <Button
            type="submit"
            className={clsx("w-full", isFormValid ? "bg-custom-blue hover:text-white" : "bg-[#A5B4C7]", "text-white hover:bg-[#043ede] rounded-[10px] h-[55px] font-bold")}
            size="lg"
            disabled={!isFormValid || formik.isSubmitting}
          >
            Send
          </Button>
        </form>
      </Card>
    </div>
  )
}
