"use client"

import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Map as MapIcon, 
  Settings, 
  Activity, 
  AlertTriangle,
  LogOut
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout?: () => void;
}

export function CrisisGuardSidebar({ activeTab, setActiveTab, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'live-map', icon: MapIcon, label: 'Live Threat Map' },
    { id: 'analytics', icon: Activity, label: 'Analytics' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alert History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">CrisisGuard</h1>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
              activeTab === item.id 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 mt-auto border-t pt-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
