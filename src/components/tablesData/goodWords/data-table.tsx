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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
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
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreVerticalIcon,
  Pencil,
  PlusIcon,
  Trash2,
  X,
} from "lucide-react"
import { z } from "zod"

import { useFormik } from "formik"
import * as Yup from "yup"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toLocalDateTime } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import useGoodWordStore from "@/context/goodWords"
import useBadWordStore from "@/context/badWords"

export const schema = z.object({
  id: z.string(),
  word: z.string(),
  badWordId: z.string(),
  badWord: z.object({
    id: z.string(),
    word: z.string(),
  }),
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
      accessorKey: "badWord.word",
      header: "Bad Word",
      cell: ({ row }) => <span>{row.original.badWord.word}</span>,
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
  badWords,
}: {
  data: z.infer<typeof schema>[]
  badWords: any
}) {
  const [data, setData] = React.useState(initialData)
  const [isDialogOpenCreate, setIsDialogOpenCreate] = React.useState(false)
  const [isDialogOpenEdit, setIsDialogOpenEdit] = React.useState(false)
  const [isDialogOpenDelete, setIsDialogOpenDelete] = React.useState(false)
  const [rowData, setRowData] = React.useState<any>(null)
  const [isBulkDialogOpen, setIsBulkDialogOpen] = React.useState(false)
  const { bulkCreateGoodWordsFromFile, fetchAllGoodWords } = useGoodWordStore()
  const [file, setFile] = React.useState<File | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
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

  const handleBulkUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please choose a file to upload.",
        variant: "destructive",
      })
      return
    }
    setIsUploading(true)
    try {
      const res: any = await bulkCreateGoodWordsFromFile(file)
      if (res?.status === "success") {
        toast({
          title: "Upload success",
          description: res.message || "Good words uploaded successfully.",
        })
        setIsBulkDialogOpen(false)
        setFile(null)
        await fetchAllGoodWords() // refresh data
      }
      else {
        toast({
          title: "Upload failed",
          description: res?.message || "Error uploading file.",
          variant: "destructive",
        })
      }
    }
    catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Error uploading file.",
        variant: "destructive",
      })
    }
    finally {
      setIsUploading(false)
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
            <span className="hidden lg:inline">Add Good Words</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsBulkDialogOpen(true)}
          >
            <PlusIcon />
            <span className="hidden lg:inline">Bulk Upload</span>
          </Button>

          <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Bulk Upload Good Words</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-4">
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0])
                    }
                    else {
                      setFile(null)
                    }
                  }}
                />
                {file && (
                  <p>
                    Selected file:
                    {file.name}
                  </p>
                )}
                <Button
                  onClick={handleBulkUpload}
                  disabled={isUploading || !file}
                  className="w-full"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setIsBulkDialogOpen(false)
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <PopUpDialog
            isDialogOpen={isDialogOpenCreate}
            setIsDialogOpen={setIsDialogOpenCreate}
            badWords={badWords}
            forWhat="create"
          />
          <PopUpDialog
            data={rowData}
            isDialogOpen={isDialogOpenEdit}
            setIsDialogOpen={setIsDialogOpenEdit}
            badWords={badWords}
            forWhat="edit"
          />
          <PopUpDialog
            data={rowData}
            isDialogOpen={isDialogOpenDelete}
            setIsDialogOpen={setIsDialogOpenDelete}
            badWords={badWords}
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

