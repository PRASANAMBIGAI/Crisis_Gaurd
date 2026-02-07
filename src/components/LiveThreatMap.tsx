
"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, ShieldAlert, Globe, Crosshair, AlertTriangle } from 'lucide-react';

// Dynamically import Map components to prevent SSR errors (Leaflet requires window)
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

  useEffect(() => {
    setIsClient(true);
    // Fix for Leaflet default marker icons in Next.js
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

  const threats = [
    { id: 1, position: [28.6139, 77.2090], city: "New Delhi", level: "Critical", score: 92 },
    { id: 2, position: [19.0760, 72.8777], city: "Mumbai", level: "High", score: 78 },
    { id: 3, position: [12.9716, 77.5946], city: "Bengaluru", level: "Moderate", score: 45 },
    { id: 4, position: [13.0827, 80.2707], city: "Chennai", level: "High", score: 68 },
    { id: 5, position: [22.5726, 88.3639], city: "Kolkata", level: "Critical", score: 85 },
    { id: 6, position: [17.3850, 78.4867], city: "Hyderabad", level: "Moderate", score: 38 },
  ];

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
          <p className="text-muted-foreground">Real-time visualization of misinformation clusters and risk vectors across India.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Globe className="w-3 h-3" />
            Active Surveillance
          </Badge>
          <Badge variant="outline" className="gap-1 bg-rose-500/10 text-rose-500 border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            6 Hotspots Detected
          </Badge>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden h-[650px] flex flex-col relative group">
        <CardHeader className="border-b border-border/10 bg-secondary/20 z-10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-primary" />
              Tactical India Grid
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs bg-background/50">Reset View</Button>
              <Button variant="default" size="sm" className="h-8 text-xs">Sync Intelligence</Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 relative bg-[#020617] cursor-crosshair">
          {/* Leaflet Map Integration */}
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
              {threats.map((threat) => (
                <Marker key={threat.id} position={threat.position as [number, number]}>
                  <Popup className="custom-leaflet-popup">
                    <div className="p-3 w-48 space-y-2">
                      <div className="flex items-center justify-between border-b pb-1 border-border/20">
                        <span className="font-bold text-primary">{threat.city}</span>
                        <Badge variant="outline" className="h-4 px-1 text-[8px] bg-rose-500/10 text-rose-500 border-rose-500/20">
                          {threat.level}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Harm Score</span>
                        <span className="font-mono font-bold text-rose-500">{threat.score}</span>
                      </div>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${threat.score}%` }} />
                      </div>
                      <Button size="sm" className="w-full h-7 text-[10px] mt-1">Full Analysis</Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Map Controls Floating Overlay */}
          <div className="absolute bottom-6 left-6 z-10 p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border/50 shadow-2xl max-w-[240px] space-y-3 pointer-events-auto">
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                <MapIcon className="w-4 h-4" />
                Regional Risk
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-muted-foreground">Northern Sector</span>
                   <span className="font-bold text-rose-500">85%</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                </div>
                <div className="flex justify-between text-xs pt-1">
                   <span className="text-muted-foreground">Southern Sector</span>
                   <span className="font-bold text-amber-500">42%</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500" style={{ width: '42%' }} />
                </div>
             </div>
          </div>

          {/* Legend Overlay */}
          <div className="absolute top-4 right-4 z-10 p-3 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 space-y-2 pointer-events-none">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Visual Legend</p>
             <div className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span>Critical Threat</span>
             </div>
             <div className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Moderate Risk</span>
             </div>
             <div className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Active Surveillance</span>
             </div>
          </div>
        </CardContent>
      </Card>
      
      <style jsx global>{`
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid hsl(var(--border));
          border-radius: 0.75rem;
          padding: 0;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.5);
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
