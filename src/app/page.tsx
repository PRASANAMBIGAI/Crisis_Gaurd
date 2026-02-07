
"use client"

import React, { useState } from 'react';
import { CrisisGuardSidebar } from "@/components/CrisisGuardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { LoginOverlay } from "@/components/LoginOverlay";
import { 
  Bell, 
  Search, 
  User, 
  ChevronRight,
  ShieldAlert,
  Globe,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveThreatMap } from "@/components/LiveThreatMap";
import { AnalyticsView } from "@/components/AnalyticsView";
import { AlertHistory } from "@/components/AlertHistory";
import { SettingsView } from "@/components/SettingsView";
import appData from "@/lib/app-data.json";

const IconMap = {
  Globe: Globe,
  ShieldAlert: ShieldAlert,
  TrendingUp: TrendingUp,
  AlertTriangle: AlertTriangle
};

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [badgeId, setBadgeId] = useState<string>('');

  const handleLoginSuccess = (id: string) => {
    setBadgeId(id);
    setIsAuthenticated(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs / Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-primary">Intelligence Dashboard</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">Intelligence Dashboard</h2>
              </div>
              
              <div className="flex gap-3">
                <Card className="bg-emerald-500/10 border-emerald-500/20 px-4 py-2 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">
                    {appData.dashboard.systemStatus}
                  </span>
                </Card>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {appData.dashboard.stats.map((stat, i) => {
                const IconComponent = IconMap[stat.icon as keyof typeof IconMap] || Globe;
                return (
                  <Card key={i} className="bg-card border-border/50 hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {stat.change} <span className="text-muted-foreground font-normal">since last hour</span>
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg bg-secondary/50 ${stat.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Analysis Section */}
            <AnalysisPanel />
          </div>
        );
      case 'live-map':
        return <LiveThreatMap />;
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertHistory />;
      case 'settings':
        return <SettingsView />;
      default:
        return <div>Section under development</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {!isAuthenticated && (
        <LoginOverlay onLoginSuccess={handleLoginSuccess} />
      )}

      {/* Sidebar Navigation */}
      <CrisisGuardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Global threat search..." 
                className="pl-10 h-10 bg-secondary/50 border-transparent focus:border-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background"></span>
            </Button>
            <ThemeToggle />
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{badgeId || 'Intelligence Officer'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Verified Access</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 overflow-hidden bg-secondary">
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
