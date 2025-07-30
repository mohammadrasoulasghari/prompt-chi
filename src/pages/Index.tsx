import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Sparkles, Database, Zap, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePrompts, type Prompt } from "@/hooks/usePrompts";
import { PromptFilters, PromptVersion } from "@/types/prompt";
import PromptCard from "@/components/PromptCard";
import PromptForm from "@/components/PromptForm";
import PromptFiltersComponent from "@/components/PromptFilters";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const { prompts, addPrompt, updatePrompt, deletePrompt } = usePrompts();
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState<PromptFilters>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch = !filters.searchQuery || 
        prompt.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()));
      
      const matchesCategory = !filters.category || prompt.category === filters.category;
      const matchesModel = true; // Remove modelType filter for now
      
      return matchesSearch && matchesCategory && matchesModel;
    });
  }, [prompts, filters]);

  const handleAddPrompt = async (promptData: any) => {
    try {
      await addPrompt(promptData);
      setIsFormOpen(false);
    } catch (error) {
      // Error handling is done in usePrompts hook
    }
  };

  const handleEditPrompt = async (promptData: any) => {
    if (!editingPrompt) return;
    
    try {
      await updatePrompt(editingPrompt.id, promptData);
      setEditingPrompt(null);
      setIsFormOpen(false);
    } catch (error) {
      // Error handling is done in usePrompts hook
    }
  };

  const handleRestoreVersion = (promptId: string, version: PromptVersion) => {
    // This functionality will be implemented later when we add versioning to the database
    toast({
      title: "قابلیت بازگردانی",
      description: "این قابلیت در آینده اضافه خواهد شد",
    });
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      await deletePrompt(id);
    } catch (error) {
      // Error handling is done in usePrompts hook
    }
  };

  const openEditForm = (prompt: any) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
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
              {user && (
                <p className="text-sm text-muted-foreground mt-1">
                  <User className="w-4 h-4 inline ml-1" />
                  خوش آمدید، {user.email}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={signOut}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
              
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
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
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
    </div>
  );
}