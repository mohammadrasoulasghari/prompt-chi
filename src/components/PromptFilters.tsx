import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { CATEGORIES, MODEL_TYPES, PromptFilters } from "@/types/prompt";

interface PromptFiltersProps {
  filters: PromptFilters;
  onFiltersChange: (filters: PromptFilters) => void;
}

export default function PromptFiltersComponent({ filters, onFiltersChange }: PromptFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      category: value === "همه" ? undefined : value 
    });
  };

  const handleModelTypeChange = (value: string) => {
    onFiltersChange({ 
      ...filters, 
      modelType: value === "همه" ? undefined : value 
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.category || filters.modelType || filters.searchQuery;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/30 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="w-4 h-4 text-primary" />
        فیلتر و جستجو
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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

        <Select 
          value={filters.modelType || "همه"} 
          onValueChange={handleModelTypeChange}
        >
          <SelectTrigger className="bg-background/70">
            <SelectValue placeholder="نوع مدل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="همه">همه مدل‌ها</SelectItem>
            {MODEL_TYPES.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
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
    </div>
  );
}