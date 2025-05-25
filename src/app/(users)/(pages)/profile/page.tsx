"use client"
import { useCallback, useEffect, useState } from "react"
import { Check, Pencil, X } from "lucide-react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import debounce from "lodash.debounce"
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
  const { user, checkPassword, checkEmail, checkUsername } = useAuthStore()
  const { fetchPostByUser, posts } = usePostStore()
  const { editUser } = useUserStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null)

  // Debounced async check for username
  const debouncedCheckUsername = useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setUsernameError(null)
        return
      }
      const res = await checkUsername(username)
      if (user?.username === username) {
        setUsernameError(null)
        return
      }
      setUsernameError(!res.data?.available ? "Username is already taken" : null)
    }, 400),
    [user?.username],
  )

  // Debounced async check for email
  const debouncedCheckEmail = useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setEmailError(null)
        return
      }
      const res = await checkEmail(email)
      if (user?.email === email) {
        setEmailError(null)
        return
      }
      setEmailError(!res.data?.available ? "Email is already taken" : null)
    }, 400),
    [user?.email],
  )

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
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (usernameError || emailError) {
        setErrors({
          username: usernameError || undefined,
          email: emailError || undefined,
        })
        setSubmitting(false)
        return
      }
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

        const profileImageInput = document.querySelector("#profile-image-input") as HTMLInputElement | null
        const profilePictureFile: File | undefined = profileImageInput?.files ? profileImageInput.files[0] : undefined
        const backgroundImageInput = document.querySelector("#background-image-input") as HTMLInputElement | null
        const backgroundPictureFile: File | undefined = backgroundImageInput?.files ? backgroundImageInput.files[0] : undefined

        const response: any = await editUser(user?.id, updatedFields, profilePictureFile, backgroundPictureFile)
        if (response?.status === "success") {
          toast({
            icon: <Check className="size-6 text-green-600" />,
            title: "Update Success.",
            description: "You have successfully updated your profile.",
          })
          setIsDialogOpen(false)
          // router.push("/login")
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
    if (user) {
      formik.setValues({
        fullName: user.fullName || "",
        nim: user.nim || "",
        faculty: user.faculty || "",
        phone: user.phone || "",
        email: user.email || "",
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
        username: user.username || "",
      })
    }
  }, [user])

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

  const handleOpenDialog = () => {
    setIsDialogOpen(!isDialogOpen)
    if (isDialogOpen) {
      setProfilePreview(null)
      setBackgroundPreview(null)
      formik.resetForm()
    }
  }

  return (
    <div className="flex flex-row justify-center items-center">
      <Card
        description=""
        styleTitle="text-2xl text-center"
        styleCard="w-full flex flex-col gap-5 xl:!px-10 !px-5 !py-0 xl:!py-[24px] min-h-screen !rounded-none xl:max-w-[700px] xl:border-solid border-none"
        styleContent="!p-0 relative"
        styleDescription="text-base text-black text-center"
      >
        <div className="w-full flex flex-col items-center relative sm:mb-24 mb-14">
          <div className="relative w-full rounded-lg overflow-hidden md:max-h-[200px] max-h-[150px]">
            <ImageWithFallback
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-full object-cover"
              priority={false}
              src={user?.backgroundPictureUrl || "/images/bg-img.jpg"}
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
              <Dialog open={isDialogOpen} onOpenChange={() => handleOpenDialog()}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-full bg-white/90 hover:bg-white transition">
                    <Pencil className="w-5 h-5 text-black" />
                  </button>
                </DialogTrigger>
                <DialogContent className="md:min-w-[700px] lg:min-w-[1200px] w-full p-6 rounded-lg bg-white dark:bg-slate-900 shadow-lg overflow-hidden">
                  <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Update Profile
                    </DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={formik.handleSubmit}
                    className="mt-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6 "
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-6">
                        {(profilePreview || user?.profilePictureUrl) && (
                          <div className="mb-2 flex items-center justify-center">
                            <ImageWithFallback
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="max-w-xs w-32 max-h-32"
                              priority={false}
                              src={profilePreview || user?.profilePictureUrl}
                              alt="Profile Picture"
                            />
                          </div>
                        )}

                        <Input
                          id="profile-image-input"
                          name="profilePicture"
                          label="Profile Picture (optional)"
                          type="file"
                          isFileInput={true}
                          onChange={(e) => {
                            const target = e.currentTarget as HTMLInputElement
                            if (target.files && target.files.length > 0) {
                              const file = target.files[0]
                              formik.setFieldValue("profilePicture", file)

                              // Update preview state
                              setProfilePreview(URL.createObjectURL(file))
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />
                        {(user?.backgroundPictureUrl || backgroundPreview) && (
                          <div className="mb-2 flex items-center justify-center">
                            <ImageWithFallback
                              width={0}
                              height={0}
                              sizes="100vw"
                              className="max-w-xs w-32 max-h-32"
                              priority={false}
                              src={backgroundPreview || user?.backgroundPictureUrl}
                              alt="Profile Picture"
                            />
                          </div>
                        )}

                        <Input
                          id="background-image-input"
                          name="backgroundPicture"
                          label="Background Picture (optional)"
                          type="file"
                          isFileInput={true}
                          onChange={(e) => {
                            const target = e.currentTarget as HTMLInputElement
                            if (target.files && target.files.length > 0) {
                              const file = target.files[0]
                              formik.setFieldValue("backgroundPicture", file)

                              // Update preview state
                              setBackgroundPreview(URL.createObjectURL(file))
                            }
                          }}
                          onBlur={formik.handleBlur}
                        />

                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Fields */}
                        <Input
                          className=""
                          name="fullName"
                          label="Full Name"
                          value={formik.values.fullName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.fullName && typeof formik.errors.fullName === "string" ? formik.errors.fullName : null}
                          placeholder="Full Name"
                          autoFocus
                        />
                        <Input
                          name="email"
                          label="Email"
                          value={formik.values.email}
                          onChange={(e) => {
                            formik.handleChange(e)
                            debouncedCheckEmail(e.target.value)
                          }}
                          onBlur={formik.handleBlur}
                          error={emailError || (formik.touched.email && typeof formik.errors.email === "string" ? formik.errors.email : null)}
                          placeholder="Email"
                        />
                        <Input
                          name="oldPassword"
                          label="Old Password"
                          type="password"
                          value={formik.values.oldPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.oldPassword && typeof formik.errors.oldPassword === "string" ? formik.errors.oldPassword : null}
                          placeholder="Old Password"
                          autoComplete="current-password"
                        />
                        <Input
                          name="newPassword"
                          label="New Password"
                          type="password"
                          value={formik.values.newPassword}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.newPassword && typeof formik.errors.newPassword === "string" ? formik.errors.newPassword : null}
                          placeholder="New Password"
                          autoComplete="new-password"
                        />
                        <Input
                          name="newPasswordConfirmation"
                          label="Confirm New Password"
                          type="password"
                          value={formik.values.newPasswordConfirmation}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.newPasswordConfirmation && typeof formik.errors.newPasswordConfirmation === "string" ? formik.errors.newPasswordConfirmation : null}
                          placeholder="Confirm New Password"
                          autoComplete="new-password"
                        />
                        <Input
                          name="username"
                          label="Username"
                          value={formik.values.username}
                          onChange={(e) => {
                            formik.handleChange(e)
                            debouncedCheckUsername(e.target.value)
                          }}
                          onBlur={formik.handleBlur}
                          error={usernameError || (formik.touched.username && typeof formik.errors.username === "string" ? formik.errors.username : null)}
                          placeholder="Username"
                        />
                        {/* <Input
                          name="nim"
                          label="NIM (optional)"
                          value={formik.values.nim}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.nim && typeof formik.errors.nim === "string" ? formik.errors.nim : null}
                          placeholder="NIM"
                        />
                        <Input
                          name="faculty"
                          label="Faculty (optional)"
                          value={formik.values.faculty}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.faculty && typeof formik.errors.faculty === "string" ? formik.errors.faculty : null}
                          placeholder="Faculty"
                        /> */}
                        <Input
                          name="phone"
                          label="Phone Number (optional)"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.phone && typeof formik.errors.phone === "string" ? formik.errors.phone : null}
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-6 sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        className="bg-blue-600 text-white py-2 px-6 rounded-md"
                        type="submit"
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
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
            src={user?.profilePictureUrl || "/images/person.jpg"}
            alt="Profile Picture"
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
