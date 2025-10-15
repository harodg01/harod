"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText, ImageIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { createPatientDocument, getCurrentUser, getPatientDocuments } from "@/lib/mock-data"

interface DocumentUploadProps {
  patientId: string
  onUploadComplete?: (documents: any[]) => void
}

export function DocumentUpload({ patientId, onUploadComplete }: DocumentUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        })
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !fileType) {
      toast({
        title: "Missing information",
        description: "Please select a file and document type",
        variant: "destructive",
      })
      return
    }

    const currentUser = getCurrentUser()
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload documents",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      createPatientDocument({
        patientId,
        fileName: selectedFile.name,
        fileType: fileType as any,
        fileSize: selectedFile.size,
        uploadedBy: currentUser.fullName,
        description,
      })

      toast({
        title: "Upload successful",
        description: `${selectedFile.name} has been uploaded`,
      })

      setSelectedFile(null)
      setFileType("")
      setDescription("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      if (onUploadComplete) {
        const updatedDocuments = getPatientDocuments(patientId)
        onUploadComplete(updatedDocuments)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading the file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Upload New Document</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="file-upload">Select File</Label>
          <div className="mt-2">
            <Input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
              className="cursor-pointer"
            />
          </div>
          {selectedFile && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {selectedFile.type.startsWith("image/") ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>{selectedFile.name}</span>
              <span>({(selectedFile.size / 1024).toFixed(2)} KB)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedFile(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="document-type">Document Type</Label>
          <Select value={fileType} onValueChange={setFileType}>
            <SelectTrigger id="document-type" className="mt-2">
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Medical Image</SelectItem>
              <SelectItem value="lab-result">Lab Result</SelectItem>
              <SelectItem value="prescription">Prescription</SelectItem>
              <SelectItem value="letter">Medical Letter</SelectItem>
              <SelectItem value="document">General Document</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add notes about this document..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>

        <Button onClick={handleUpload} disabled={!selectedFile || !fileType || isUploading} className="w-full">
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}