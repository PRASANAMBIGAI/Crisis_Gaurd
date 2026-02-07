"use client"

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 bg-card border-border shadow-sm transition-all hover:scale-105 active:scale-95"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-accent" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
