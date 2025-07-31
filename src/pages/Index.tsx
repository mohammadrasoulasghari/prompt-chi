import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Sparkles, Database, Zap } from "lucide-react";
import { Prompt, PromptFilters, PromptVersion } from "@/types/prompt";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import PromptCard from "@/components/PromptCard";
import PromptForm from "@/components/PromptForm";
import PromptFiltersComponent from "@/components/PromptFilters";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>("prompts", []);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<PromptFilters>({});
  const { toast } = useToast();

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch = !filters.searchQuery || 
        prompt.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      
      const matchesCategory = !filters.category || prompt.category === filters.category;
      const matchesModel = !filters.modelType || prompt.modelType === filters.modelType;
      
      return matchesSearch && matchesCategory && matchesModel;
    });
  }, [prompts, filters]);

  const handleAddPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPrompts([newPrompt, ...prompts]);
    setIsFormOpen(false);
    toast({
      title: "پرامپت اضافه شد!",
      description: "پرامپت جدید با موفقیت ذخیره شد.",
    });
  };

  const handleEditPrompt = (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingPrompt) return;
    
    // ذخیره نسخه قبلی در تاریخچه
    const previousVersion: PromptVersion = {
      id: Date.now().toString(),
      title: editingPrompt.title,
      content: editingPrompt.content,
      category: editingPrompt.category,
      modelType: editingPrompt.modelType,
      tags: editingPrompt.tags,
      timestamp: editingPrompt.updatedAt,
      changeNote: `ویرایش شده در ${new Intl.DateTimeFormat('fa-IR').format(new Date())}`
    };
    
    const updatedPrompt: Prompt = {
      ...promptData,
      id: editingPrompt.id,
      createdAt: editingPrompt.createdAt,
      updatedAt: new Date(),
      versions: [previousVersion, ...(editingPrompt.versions || [])]
    };
    
    setPrompts(prompts.map(p => p.id === editingPrompt.id ? updatedPrompt : p));
    setEditingPrompt(null);
    setIsFormOpen(false);
    toast({
      title: "پرامپت به‌روزرسانی شد!",
      description: "تغییرات با موفقیت ذخیره شد.",
    });
  };

  const handleRestoreVersion = (promptId: string, version: PromptVersion) => {
    const currentPrompt = prompts.find(p => p.id === promptId);
    if (!currentPrompt) return;

    // ذخیره نسخه فعلی در تاریخچه
    const currentVersion: PromptVersion = {
      id: Date.now().toString(),
      title: currentPrompt.title,
      content: currentPrompt.content,
      category: currentPrompt.category,
      modelType: currentPrompt.modelType,
      tags: currentPrompt.tags,
      timestamp: currentPrompt.updatedAt,
      changeNote: `بازگردانی از نسخه ${new Intl.DateTimeFormat('fa-IR').format(version.timestamp)}`
    };

    const restoredPrompt: Prompt = {
      ...currentPrompt,
      title: version.title,
      content: version.content,
      category: version.category,
      modelType: version.modelType,
      tags: version.tags,
      updatedAt: new Date(),
      versions: [currentVersion, ...(currentPrompt.versions || [])]
    };

    setPrompts(prompts.map(p => p.id === promptId ? restoredPrompt : p));
    toast({
      title: "نسخه بازگردانی شد!",
      description: "پرامپت به نسخه انتخابی بازگردانده شد.",
    });
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id));
    toast({
      title: "پرامپت حذف شد",
      description: "پرامپت با موفقیت حذف شد.",
      variant: "destructive",
    });
  };

  const openEditForm = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingPrompt(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex flex-col">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-accent/30 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-right">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                مدیریت پرامپت‌های هوش مصنوعی
              </h1>
              <p className="text-muted-foreground mt-2">
                مجموعه پرامپت‌های خود را سازماندهی و مدیریت کنید
              </p>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={openAddForm}
                  className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  پرامپت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <PromptForm
                  prompt={editingPrompt}
                  onSubmit={editingPrompt ? handleEditPrompt : handleAddPrompt}
                  onCancel={closeForm}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 flex-grow">
        {/* Filters */}
        <PromptFiltersComponent 
          filters={filters} 
          onFiltersChange={setFilters}
          prompts={prompts}
          filteredPrompts={filteredPrompts}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">کل پرامپت‌ها</p>
                <p className="text-2xl font-bold text-foreground">{prompts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نمایش داده شده</p>
                <p className="text-2xl font-bold text-foreground">{filteredPrompts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-accent/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">دسته‌بندی‌ها</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(prompts.map(p => p.category)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 border border-accent/30 max-w-md mx-auto">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {prompts.length === 0 ? "هنوز پرامپتی اضافه نکرده‌اید" : "نتیجه‌ای یافت نشد"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {prompts.length === 0 
                  ? "اولین پرامپت خود را اضافه کنید تا شروع کنید" 
                  : "فیلترهای خود را تغییر دهید یا جستجوی جدیدی انجام دهید"}
              </p>
              {prompts.length === 0 && (
                <Button onClick={openAddForm} className="bg-gradient-to-r from-primary to-primary-glow">
                  <Plus className="w-4 h-4 ml-2" />
                  افزودن اولین پرامپت
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onEdit={openEditForm}
                onDelete={handleDeletePrompt}
                onRestoreVersion={handleRestoreVersion}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-card/30 backdrop-blur-sm border-t border-accent/30 mt-auto">
        <div className="container mx-auto px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a 
              href="https://mohammadrasoulasghari.ir" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-glow transition-colors font-medium"
            >
              mohammadrasoulasghari
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}