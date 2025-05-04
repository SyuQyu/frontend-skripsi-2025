"use client"

import * as React from "react"
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  type UniqueIdentifier,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Check,
  CheckCircle2Icon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  GripVerticalIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PlusIcon,
  TrendingUpIcon,
  X,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { z } from "zod"

import { useFormik } from "formik"
import * as Yup from "yup"
import debounce from "lodash.debounce"
import { toast } from "@/components/ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog, Input } from "@/components/common"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useUserStore from "@/context/users"
import { toLocalDateTime } from "@/lib/utils"
import useAuthStore from "@/context/auth"

export const schema = z.object({
  id: z.string(),
  roleId: z.string(),
  fullName: z.string().nullable(),
  username: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string().nullable(),
  nim: z.string().nullable(),
  faculty: z.string().nullable(),
  gender: z.string().nullable(),
  firstLogin: z.boolean(),
  profilePicture: z.string().nullable(),
  refreshToken: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

function columns(setRowData: (data: z.infer<typeof schema>) => void, setIsDialogOpenEdit: (open: boolean) => void, setIsDialogOpenDelete: (open: boolean) => void): ColumnDef<z.infer<typeof schema>>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => (
        <span className="text-center">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => <span>{row.original.username}</span>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => <span>{row.original.fullName ?? "-"}</span>,
    },
    {
      accessorKey: "nim",
      header: "NIM",
      cell: ({ row }) => <span>{row.original.nim ?? "-"}</span>,
    },
    {
      accessorKey: "faculty",
      header: "Faculty",
      cell: ({ row }) => <span>{row.original.faculty ?? "-"}</span>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => <span>{row.original.gender ?? "-"}</span>,
    },
    {
      accessorKey: "firstLogin",
      header: "First Login",
      cell: ({ row }) => (
        <span className={row.original.firstLogin ? "text-green-600" : "text-red-500"}>
          {row.original.firstLogin ? "Yes" : "No"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => <span>{toLocalDateTime(new Date(row.original.createdAt).toLocaleString())}</span>,
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => <span>{toLocalDateTime(new Date(row.original.updatedAt).toLocaleString())}</span>,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex size-8 text-slate-500 data-[state=open]:bg-slate-100 dark:text-slate-400 dark:data-[state=open]:bg-slate-800"
              size="icon"
            >
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                setRowData(row.original)
                setIsDialogOpenEdit(true)
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => {
                setRowData(row.original)
                setIsDialogOpenDelete(true)
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      className="relative z-0"
    >
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {
  const [data, setData] = React.useState(initialData)
  const [isDialogOpenCreate, setIsDialogOpenCreate] = React.useState(false)
  const [isDialogOpenEdit, setIsDialogOpenEdit] = React.useState(false)
  const [isDialogOpenDelete, setIsDialogOpenDelete] = React.useState(false)
  const [rowData, setRowData] = React.useState<any>(null)
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility]
    = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  )
  const cols = columns(setRowData, setIsDialogOpenEdit, setIsDialogOpenDelete)

  const table = useReactTable({
    data,
    columns: cols,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: row => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="flex w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Input
          className="!w-1/2 justify-center !block"
          name="content"
          placeholder="Find data..."
          onChange={(e) => {
            const value = e.target.value.toLowerCase()
            table.setGlobalFilter(value)
          }}
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  column =>
                    typeof column.accessorFn !== "undefined"
                    && column.getCanHide(),
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" onClick={() => setIsDialogOpenCreate(true)}>
            <PlusIcon />
            <span className="hidden lg:inline">Add Users</span>
          </Button>
          <PopUpDialog
            isDialogOpen={isDialogOpenCreate}
            setIsDialogOpen={setIsDialogOpenCreate}
            forWhat="create"
          />
          <PopUpDialog
            data={rowData}
            isDialogOpen={isDialogOpenEdit}
            setIsDialogOpen={setIsDialogOpenEdit}
            forWhat="edit"
          />
          <PopUpDialog
            data={rowData}
            isDialogOpen={isDialogOpenDelete}
            setIsDialogOpen={setIsDialogOpenDelete}
            forWhat="delete"
          />
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-blue-500 hover:!bg-blue-600">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan} className="text-white">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length
                  ? (
                      <SortableContext
                        items={dataIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {table.getRowModel().rows.map(row => (
                          <DraggableRow key={row.id} row={row} />
                        ))}
                      </SortableContext>
                    )
                  : (
                      <TableRow>
                        <TableCell
                          colSpan={cols.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="hidden flex-1 text-sm text-slate-500 lg:flex dark:text-slate-400">
            {table.getFilteredSelectedRowModel().rows.length}
            {" "}
            of
            {" "}
            {table.getFilteredRowModel().rows.length}
            {" "}
            row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page
              {" "}
              {table.getState().pagination.pageIndex + 1}
              {" "}
              of
              {" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-slate-200 border-dashed dark:border-slate-800"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-slate-200 border-dashed dark:border-slate-800"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-slate-200 border-dashed dark:border-slate-800"></div>
      </TabsContent>
    </Tabs>
  )
}

function PopUpDialog({ data, isDialogOpen, setIsDialogOpen, forWhat }: any) {
  const { editUser, addUser, removeUser } = useUserStore()
  const { checkUsername, checkEmail } = useAuthStore()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)
  const [usernameError, setUsernameError] = React.useState<string | null>(null)
  const [emailError, setEmailError] = React.useState<string | null>(null)

  // Debounced async check for username
  const debouncedCheckUsername = React.useCallback(
    debounce(async (username: string) => {
      if (!username) {
        setUsernameError(null)
        return
      }
      const res = await checkUsername(username)
      if (data?.username === username) {
        setUsernameError(null)
        return
      }
      setUsernameError(!res.data?.available ? "Username is already taken" : null)
    }, 400),
    [],
  )

  // Debounced async check for email
  const debouncedCheckEmail = React.useCallback(
    debounce(async (email: string) => {
      if (!email) {
        setEmailError(null)
        return
      }
      const res = await checkEmail(email)
      if (data?.email === email) {
        setEmailError(null)
        return
      }
      setEmailError(!res.data?.available ? "Email is already taken" : null)
    }, 400),
    [],
  )

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: data?.fullName || "",
      nim: data?.nim || "",
      faculty: data?.faculty || "",
      phone: data?.phone || "",
      email: data?.email || "",
      newPassword: "",
      newPasswordConfirmation: "",
      username: data?.username || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().nullable(),
      nim: Yup.string().nullable(),
      faculty: Yup.string().nullable(),
      phone: Yup.string().nullable(),
      email: Yup.string().email("Invalid email format").nullable(),
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
          if (key === "newPassword" && value) {
            acc.password = value
          }
          else if (
            key !== "newPassword"
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

        let response: any
        if (forWhat === "create") {
          response = await addUser(updatedFields)
        }
        else {
          response = await editUser(data?.id, updatedFields)
        }

        if (response?.status === "success") {
          toast({
            icon: <Check className="size-6 text-green-600" />,
            title: `${forWhat === "create" ? "Create" : "Update"} Success.`,
            description: `User successfully ${forWhat === "create" ? "created" : "updated"}.`,
          })
          setIsDialogOpen(false)
        }
        else {
          toast({
            icon: <X className="size-6" />,
            title: `${forWhat === "create" ? "Create" : "Update"} Failed.`,
            description: response?.message?.detail || "Unknown error.",
          })
        }
      }
      catch (error) {
        toast({
          icon: <X className="size-6" />,
          title: `${forWhat === "create" ? "Create" : "Update"} Failed.`,
          description: error instanceof Error ? error.message : "Unexpected error occurred.",
        })
      }
      finally {
        setSubmitting(false)
      }
    },
  })

  const handleDelete = async () => {
    try {
      const response: any = await removeUser(data?.id)
      if (response?.status === "success") {
        toast({
          icon: <Check className="size-6 text-green-600" />,
          title: "Delete Success.",
          description: "User has been deleted.",
        })
        setIsDialogOpen(false)
      }
      else {
        toast({
          icon: <X className="size-6" />,
          title: "Delete Failed.",
          description: response?.message?.detail || "Unknown error.",
        })
      }
    }
    catch (error) {
      toast({
        icon: <X className="size-6" />,
        title: "Delete Failed.",
        description: error instanceof Error ? error.message : "Unexpected error occurred.",
      })
    }
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {forWhat === "delete"
            ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <p>
                      Are you sure you want to delete user
                      {" "}
                      <b>{data?.fullName}</b>
                      ?
                    </p>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="destructive" onClick={handleDelete}>
                      Yes, Delete
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </>
              )
            : (
                <>
                  <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {forWhat === "create" ? "New User" : "Edit User"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={formik.handleSubmit} className="mt-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
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
                        name="newPasswordConfirmation"
                        type="password"
                        label="Confirm New Password"
                        value={formik.values.newPasswordConfirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.newPasswordConfirmation && typeof formik.errors.newPasswordConfirmation === "string" ? formik.errors.newPasswordConfirmation : null}
                        placeholder="Confirm New Password"
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
                      <Input
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
                      />
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

                    <DialogFooter className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-slate-900">
                      <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-colors duration-200"
                        onClick={() => setIsConfirmDialogOpen(true)}
                        disabled={formik.isSubmitting}
                      >
                        {formik.isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </>
              )}
        </DialogContent>
      </Dialog>

      {forWhat !== "delete" && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          type={forWhat === "create" ? "create" : "update"}
          onConfirm={() => {
            setIsConfirmDialogOpen(false)
            formik.handleSubmit()
          }}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
      )}
    </>
  )
}
