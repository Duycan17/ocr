"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ImageResults } from "@/components/image-results"
import { useToast } from "@/hooks/use-toast"

export function OcrProcessor() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files)

      // Filter for allowed file types
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/bmp", "image/gif"]
      const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type))

      if (validFiles.length !== selectedFiles.length) {
        toast({
          title: "Invalid file type",
          description: "Only PNG, JPG, JPEG, BMP, and GIF files are allowed.",
          variant: "destructive",
        })
      }

      setFiles(validFiles)
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to process.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      const response = await fetch("http://172.29.97.78:5000/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to process images")
      }

      const data = await response.json()
      setResults(data)

      toast({
        title: "Processing complete",
        description: `Successfully processed ${files.length} image${files.length > 1 ? "s" : ""}.`,
      })
    } catch (error) {
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFiles([])
    setResults(null)
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".png,.jpg,.jpeg,.bmp,.gif"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Drag and drop files here or click to browse</p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG, JPEG, BMP, GIF up to 10MB each</p>
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Selected files:</h3>
              <ul className="mt-2 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex justify-between">
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={resetForm} disabled={isUploading || (files.length === 0 && !results)}>
              Reset
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || files.length === 0}>
              {isUploading ? "Processing..." : "Process Images"}
            </Button>
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading and processing...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>
      </Card>

      {results && <ImageResults results={results} />}
    </div>
  )
}

