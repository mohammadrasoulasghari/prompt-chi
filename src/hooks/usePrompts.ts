import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  model_types: string[];
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      toast({
        title: "خطا در بارگیری پرامپت‌ها",
        description: "نتوانستیم پرامپت‌ها را بارگیری کنیم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPrompt = async (prompt: Omit<Prompt, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('کاربر وارد نشده است');

      const { data, error } = await supabase
        .from('prompts')
        .insert([{ ...prompt, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setPrompts(prev => [data, ...prev]);
      toast({
        title: "پرامپت اضافه شد",
        description: "پرامپت جدید با موفقیت ذخیره شد",
      });
      return data;
    } catch (error) {
      toast({
        title: "خطا در افزودن پرامپت",
        description: "نتوانستیم پرامپت را ذخیره کنیم",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPrompts(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "پرامپت به‌روزرسانی شد",
        description: "تغییرات با موفقیت ذخیره شد",
      });
      return data;
    } catch (error) {
      toast({
        title: "خطا در به‌روزرسانی",
        description: "نتوانستیم تغییرات را ذخیره کنیم",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePrompt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPrompts(prev => prev.filter(p => p.id !== id));
      toast({
        title: "پرامپت حذف شد",
        description: "پرامپت با موفقیت حذف شد",
      });
    } catch (error) {
      toast({
        title: "خطا در حذف",
        description: "نتوانستیم پرامپت را حذف کنیم",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return {
    prompts,
    loading,
    addPrompt,
    updatePrompt,
    deletePrompt,
    refreshPrompts: fetchPrompts,
  };
};