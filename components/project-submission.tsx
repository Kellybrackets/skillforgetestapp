"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { FileText, ImageIcon, Upload, X, Check } from "lucide-react"

interface ProjectSubmissionProps {
  projectId: number
  projectTitle: string
}

export function ProjectSubmission({ projectId, projectTitle }: ProjectSubmissionProps) {
  const [files, setFiles] = useState<File[]>([])
  const [description, setDescription] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Remove a file
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Simulate file upload
  const handleSubmit = () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Submit Your Project</CardTitle>
        <CardDescription>Upload your files and provide a description of your work</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Drag and drop your files here</p>
              <p className="text-sm text-muted-foreground">or click to browse (max 10MB per file)</p>
            </div>
            <input type="file" multiple className="hidden" id="file-upload" onChange={handleFileChange} />
            <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
              Select Files
            </Button>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Uploaded Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      {file.type.includes("image") ? (
                        <ImageIcon className="h-4 w-4 text-primary" />
                      ) : (
                        <FileText className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Description */}
        <div className="space-y-3">
          <h3 className="font-medium">Project Description</h3>
          <Textarea
            placeholder="Describe your project, your process, and any challenges you faced..."
            className="min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Uploading files...</span>
              <span className="text-sm font-medium">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {/* Upload Complete */}
        {uploadComplete && (
          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 flex items-start">
            <Check className="h-5 w-5 mr-2 mt-0.5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-medium">Files uploaded successfully!</p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your project has been submitted for review. You'll receive feedback within 48 hours.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline">Save Draft</Button>
        <Button
          onClick={handleSubmit}
          disabled={files.length === 0 || description.trim() === "" || isUploading || uploadComplete}
        >
          Submit Project
        </Button>
      </CardFooter>
    </Card>
  )
}
