import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { History, Clock, ArrowRight, Copy } from "lucide-react";
import { PromptVersion } from "@/types/prompt";
import { useToast } from "@/hooks/use-toast";

interface PromptHistoryProps {
  versions: PromptVersion[];
  onRestoreVersion: (version: PromptVersion) => void;
}

export default function PromptHistory({ versions, onRestoreVersion }: PromptHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<PromptVersion | null>(null);
  const { toast } = useToast();

  const handleCopyVersion = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "کپی شد!",
        description: "نسخه انتخابی در کلیپ‌بورد کپی شد",
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "امکان کپی وجود نداشت",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">هنوز تاریخچه‌ای موجود نیست</p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover:bg-accent/50">
          <History className="w-4 h-4 ml-2" />
          تاریخچه ({versions.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            تاریخچه تغییرات
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 h-[60vh]">
          {/* لیست نسخه‌ها */}
          <div className="w-1/3 border-l border-border pl-4">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <Card 
                    key={version.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedVersion?.id === version.id 
                        ? 'ring-2 ring-primary bg-accent/50' 
                        : 'hover:bg-accent/30'
                    }`}
                    onClick={() => setSelectedVersion(version)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          نسخه {versions.length - index}
                        </Badge>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(version.timestamp)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">
                        {version.title}
                      </h4>
                      {version.changeNote && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {version.changeNote}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* جزئیات نسخه انتخابی */}
          <div className="flex-1">
            {selectedVersion ? (
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedVersion.title}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyVersion(selectedVersion.content)}
                      >
                        <Copy className="w-4 h-4 ml-2" />
                        کپی
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onRestoreVersion(selectedVersion)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <ArrowRight className="w-4 h-4 ml-2" />
                        بازگردانی
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge variant="secondary">{selectedVersion.category}</Badge>
                    <Badge variant="outline">{selectedVersion.modelType}</Badge>
                  </div>

                  {selectedVersion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedVersion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">محتوای پرامپت:</h4>
                    <div className="bg-muted/30 rounded-lg p-4 border">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {selectedVersion.content}
                      </pre>
                    </div>
                  </div>

                  {selectedVersion.changeNote && (
                    <div>
                      <h4 className="font-medium mb-2">یادداشت تغییر:</h4>
                      <div className="bg-accent/30 rounded-lg p-3 border border-accent">
                        <p className="text-sm">{selectedVersion.changeNote}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    <span>تاریخ: {formatDateTime(selectedVersion.timestamp)}</span>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>نسخه‌ای را انتخاب کنید</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}