"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Import styles for react-quill
import "react-quill/dist/quill.snow.css"

// Dynamically import ReactQuill with SSR disabled
/**
 * Dynamically imports the ReactQuill component and wraps it to forward refs.
 * 
 * @component
 * @name QuillWrapper
 * @description A wrapper component for ReactQuill that forwards refs.
 * 
 * @ts-expect-error Necessary to suppress TypeScript error for ref forwarding.
 */
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    // @ts-expect-error: TypeScript does not recognize the forwardedRef prop
    const QuillWrapper = ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />
    QuillWrapper.displayName = "QuillWrapper"
    return QuillWrapper
  },
  { ssr: false },
)

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function QuillEditor({ value, onChange, placeholder = "Write something..." }: QuillEditorProps) {
  const [mounted, setMounted] = useState(false)
  const quillRef = useRef<typeof ReactQuill | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-40 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>
  }

  const modules = {
    toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link"], ["clean"]],
  }

  return (
    <ReactQuill
      forwardedRef={quillRef}
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
      theme="snow"
      className="h-40"
    />
  )
}

