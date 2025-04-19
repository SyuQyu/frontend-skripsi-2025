import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  type: "create" | "update" | "delete"
}

const dialogConfig = {
  create: {
    title: "Confirm Creation",
    message: "Are you sure you want to create this item?",
    confirmLabel: "Yes, Create",
    confirmClass: "bg-green-500 text-white",
  },
  update: {
    title: "Confirm Changes",
    message: "Are you sure you want to save these changes?",
    confirmLabel: "Yes, Save",
    confirmClass: "bg-blue-500 text-white",
  },
  delete: {
    title: "Confirm Deletion",
    message: "Are you sure you want to delete this item? This action cannot be undone.",
    confirmLabel: "Yes, Delete",
    confirmClass: "bg-red-500 text-white",
  },
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  type,
}: ConfirmDialogProps) {
  const { title, message, confirmLabel, confirmClass } = dialogConfig[type]

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{message}</p>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
