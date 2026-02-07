
"use client"

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, ShieldAlert, Globe, Crosshair, AlertTriangle, Zap, Activity } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

// Dynamically import Map components to prevent SSR errors
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export function LiveThreatMap() {
  const [isClient, setIsClient] = useState(false);
  const db = useFirestore();
  const { user } = useUser();

  // Load real intelligence entries from Firestore
  const intelQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(db, 'socialMediaMessages'),
      orderBy('analysisDate', 'desc'),
      limit(50)
    );
  }, [db, user]);
  
  const { data: realThreats, isLoading: isLoadingThreats } = useCollection(intelQuery as any);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((L) => {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
  }, []);

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Safe';
    if (score < 70) return 'Warning';
    if (score < 85) return 'Priority';
    return 'Lethal';
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-emerald-500';
    if (score < 70) return 'text-amber-500';
    if (score < 85) return 'text-rose-500';
    return 'text-rose-600 font-extrabold';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-emerald-500';
    if (score < 70) return 'bg-amber-500';
    if (score < 85) return 'bg-rose-500';
    return 'bg-rose-600 animate-pulse';
  };

  // Combine demo threats with real Firestore threats
  const allThreats = useMemo(() => {
    const demoThreats = [
      { id: 'demo-1', latitude: 28.6139, longitude: 77.2090, locationName: "New Delhi", harmScore: 96, aiSummary: "High CTA + Mismatch" },
      { id: 'demo-2', latitude: 19.0760, longitude: 72.8777, locationName: "Mumbai", harmScore: 82, aiSummary: "Emotional Intensity" },
      { id: 'demo-3', latitude: 12.9716, longitude: 77.5946, locationName: "Bengaluru", harmScore: 48, aiSummary: "Suspicious Links" },
    ];
    
    const dbThreats = (realThreats || []).filter(t => t.latitude && t.longitude);
    return [...demoThreats, ...dbThreats];
  }, [realThreats]);

  if (!isClient) {
    return (
      <div className="h-[600px] w-full bg-slate-900 flex items-center justify-center rounded-xl border border-border/50">
        <div className="text-center space-y-4">
          <Globe className="w-12 h-12 text-primary animate-spin mx-auto opacity-50" />
          <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">Initializing Satellite Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Live Threat Map</h2>
          <p className="text-muted-foreground">Tactical visualization using 70+ Priority Alert logic.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Globe className="w-3 h-3" />
            Surveillance Active
          </Badge>
          <Badge variant="outline" className="gap-1 bg-rose-500/10 text-rose-500 border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            {allThreats.filter(t => t.harmScore >= 70).length} Priority Hotspots
          </Badge>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden h-[650px] flex flex-col relative group">
        <CardHeader className="border-b border-border/10 bg-secondary/20 z-10 py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm flex items-center gap-2 uppercase tracking-widest font-bold">
              <Crosshair className="w-4 h-4 text-primary" />
              Regional Intelligence Grid
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] bg-background/50 border-primary/20">
                <Zap className="w-3 h-3 mr-1 text-accent" />
                Live Feed Sync
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative bg-[#020617] cursor-crosshair">
          <div className="absolute inset-0 z-0">
            <MapContainer 
              center={[20.5937, 78.9629]} 
              zoom={5} 
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {allThreats.map((threat) => (
                <Marker key={threat.id} position={[threat.latitude, threat.longitude]}>
                  <Popup className="custom-leaflet-popup">
                    <div className="p-4 w-64 space-y-3">
                      <div className="flex items-center justify-between border-b pb-2 border-border/20">
                        <span className="font-bold text-sm tracking-tight">{threat.locationName}</span>
                        <Badge 
                          variant="outline" 
                          className={`h-5 px-1.5 text-[9px] uppercase font-bold border-transparent ${
                            threat.harmScore > 85 ? 'bg-rose-600 text-white' : 
                            threat.harmScore >= 70 ? 'bg-rose-500/20 text-rose-500' : 
                            threat.harmScore > 30 ? 'bg-amber-500/20 text-amber-500' : 
                            'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {getRiskLabel(threat.harmScore)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground">
                          <span>Harm Index</span>
                          <span className={getRiskColor(threat.harmScore)}>{threat.harmScore}</span>
                        </div>
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full ${getRiskBg(threat.harmScore)}`} style={{ width: `${threat.harmScore}%` }} />
                        </div>
                      </div>

                      <div className="bg-secondary/30 p-2 rounded border border-border/10">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mb-1 flex items-center gap-1">
                          <Activity className="w-3 h-3 text-primary" />
                          Intel Summary
                        </p>
                        <p className="text-[10px] font-medium line-clamp-2">{threat.aiSummary}</p>
                      </div>

                      <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest bg-primary hover:bg-primary/90">
                        Detailed Intel
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="absolute bottom-6 left-6 z-10 p-5 rounded-2xl bg-card/90 backdrop-blur-md border border-primary/20 shadow-2xl w-64 space-y-4 pointer-events-auto">
             <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                <MapIcon className="w-4 h-4" />
                Aggregated Harm Index
             </div>
             <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                     <span className="text-muted-foreground">Northern Sector</span>
                     <span className="text-rose-500">88.4 Risk</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-rose-500" style={{ width: '88%' }} />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                     <span className="text-muted-foreground">Western Sector</span>
                     <span className="text-amber-500">54.2 Risk</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500" style={{ width: '54%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                     <span className="text-muted-foreground">Southern Sector</span>
                     <span className="text-emerald-500">18.9 Risk</span>
                  </div>
                  <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500" style={{ width: '19%' }} />
                  </div>
                </div>
             </div>
          </div>

          <div className="absolute top-4 right-4 z-10 p-4 rounded-xl bg-card/80 backdrop-blur-md border border-border/50 space-y-2.5 pointer-events-none">
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/10 pb-1 mb-2">Visual Glossary</p>
             <div className="flex items-center gap-2.5 text-[10px] font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.8)]" />
                <span>Lethal Threat (85+)</span>
             </div>
             <div className="flex items-center gap-2.5 text-[10px] font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Priority Alert (70-84)</span>
             </div>
             <div className="flex items-center gap-2.5 text-[10px] font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Warning State (30-69)</span>
             </div>
             <div className="flex items-center gap-2.5 text-[10px] font-bold">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Safe Corridor (0-29)</span>
             </div>
          </div>
        </CardContent>
      </Card>
      
      <style jsx global>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border));
          border-radius: 1rem;
          padding: 0;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: hsl(var(--card)) !important;
          border: 1px solid hsl(var(--border));
        }
        .leaflet-container {
          background-color: #020617 !important;
        }
      `}</style>
    </div>
  );
}
