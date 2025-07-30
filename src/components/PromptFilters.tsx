import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Download } from "lucide-react";
import { CATEGORIES, PromptFilters } from "@/types/prompt";
import { Prompt } from "@/hooks/usePrompts";
import { useToast } from "@/hooks/use-toast";

interface PromptFiltersProps {
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
  prompts: Prompt[];
  filteredPrompts: Prompt[];
}

export default function PromptFiltersComponent({ filters, onFiltersChange, prompts, filteredPrompts }: PromptFiltersProps) {
  const { toast } = useToast();
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === "همه" ? undefined : value 
    });
  };

  // Remove model type filter for now

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const exportToJSON = () => {
    const dataToExport = hasActiveFilters ? filteredPrompts : prompts;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      exportedBy: "سیستم مدیریت پرامپت‌های هوش مصنوعی",
      filterApplied: hasActiveFilters,
      totalCount: dataToExport.length,
      filters: hasActiveFilters ? {
        searchQuery: filters.searchQuery || null,
        category: filters.category || null
      } : null,
      prompts: dataToExport.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        category: prompt.category,
        tags: prompt.tags,
        created_at: prompt.created_at,
        updated_at: prompt.updated_at,
        is_favorite: prompt.is_favorite
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    const filterStr = hasActiveFilters ? '-filtered' : '-all';
    link.download = `prompts-export${filterStr}-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "خروجی گرفته شد!",
      description: `${dataToExport.length} پرامپت ${hasActiveFilters ? 'فیلتر شده' : ''} به صورت JSON ذخیره شد.`,
    });
  };

  const hasActiveFilters = filters.category || filters.searchQuery;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/30 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="w-4 h-4 text-primary" />
        فیلتر و جستجو
      </div>
      
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="جستجو در پرامپت‌ها..."
              value={filters.searchQuery || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-3 pr-10 bg-background/70"
            />
          </div>

          <Select 
            value={filters.category || "همه"} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-background/70">
              <SelectValue placeholder="دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="همه">همه دسته‌ها</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <X className="w-4 h-4 ml-1" />
              پاک کردن
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 mr-4">
          <Button
            variant="outline"
            onClick={exportToJSON}
            className="hover:bg-primary/10 hover:border-primary/30"
            title={hasActiveFilters ? "خروجی پرامپت‌های فیلتر شده" : "خروجی تمام پرامپت‌ها"}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}