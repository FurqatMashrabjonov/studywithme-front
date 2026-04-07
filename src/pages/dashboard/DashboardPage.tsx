"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotebooks } from '@/hooks/useNotebooks';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Book, MoreVertical, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

export const DashboardPage = () => {
  const { fetchNotebooks, createNotebook, updateNotebook, deleteNotebook } = useNotebooks();
  const { notebooks, user, logout, setCurrentNotebook } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  const handleCreate = async () => {
    try {
      const newNotebook = await createNotebook();
      toast.success('Daftar yaratildi');
      const uid = newNotebook.uid || newNotebook.notebook_uid;
      if (uid) {
        setCurrentNotebook(newNotebook);
        navigate(`/notebook/${uid}`);
      }
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    }
  };

  const openNotebook = (notebook: any) => {
    setCurrentNotebook(notebook);
    const uid = notebook.uid || notebook.notebook_uid;
    navigate(`/notebook/${uid}`);
  };

  const handleRenameNotebook = async (notebook: any) => {
    const uid = notebook.uid || notebook.notebook_uid;
    if (!uid) return;

    const nextName = prompt('Yangi nom kiriting:', notebook.name || '');
    if (!nextName || nextName.trim() === notebook.name) return;

    try {
      await updateNotebook(uid, nextName.trim());
      toast.success('Daftar nomi yangilandi');
    } catch {
      toast.error('Nomni yangilashda xatolik yuz berdi');
    }
  };

  const handleDeleteNotebook = async (notebook: any) => {
    const uid = notebook.uid || notebook.notebook_uid;
    if (!uid) return;

    const ok = confirm(`"${notebook.name}" daftarini o'chirmoqchimisiz?`);
    if (!ok) return;

    try {
      await deleteNotebook(uid);
      toast.success('Daftar o\'chirildi');
    } catch {
      toast.error('Daftarni o\'chirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-16 border-b flex items-center justify-between px-8 bg-background">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">S</div>
          <h1 className="text-xl font-semibold tracking-tight">Study with me</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full border p-0 overflow-hidden outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="flex items-center justify-center w-full h-full text-sm font-bold bg-muted text-muted-foreground hover:bg-accent transition-colors">
                {user?.name?.[0] || 'U'}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{user?.name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => { logout(); navigate('/login'); }}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Chiqish</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <div>
            <h2 className="text-3xl font-bold">Mening Daftarlarim</h2>
            <p className="text-muted-foreground mt-1">O'z manbalaringizni qo'shing va AI bilan muloqot qiling</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Card 
            onClick={handleCreate}
            className="border-dashed hover:border-primary/50 cursor-pointer transition-all flex flex-col items-center justify-center p-8 h-[200px] shadow-none bg-muted/50"
          >
            <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Yangi daftar yaratish</p>
          </Card>

          {notebooks.map((nb) => (
            <Card 
              key={nb.uid || nb.notebook_uid}
              onClick={() => openNotebook(nb)}
              className="cursor-pointer transition-all group overflow-hidden hover:shadow-md shadow-sm"
            >
              <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Book className="w-5 h-5 text-primary" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-44"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => handleRenameNotebook(nb)}
                    >
                      Nomini o'zgartirish
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                      onClick={() => handleDeleteNotebook(nb)}
                    >
                      O'chirish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                  {nb.name}
                </CardTitle>
                <CardDescription className="text-xs mt-2">
                  Yaratilgan: {nb.created_at ? new Date(nb.created_at).toLocaleDateString() : 'Noma\'lum'}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};