function PopUpDialog({ data, isDialogOpen, setIsDialogOpen, forWhat, badWords }: any) {
  const { addGoodWord, editGoodWord, removeGoodWord } = useGoodWordStore()
  const { addBadWord, editBadWord, removeBadWord } = useBadWordStore()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [newBadWord, setNewBadWord] = React.useState("")
  const [isNewBadWordInputVisible, setIsNewBadWordInputVisible] = React.useState(false)
  const [editingBadWordId, setEditingBadWordId] = React.useState<string | null>(null)
  const [editingBadWordText, setEditingBadWordText] = React.useState("")

  const badWordsLookup = badWords.map((badWord: any) => ({
    label: badWord.word,
    value: badWord.id,
  }))

  const getBadWordLabel = (id: string) => {
    const found = badWordsLookup.find((bw: { value: string }) => bw.value === id)
    return found ? found.label : ""
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      word: data?.word || "",
      badWordId: data?.badWordId || "",
    },
    validationSchema: Yup.object({
      word: Yup.string().required("Word is required"),
      badWordId: Yup.string().required("Bad Word ID is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response: any
        if (forWhat === "create") {
          response = await addGoodWord(values)
        }
        else {
          response = await editGoodWord(data?.id, values)
        }

        if (response?.status === "success") {
          toast({
            icon: <Check className="size-6 text-green-600" />,
            title: `${forWhat === "create" ? "Create" : "Update"} Success.`,
            description: `Good word successfully ${forWhat === "create" ? "created" : "updated"}.`,
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
      const response: any = await removeGoodWord(data?.id)
      if (response?.status === "success") {
        toast({
          icon: <Check className="size-6 text-green-600" />,
          title: "Delete Success.",
          description: "Good word has been deleted.",
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

  const handleAddBadWord = async () => {
    if (newBadWord.trim() === "")
      return

    try {
      const response: any = await addBadWord({ word: newBadWord })
      if (response?.status === "success") {
        toast({
          icon: <Check className="size-6 text-green-600" />,
          title: "Bad Word Added.",
          description: "The new bad word has been added.",
        })
        badWords.push({ word: newBadWord, id: response.badWord.id })
        setNewBadWord("")
        setIsNewBadWordInputVisible(false)
        formik.setFieldValue("badWordId", response.badWord.id)
      }
      else {
        toast({
          icon: <X className="size-6" />,
          title: "Add Failed.",
          description: response?.message?.detail || "Unknown error.",
        })
      }
    }
    catch (error) {
      toast({
        icon: <X className="size-6" />,
        title: "Add Failed.",
        description: error instanceof Error ? error.message : "Unexpected error occurred.",
      })
    }
  }

  const handleEditBadWord = async (id: string) => {
    const response: any = await editBadWord(id, { word: editingBadWordText })
    if (response?.status === "success") {
      toast({
        icon: <Check className="size-5 text-green-600" />,
        title: "Update Success",
        description: "Bad word updated successfully.",
      })
      setEditingBadWordId(null)
      setEditingBadWordText("")
    }
    else {
      toast({
        icon: <X className="size-6" />,
        title: "Edit Failed.",
        description: response?.message?.detail || "Unknown error.",
      })
    }
  }

  const handleDeleteBadWord = async (id: string) => {
    const response: any = await removeBadWord(id)
    if (response?.status === "success") {
      toast({
        icon: <Check className="size-5 text-green-600" />,
        title: "Deleted",
        description: "Bad word has been deleted.",
      })
    }
    else {
      toast({
        icon: <X className="size-6" />,
        title: "Delete Failed.",
        description: response?.message?.detail || "Unknown error.",
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
                      Are you sure you want to delete the good word
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
                    <DialogTitle>
                      {forWhat === "create" ? "New Good Word" : "Edit Good Word"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={formik.handleSubmit} className="w-full">
                    <div className="w-full grid grid-cols-1 gap-4">
                      <Input
                        name="word"
                        label="Word"
                        value={formik.values.word}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.word && typeof formik.errors.word === "string" ? formik.errors.word : null}
                        placeholder="Word"
                      />
                      <Input
                        name="badWordId"
                        label="Bad Word"
                        value={getBadWordLabel(formik.values.badWordId)}
                        onClick={() => setOpen(true)}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.badWordId && typeof formik.errors.badWordId === "string"
                            ? formik.errors.badWordId
                            : null
                        }
                        placeholder="Bad Word"
                        readOnly
                      />

                      {open && !isNewBadWordInputVisible && (
                        <Command>
                          <CommandInput placeholder="Search bad word..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No bad word found.</CommandEmpty>
                            <CommandGroup>
                              {badWordsLookup.map((item: any) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={() => {
                                    if (editingBadWordId === item.value)
                                      return
                                    formik.setFieldValue("badWordId", item.value)
                                    setOpen(false)
                                  }}
                                  className="flex flex-col"
                                >
                                  {editingBadWordId === item.value
                                    ? (
                                        <>
                                          <Input
                                            value={editingBadWordText}
                                            onChange={e => setEditingBadWordText(e.target.value)}
                                            placeholder="Edit bad word"
                                            className="h-8"
                                          />
                                          <div className="flex gap-2 mt-1">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleEditBadWord(item.value)}
                                            >
                                              Save
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setEditingBadWordId(null)
                                                setEditingBadWordText("")
                                              }}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </>
                                      )
                                    : (
                                        <div className="flex items-center justify-between w-full">
                                          <span>{item.label}</span>
                                          <div className="flex gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setEditingBadWordId(item.value)
                                                setEditingBadWordText(item.label)
                                              }}
                                            >
                                              <Pencil />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                handleDeleteBadWord(item.value)
                                              }}
                                            >
                                              <Trash2 />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      )}

                      {isNewBadWordInputVisible && (
                        <div className="mt-4">
                          <Input
                            name="newBadWord"
                            label="New Bad Word"
                            value={newBadWord}
                            onChange={e => setNewBadWord(e.target.value)}
                            placeholder="Enter new bad word"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" onClick={handleAddBadWord} className="bg-blue-500 text-white">
                              Add Bad Word
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsNewBadWordInputVisible(false)}
                              className="bg-red-500 text-white"
                            >
                              Cancel Add Bad Word
                            </Button>
                          </div>
                        </div>
                      )}
                      {!isNewBadWordInputVisible && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsNewBadWordInputVisible(true)
                            formik.setFieldValue("badWordId", "")
                          }}
                          className="bg-blue-500 text-white"
                        >
                          Add New Entries Bad Word
                        </Button>
                      )}
                    </div>

                    <DialogFooter className="mt-4">
                      <Button type="submit" className="bg-blue-500 text-white" disabled={formik.isSubmitting}>
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
