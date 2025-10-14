"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FileText, Download, Trash2, File, ImageIcon, Music } from "lucide-react"

interface FileListProps {
  files: Array<{
    id: string
    file_name: string
    file_type: string
    file_url: string
    file_size: number
    created_at: string
  }>
  userRole: string
  userId: string
}

export function FileList({ files, userRole, userId }: FileListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return ImageIcon
    if (fileType.startsWith("audio/")) return Music
    if (fileType.includes("pdf") || fileType.includes("document")) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleDelete = async (fileId: string, fileUrl: string) => {
    setDeletingId(fileId)
    const supabase = createClient()

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split("/medical-files/")
      const filePath = urlParts[1]

      // Delete from storage
      const { error: storageError } = await supabase.storage.from("medical-files").remove([filePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase.from("medical_files").delete().eq("id", fileId)

      if (dbError) throw dbError

      // Log audit
      await supabase.from("audit_logs").insert({
        user_id: userId,
        action: "delete",
        resource_type: "medical_file",
        resource_id: fileId,
        details: { file_url: fileUrl },
      })

      router.refresh()
    } catch (err) {
      console.error("Failed to delete file:", err)
    } finally {
      setDeletingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-semibold">No files uploaded</h3>
        <p className="text-sm text-muted-foreground">Upload medical documents to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const Icon = getFileIcon(file.file_type)
        return (
          <div key={file.id} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <a href={file.file_url} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                </a>
              </Button>
              {userRole === "admin" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={deletingId === file.id}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete file?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {file.file_name}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(file.id, file.file_url)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
