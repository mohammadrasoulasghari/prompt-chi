import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, Calendar, MessageSquare, Bot, Palette, Image, Cpu, Zap, Wand2 } from "lucide-react";
import { Prompt, PromptVersion } from "@/types/prompt";
import { useToast } from "@/hooks/use-toast";
import PromptHistory from "./PromptHistory";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onRestoreVersion: (promptId: string, version: PromptVersion) => void;
}

export default function PromptCard({ prompt, onEdit, onDelete, onRestoreVersion }: PromptCardProps) {
  const { toast } = useToast();

  const getModelIcon = (model: string) => {
    switch (model) {
      case "ChatGPT": return <span className="text-green-500 font-bold">🤖</span>;
      case "Claude": return <span className="text-orange-500 font-bold">🧠</span>;
      case "Gemini": return <span className="text-blue-500 font-bold">⭐</span>;
      case "Midjourney": return <span className="text-purple-500 font-bold">🎨</span>;
      case "DALL-E": return <span className="text-blue-600 font-bold">🖼️</span>;
      case "Stable Diffusion": return <span className="text-green-600 font-bold">🔥</span>;
      default: return <span className="text-gray-500 font-bold">💻</span>;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "کپی شد!",
        description: "پرامپت در کلیپ‌بورد کپی شد",
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
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-accent/20 border-accent/30 hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <h3 
            className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors cursor-pointer"
            onClick={() => onEdit(prompt)}
          >
            {prompt.title}
          </h3>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              {prompt.category}
            </Badge>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              {(() => {
                const modelIcon = getModelIcon(prompt.modelType);
                return (
                  <>
                    {modelIcon}
                    {prompt.modelType}
                  </>
                );
              })()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {prompt.content}
        </p>
        
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {prompt.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-accent/50">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>ایجاد: {formatDate(prompt.createdAt)}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 hover:bg-primary/10 hover:border-primary/30"
          >
            <Copy className="w-4 h-4 ml-2" />
            کپی
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(prompt)}
            className="hover:bg-primary/10 hover:border-primary/30"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(prompt.id)}
            className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {prompt.versions && prompt.versions.length > 0 && (
            <PromptHistory 
              versions={prompt.versions} 
              onRestoreVersion={(version) => onRestoreVersion(prompt.id, version)}
            />
          )}
        </div>
      </CardFooter>
    </Card>
  );
}