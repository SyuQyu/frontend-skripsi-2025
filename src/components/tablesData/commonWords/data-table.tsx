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
import useTagStore from "@/context/tags"
import { toLocalDateTime } from "@/lib/utils"
import useCommonWordStore from "@/context/commonWords"

export const schema = z.object({
  id: z.string(),
  word: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

function columns(
  setRowData: (data: z.infer<typeof schema>) => void,
  setIsDialogOpenEdit: (open: boolean) => void,
  setIsDialogOpenDelete: (open: boolean) => void,
): ColumnDef<z.infer<typeof schema>>[] {
  return [
    {
      accessorKey: "no",
      header: "No",
      cell: ({ row }) => <span className="text-center">{row.index + 1}</span>,
    },
    {
      accessorKey: "word",
      header: "Word",
      cell: ({ row }) => <span>{row.original.word}</span>,
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
            <span className="hidden lg:inline">Add Word</span>
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
  const { addCommonWord, editCommonWord, removeCommonWord } = useCommonWordStore()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      word: data?.word || "",
    },
    validationSchema: Yup.object({
      word: Yup.string().required("Word is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response: any
        if (forWhat === "create") {
          response = await addCommonWord(values)
        }
        else {
          response = await editCommonWord(data?.id, values)
        }

        if (response?.status === "success") {
          toast({
            icon: <Check className="size-6 text-green-600" />,
            title: `${forWhat === "create" ? "Create" : "Update"} Success.`,
            description: `Word successfully ${forWhat === "create" ? "created" : "updated"}.`,
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
      const response: any = await removeCommonWord(data?.id)
      if (response?.status === "success") {
        toast({
          icon: <Check className="size-6 text-green-600" />,
          title: "Delete Success.",
          description: "Word has been deleted.",
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
                      Are you sure you want to delete the word
                      {" "}
                      <b>{data?.word}</b>
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
                  <DialogHeader>
                    <DialogTitle>{forWhat === "create" ? "New Word" : "Edit Word"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className="w-full grid grid-cols-1 gap-4">
                      <Input
                        name="word"
                        label="Word"
                        value={formik.values.word}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.word && typeof formik.errors.word === "string"
                            ? formik.errors.word
                            : null
                        }
                        placeholder="Word"
                      />
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
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
