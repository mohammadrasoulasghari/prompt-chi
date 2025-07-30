import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy, Calendar, Star } from "lucide-react";
import { PromptVersion } from "@/types/prompt";
import { Prompt } from "@/hooks/usePrompts";
import { useToast } from "@/hooks/use-toast";
import PromptHistory from "./PromptHistory";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRestoreVersion: (promptId: string, version: PromptVersion) => void;
}

export default function PromptCard({ prompt, onEdit, onDelete, onToggleFavorite, onRestoreVersion }: PromptCardProps) {
  const { toast } = useToast();

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
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {prompt.title}
          </h3>
          <div className="flex gap-1 items-center">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              {prompt.category}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(prompt.id)}
              className="p-1 h-6 w-6 hover:bg-yellow-100 hover:text-yellow-600"
              title={prompt.is_favorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            >
              <Star className={`w-4 h-4 ${prompt.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {prompt.content}
        </p>
        
        {prompt.model_types && prompt.model_types.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {prompt.model_types.map((model, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {model}
              </Badge>
            ))}
          </div>
        )}

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {prompt.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-accent/50">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>ایجاد: {formatDate(new Date(prompt.created_at))}</span>
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
          {/* Version history will be added later */}
        </div>
      </CardFooter>
    </Card>
  );
}