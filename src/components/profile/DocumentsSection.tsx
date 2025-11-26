import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DocumentsSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function DocumentsSection({ profileId, isOwnProfile }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteFileName, setDeleteFileName] = useState<string | null>(null);

  useEffect(() => {
    if (profileId) {
      loadDocuments();
    }
  }, [profileId]);

  const loadDocuments = async () => {
    if (!profileId) return;
    
    const { data } = await supabase.storage
      .from('profile-documents')
      .list(profileId);

    if (data) setDocuments(data);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const filePath = `${profileId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-documents')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      toast.success("Document uploaded successfully");
      loadDocuments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    const { data } = await supabase.storage
      .from('profile-documents')
      .download(`${profileId}/${fileName}`);

    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  };

  const handleDelete = async () => {
    if (!deleteFileName) return;
    
    try {
      const { error } = await supabase.storage
        .from('profile-documents')
        .remove([`${profileId}/${deleteFileName}`]);
      
      if (error) throw error;
      toast.success("Document deleted successfully");
      loadDocuments();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteFileName(null);
    }
  };

  if (!profileId) return null;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents & Resume
          </CardTitle>
          {isOwnProfile && (
            <label>
              <Button variant="ghost" size="icon" disabled={uploading} asChild>
                <span>
                  <Upload className="h-4 w-4" />
                </span>
              </Button>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          )}
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-muted-foreground">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between p-3 border rounded-lg group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(doc.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {isOwnProfile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                        onClick={() => setDeleteFileName(doc.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteFileName} onOpenChange={() => setDeleteFileName(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteFileName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
