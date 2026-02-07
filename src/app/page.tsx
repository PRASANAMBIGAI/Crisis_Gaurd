
"use client"

import React, { useState, useEffect } from 'react';
import { CrisisGuardSidebar } from "@/components/CrisisGuardSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { LoginOverlay } from "@/components/LoginOverlay";
import { GoogleTranslate } from "@/components/GoogleTranslate";
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
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
  Loader2
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
import { useUser, useAuth, useCollection, useMemoFirebase } from '@/firebase';
import { getFirestore, doc, getDoc, collection, query, orderBy, limit } from 'firebase/firestore';

const IconMap = { Globe, ShieldAlert, TrendingUp, AlertTriangle };

export default function Home() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const db = getFirestore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [badgeId, setBadgeId] = useState<string>('');
  const [role, setRole] = useState<string>('Officer');

  // Load high-risk alerts for the notification center only if user is authenticated
  const alertQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'socialMediaMessages'),
      orderBy('analysisDate', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: recentAlerts } = useCollection(alertQuery as any);

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
            <GoogleTranslate />
            <div className="h-8 w-px bg-border mx-1"></div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10">
                  <Bell className="w-5 h-5" />
                  {recentAlerts && recentAlerts.some(a => a.harmScore >= 70) && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse border-2 border-background" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-8 z-[60]" align="end">
                <div className="p-4 border-b bg-secondary/20 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    Tactical Alerts
                  </h4>
                  <Badge variant="outline" className="text-[9px] h-5 bg-background">{recentAlerts?.length || 0} Recent</Badge>
                </div>
                <ScrollArea className="h-[350px]">
                  {recentAlerts && recentAlerts.length > 0 ? (
                    <div className="divide-y divide-border/10">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 hover:bg-secondary/10 transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between mb-1">
                            <Badge className={alert.harmScore >= 70 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"}>
                              {alert.harmScore > 85 ? 'Lethal' : alert.harmScore >= 70 ? 'Priority' : 'Safe'}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-mono">{new Date(alert.analysisDate).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">{alert.text || 'Multimedia Intel Analyzed'}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                              <div className={`h-full ${alert.harmScore >= 70 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${alert.harmScore}%` }} />
                            </div>
                            <span className="text-[10px] font-bold">{alert.harmScore}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center space-y-2">
                      <ShieldCheck className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                      <p className="text-xs text-muted-foreground font-medium">No critical threats detected in recent scans.</p>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-2 border-t bg-secondary/5">
                  <Button variant="ghost" className="w-full text-[10px] uppercase font-bold tracking-widest h-8" onClick={() => setActiveTab('alerts')}>
                    Full Intelligence Log
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggle />
            <div className="h-8 w-px bg-border mx-1"></div>
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
