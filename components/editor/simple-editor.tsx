"use client"

import type React from "react"

import { useState } from "react"
import { Bold, Italic, List, LinkIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SimpleEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SimpleEditor({ value, onChange, placeholder = "Write something...", className }: SimpleEditorProps) {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    setSelection({
      start: target.selectionStart,
      end: target.selectionEnd,
    })
  }

  const applyFormat = (format: string) => {
    if (!selection) return

    let newText = value
    let newCursorPos = selection.end

    switch (format) {
      case "bold":
        newText =
          value.substring(0, selection.start) +
          `**${value.substring(selection.start, selection.end)}**` +
          value.substring(selection.end)
        newCursorPos = selection.end + 4
        break
      case "italic":
        newText =
          value.substring(0, selection.start) +
          `*${value.substring(selection.start, selection.end)}*` +
          value.substring(selection.end)
        newCursorPos = selection.end + 2
        break
      case "list":
        // Add a list item at the beginning of each line in the selection
        const selectedText = value.substring(selection.start, selection.end)
        const formattedText = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n")
        newText = value.substring(0, selection.start) + formattedText + value.substring(selection.end)
        newCursorPos = selection.start + formattedText.length
        break
      case "link":
        newText =
          value.substring(0, selection.start) +
          `[${value.substring(selection.start, selection.end)}](url)` +
          value.substring(selection.end)
        newCursorPos = selection.end + 6
        break
    }

    onChange(newText)

    // Reset selection after applying format
    setTimeout(() => {
      const textarea = document.getElementById("simple-editor") as HTMLTextAreaElement
      if (textarea) {
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      }
    }, 0)
  }

  return (
    <div className={`border rounded-md ${className}`}>
      <div className="flex items-center gap-1 border-b p-2 bg-muted/20">
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("bold")} className="h-8 w-8 p-0">
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("italic")} className="h-8 w-8 p-0">
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("list")} className="h-8 w-8 p-0">
          <List className="h-4 w-4" />
          <span className="sr-only">List</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => applyFormat("link")} className="h-8 w-8 p-0">
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Link</span>
        </Button>
      </div>
      <Textarea
        id="simple-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextareaSelect}
        placeholder={placeholder}
        className="min-h-[150px] border-0 focus-visible:ring-0 resize-none"
      />
      <div className="p-2 text-xs text-muted-foreground">Use #hashtags to categorize your post</div>
    </div>
  )
}

