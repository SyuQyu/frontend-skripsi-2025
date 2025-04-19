"use client"
import { useEffect, useState } from "react"
import { Check, Pencil, X } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { Button, Card, ImageWithFallback, Input, PostCard } from "@/components/common"
import useAuthStore from "@/context/auth"
import usePostStore from "@/context/post"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import useUserStore from "@/context/users"
import { toast } from "@/components/ui/use-toast"

export default function Profile() {
  const { user, checkPassword } = useAuthStore()
  const { fetchPostByUser, posts } = usePostStore()
  const { editUser } = useUserStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      fullName: user?.fullName || "",
      nim: user?.nim || "",
      faculty: user?.faculty || "",
      phone: user?.phone || "",
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirmation: "",
      username: user?.username || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().nullable(),
      nim: Yup.string().nullable(),
      faculty: Yup.string().nullable(),
      phone: Yup.string().nullable(),
      email: Yup.string().email("Invalid email format").nullable(),
      oldPassword: Yup.string().nullable(),
      newPassword: Yup.string().nullable(),
      newPasswordConfirmation: Yup.string()
        .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
        .nullable(),
      username: Yup.string().nullable(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const updatedFields = Object.entries(values).reduce((acc: any, [key, value]) => {
          if (key === "newPassword" && values.oldPassword && values.newPassword) {
            acc.password = value
          }
          else if (
            key !== "oldPassword"
            && key !== "newPassword"
            && key !== "newPasswordConfirmation"
            && value !== formik.initialValues[key as keyof typeof formik.initialValues]
          ) {
            acc[key] = value
          }
          return acc
        }, {})

        if (Object.keys(updatedFields).length === 0) {
          toast({
            icon: <X className="size-6" />,
            title: "No changes.",
            description: "You haven't updated any fields.",
          })
          setSubmitting(false)
          return
        }

        const response: any = await editUser(user?.id, updatedFields)
        if (response?.status === "success") {
          toast({
            icon: <Check className="size-6 text-green-600" />,
            title: "Update Success, Logging out.",
            description: "You have successfully updated your profile.",
          })
          setIsDialogOpen(false)
          router.push("/login")
        }
        else {
          toast({
            icon: <X className="size-6" />,
            title: "Update failed.",
            description: response?.message?.detail || "Unknown error.",
          })
        }
      }
      catch (error) {
        toast({
          icon: <X className="size-6" />,
          title: "Update failed.",
          description: error instanceof Error ? error.message : "Unexpected error occurred.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      await fetchPostByUser(user?.id)
    }
    fetchData()
  }, [fetchPostByUser, user?.id])

  useEffect(() => {
    if (formik.values.oldPassword) {
      const timeout = setTimeout(() => {
        checkPassword(user?.id, formik.values.oldPassword).then((res: any) => {
          if (res.status === "success") {
            formik.setFieldError("oldPassword", "")
          }
          else {
            formik.setFieldError("oldPassword", "Incorrect password")
          }
        }).catch(() => {
          formik.setFieldError("oldPassword", "Error validating password")
        })
      }, 500) // debounce 500ms

      return () => clearTimeout(timeout)
    }
  }, [formik.values.oldPassword])

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        description=""
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0 relative"
        styleDescription="text-base text-black text-center"
      >
        <div className="w-full flex flex-col items-center relative mb-24">
          <div className="relative w-full rounded-lg overflow-hidden md:max-h-[200px] max-h-[150px]">
            <ImageWithFallback
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
              priority={false}
              src="/images/bg-img.jpg"
              alt="logo"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

            {/* Post count */}
            <div className="absolute bottom-2 left-4 z-[2]">
              <p className="text-white text-sm md:text-base font-medium">
                {posts?.length}
                {" "}
                Posts
              </p>
            </div>

            {/* Username */}
            <div className="absolute bottom-2 right-4 z-[2]">
              <p className="text-white text-sm md:text-base font-semibold">
                @
                {user?.username}
              </p>
            </div>

            {/* Edit icon (top-right corner) */}
            <div className="absolute top-4 right-4 z-[2]">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-full bg-white/90 hover:bg-white transition">
                    <Pencil className="w-5 h-5 text-black" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Perbarui Data</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <form onSubmit={formik.handleSubmit} className="w-full">
                      <div className="w-full grid grid-cols-2 gap-4">
                        <Input
                          className="w-full"
                          name="fullName"
                          label="Full Name"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.fullName && typeof formik.errors.fullName === "string" ? formik.errors.fullName : null}
                          placeholder="Full Name"
                        />

                        <Input
                          className="w-full"
                          label="Email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.email && typeof formik.errors.email === "string" ? formik.errors.email : null}
                          placeholder="Email"
                        />
                        <Input
                          className="w-full"
                          name="oldPassword"
                          label="Old Password"
                          type="password"
                          value={formik.values.oldPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.oldPassword && typeof formik.errors.oldPassword === "string" ? formik.errors.oldPassword : null}
                          placeholder="Old Password"
                        />
                        <Input
                          className="w-full"
                          name="newPassword"
                          type="password"
                          label="New Password"
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.newPassword && typeof formik.errors.newPassword === "string" ? formik.errors.newPassword : null}
                          placeholder="New Password"
                        />
                        <Input
                          className="w-full"
                          name="newPasswordConfirmation"
                          label="Confirm New Password"
                          type="password"
                          value={formik.values.newPasswordConfirmation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.newPasswordConfirmation && typeof formik.errors.newPasswordConfirmation === "string" ? formik.errors.newPasswordConfirmation : null}
                          placeholder="Confirm New Password"
                        />

                        <Input
                          className="w-full"
                          name="username"
                          label="Username"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.username && typeof formik.errors.username === "string" ? formik.errors.username : null}
                          placeholder="Username"
                        />

                        <Input
                          className="w-full"
                          name="nim"
                          label="NIM (optional)"
                          value={formik.values.nim}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.nim && typeof formik.errors.nim === "string" ? formik.errors.nim : null}
                          placeholder="NIM"
                        />

                        <Input
                          className="w-full"
                          label="Faculty (optional)"
                          name="faculty"
                          value={formik.values.faculty}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.faculty && typeof formik.errors.faculty === "string" ? formik.errors.faculty : null}
                          placeholder="Faculty"
                        />

                        <Input
                          className="w-full"
                          name="phone"
                          label="Phone Number (optional)"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.phone && typeof formik.errors.phone === "string" ? formik.errors.phone : null}
                          placeholder="Phone Number"
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          className="bg-blue-500 text-white py-2 px-4 rounded-md"
                          type="submit"
                          disabled={formik.isSubmitting}
                        >
                          {formik.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ImageWithFallback
            width={0}
            height={0}
            sizes="100vw"
            className="md:size-[100px] z-[2] size-[80px] object-cover border rounded-full absolute -bottom-10 left-1/2 -translate-x-1/2"
            priority={false}
            src="/images/person.jpg"
            alt="logo"
          />
        </div>

        <div className="w-full flex flex-col mb-10">
          {
            posts.length > 0
              ? posts.map((post, idx) => (
                  <PostCard key={idx} post={post} profile={true} />
                ))
              : (
                  <p className="text-center text-gray-500">No posts available</p>
                )
          }
        </div>
      </Card>
    </div>
  )
}
