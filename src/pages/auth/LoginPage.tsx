"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const { isLoading } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (error: any) {
      toast.error('Tizimga kirishda xatolik: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 text-foreground">
      <Card className="w-full max-w-md bg-card border shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Tizimga kirish</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Elektron pochta va parolingizni kiriting
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parol</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Kirilmoqda...' : 'Kirish'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Ro'yxatdan o'ting
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
