"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Edit, FileText, Lock, MoreHorizontal, Share2, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface HealthJournalProps {
  entries: { id: number; title: string; date: Date; isPrivate: boolean; mood: string; content: string }[]
  onEdit: (entry: { id: number; title: string; date: Date; isPrivate: boolean; mood: string; content: string }) => void
}

export function HealthJournal({ entries, onEdit }: HealthJournalProps) {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [entryToShare, setEntryToShare] = useState<number | null>(null)

  const handleDeleteClick = (id: number) => {
    setEntryToDelete(id)
    setShowDeleteDialog(true)
  }

  const handleShareClick = (id: number) => {
    const entry = entries.find((e) => e.id === id)
    if (entry && entry.isPrivate) {
      toast({
        variant: "destructive",
        title: "Cannot share private entry",
        description: "This journal entry is marked as private and cannot be shared.",
      })
      return
    }

    setEntryToShare(id)
    setShowShareDialog(true)
  }

  const handleConfirmDelete = () => {
    // In a real app, this would delete the entry from the database
    // For now, we'll just log it or show it in the toast
    toast({
      title: "Journal entry deleted",
      description: `Journal entry with ID ${entryToDelete} has been deleted successfully.`,
    })

    setShowDeleteDialog(false)
    setEntryToDelete(null)
  }

  const handleConfirmShare = () => {
    // In a real app, this would share the entry
    toast({
      title: "Journal entry shared",
      description: `Journal entry with ID ${entryToShare} has been shared with your healthcare provider.`,
    })

    setShowShareDialog(false)
    setEntryToShare(null)
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "Positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>{entry.title}</CardTitle>
                  {entry.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(entry)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareClick(entry.id)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share with Doctor
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(entry.id)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="flex items-center justify-between">
                <span>{format(entry.date, "MMMM d, yyyy")}</span>
                <Badge className={cn("text-xs", getMoodColor(entry.mood))}>{entry.mood}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className={cn("text-sm text-muted-foreground", expandedEntry === entry.id ? "" : "line-clamp-3")}>
                {entry.content}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <FileText className="mr-1 h-3 w-3" />
                {entry.content.length} characters
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
              >
                {expandedEntry === entry.id ? "Show Less" : "Read More"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Journal Entry</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Confirmation Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Journal Entry</DialogTitle>
            <DialogDescription>
              Share this journal entry with your healthcare provider. This will help them better understand your health
              journey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmShare}>Share with Healthcare Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

