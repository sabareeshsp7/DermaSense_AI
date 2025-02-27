"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Activity, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function AnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false)
  interface AnalysisResult {
    condition: string;
    confidence: number;
    recommendations: string[];
  }

  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [image, setImage] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      // Create a preview
      setImage(URL.createObjectURL(file))
      setAnalyzing(true)

      // Upload to Supabase Storage
      const { error } = await supabase.storage.from("analysis-images").upload(`${Date.now()}-${file.name}`, file)

      if (error) throw error

      // Simulate AI analysis (replace with actual AI integration)
      setTimeout(() => {
        setResult({
          condition: "Potential Dermatitis",
          confidence: 0.89,
          recommendations: ["Consult a dermatologist", "Keep the area clean and dry", "Avoid potential irritants"],
        })
        setAnalyzing(false)
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setAnalyzing(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Analysis</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload a clear image of the affected area for analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop an image here, or click to select one</p>}
            </div>

            {image && (
              <div className="mt-4">
                <Image
                  src={image || "/placeholder.svg"}
                  alt="Uploaded image"
                  width={300}
                  height={300}
                  className="rounded-lg mx-auto"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>AI-powered analysis of your skin condition</CardDescription>
          </CardHeader>
          <CardContent>
            {analyzing ? (
              <div className="flex flex-col items-center justify-center h-48">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Activity className="h-8 w-8 text-primary" />
                </motion.div>
                <p className="mt-4">Analyzing image...</p>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Detected Condition</h3>
                  <p className="text-2xl font-bold text-primary">{result.condition}</p>
                  <p className="text-sm text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full mt-4">Book Appointment</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <Activity className="h-8 w-8 mb-4" />
                <p>Upload an image to see the analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

