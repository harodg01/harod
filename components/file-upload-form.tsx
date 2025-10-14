"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface FileUploadFormProps {
  patientId: string
  userId: string
}

export function FileUploadForm({ patientId, userId }: FileUploadFormProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${patientId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("medical-files").upload(fileName, selectedFile)

      if (uploadError) throw uploadError

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("medical-files").getPublicUrl(fileName)

      // Save file metadata to database
      const { error: dbError } = await supabase.from("medical_files").insert({
        patient_id: patientId,
        file_name: selectedFile.name,
        file_type: selectedFile.type,
        file_url: publicUrl,
        file_size: selectedFile.size,
        uploaded_by: userId,
      })

      if (dbError) throw dbError

      // Log audit
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "upload",
        resource_type: "medical_file",
        resource_id: patientId,
        details: { file_name: selectedFile.name },
      })

      setSelectedFile(null)
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">Select File</Label>
        <Input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.m4a"
          disabled={isUploading}
        />
        <p className="text-xs text-muted-foreground">
          Supported formats: PDF, DOC, DOCX, JPG, PNG, MP3, WAV, M4A (Max 10MB)
        </p>
      </div>

      {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

      <Button type="submit" disabled={!selectedFile || isUploading}>
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
    </form>
  )
}
