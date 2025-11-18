import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentsSectionProps {
  profileId: string;
  isOwnProfile: boolean;
}

export function DocumentsSection({ profileId, isOwnProfile }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [profileId]);

  const loadDocuments = async () => {
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

  return (
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
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{doc.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(doc.name)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}