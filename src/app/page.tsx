
"use client"

import React, { useState, useEffect } from 'react';
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
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveThreatMap } from "@/components/LiveThreatMap";
import { AnalyticsView } from "@/components/AnalyticsView";
import { AlertHistory } from "@/components/AlertHistory";
import { SettingsView } from "@/components/SettingsView";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import appData from "@/lib/app-data.json";
import { useUser, useAuth } from '@/firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const IconMap = { Globe, ShieldAlert, TrendingUp, AlertTriangle };

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = getFirestore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [badgeId, setBadgeId] = useState<string>('');
  const [role, setRole] = useState<string>('Officer');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setBadgeId(data.badgeId);
          setRole(data.role);
        }
      };
      fetchProfile();
    }
  }, [user, db]);

  const handleLogout = () => {
    auth.signOut();
    setActiveTab('dashboard');
  };

  if (isUserLoading) return <div className="h-screen w-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {!user && <LoginOverlay onLoginSuccess={setBadgeId} />}

      <CrisisGuardSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4 w-full max-w-xl">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search tactical intelligence..." className="pl-10 bg-secondary/30 border-transparent" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{badgeId || 'SEC-OFFICER'}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{role}</p>
              </div>
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-secondary" onClick={() => setActiveTab('settings')}>
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 uppercase font-bold">
                      <span>Intelligence HQ</span>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-primary">Regional Sector Feed</span>
                    </div>
                    <h2 className="text-3xl font-extrabold">Tactical Dashboard</h2>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{appData.dashboard.systemStatus}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {appData.dashboard.stats.map((stat, i) => {
                    const IconComponent = IconMap[stat.icon as keyof typeof IconMap] || Globe;
                    return (
                      <Card key={i} className="bg-card border-border/50">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <div className={`p-2 rounded-lg bg-secondary/50 ${stat.color}`}><IconComponent className="w-5 h-5" /></div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <AnalysisPanel />
              </div>
            )}
            {activeTab === 'live-map' && <LiveThreatMap />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'alerts' && <AlertHistory />}
            {activeTab === 'settings' && <SettingsView badgeId={badgeId} />}
          </div>
        </div>
      </main>
    </div>
  );
}

const Loader2 = ({className}: {className?: string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
