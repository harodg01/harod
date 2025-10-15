"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, ImageIcon, Download, Eye, Trash2, Search, Filter } from 'lucide-react'
import { DocumentUpload } from "./document-upload"
import { PatientDocument } from "@/lib/mock-data"
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
import { deletePatientDocument } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

interface PatientDocumentationProps {
  patientId: string
  documents: PatientDocument[]
  onDocumentsChange: (documents: PatientDocument[]) => void
}

export function PatientDocumentation({
  patientId,
  documents,
  onDocumentsChange,
}: PatientDocumentationProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const { toast } = useToast()

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || doc.fileType === filterType
    return matchesSearch && matchesFilter
  })

  const handleDelete = (documentId: string) => {
    deletePatientDocument(documentId)
    const updatedDocs = documents.filter((doc) => doc.id !== documentId)
    onDocumentsChange(updatedDocs)
    toast({
      title: "Document deleted",
      description: "The document has been successfully deleted",
    })
  }

  const getFileIcon = (fileType: string) => {
    if (fileType === "image") {
      return <ImageIcon className="h-5 w-5" />
    }
    return <FileText className="h-5 w-5" />
  }

  const getFileTypeColor = (fileType: string) => {
    const colors: Record<string, string> = {
      image: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "lab-result": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      prescription: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      letter: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      document: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      other: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    }
    return colors[fileType] || colors.other
  }

  return (
    <div className="space-y-6">
      <DocumentUpload patientId={patientId} onUploadComplete={onDocumentsChange} />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="sm:w-48">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="lab-result">Lab Results</SelectItem>
                <SelectItem value="prescription">Prescriptions</SelectItem>
                <SelectItem value="letter">Letters</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Documents ({filteredDocuments.length})</h3>

        {filteredDocuments.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No documents found</p>
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-muted rounded-lg">{getFileIcon(doc.fileType)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{doc.fileName}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()} by {doc.uploadedBy}
                        </p>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                        )}
                      </div>
                      <Badge className={getFileTypeColor(doc.fileType)}>
                        {doc.fileType.replace("-", " ")}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{doc.fileName}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(doc.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}