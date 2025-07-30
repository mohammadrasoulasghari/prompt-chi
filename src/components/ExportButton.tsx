import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Prompt } from "@/types/prompt";
import { useToast } from "@/hooks/use-toast";

interface ExportButtonProps {
  prompts: Prompt[];
  filteredPrompts: Prompt[];
  hasActiveFilters: boolean;
}

export default function ExportButton({ prompts, filteredPrompts, hasActiveFilters }: ExportButtonProps) {
  const { toast } = useToast();

  const exportToJSON = () => {
    const dataToExport = hasActiveFilters ? filteredPrompts : prompts;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCount: dataToExport.length,
      prompts: dataToExport.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        category: prompt.category,
        modelType: prompt.modelType,
        tags: prompt.tags,
        createdAt: prompt.createdAt,
        updatedAt: prompt.updatedAt,
        versionsCount: prompt.versions?.length || 0
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "خروجی گرفته شد!",
      description: `${dataToExport.length} پرامپت به صورت JSON ذخیره شد.`,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={exportToJSON}
      className="hover:bg-primary/10 hover:border-primary/30"
      title={hasActiveFilters ? "خروجی پرامپت‌های فیلتر شده" : "خروجی تمام پرامپت‌ها"}
    >
      <Download className="w-4 h-4" />
    </Button>
  );
}