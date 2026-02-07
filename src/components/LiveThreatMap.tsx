
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, ShieldAlert, Globe, Crosshair } from 'lucide-react';
import Image from 'next/image';

export function LiveThreatMap() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Live Threat Map</h2>
          <p className="text-muted-foreground">Real-time visualization of misinformation clusters and risk vectors.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Globe className="w-3 h-3" />
            Global Scan Active
          </Badge>
          <Badge variant="outline" className="gap-1 bg-rose-500/10 text-rose-500 border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            3 High Priority Threats
          </Badge>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden min-h-[500px] flex flex-col">
        <CardHeader className="border-b border-border/10 bg-secondary/20">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Crosshair className="w-5 h-5 text-primary" />
              Tactical Visualization
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">Zoom Out</Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">Zoom In</Button>
              <Button variant="default" size="sm" className="h-8 text-xs">Refresh Intel</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative bg-slate-900 overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-40">
             <Image 
                src="https://picsum.photos/seed/map/1200/800" 
                alt="Tactical Map" 
                fill 
                className="object-cover grayscale contrast-125"
                data-ai-hint="world map"
             />
          </div>
          
          {/* Animated Map Overlay Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Pulsing hotspots */}
            <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-rose-500/20 rounded-full animate-ping" />
            <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
            
            <div className="absolute top-2/3 left-1/2 w-16 h-16 bg-amber-500/20 rounded-full animate-pulse" />
            <div className="absolute top-2/3 left-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]" />

            <div className="absolute top-1/2 left-3/4 w-8 h-8 bg-blue-500/20 rounded-full animate-ping" />
            <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>

          {/* Map Controls Floating Overlay */}
          <div className="absolute bottom-6 left-6 p-4 rounded-xl bg-card/80 backdrop-blur-md border border-border/50 shadow-2xl max-w-xs space-y-3">
             <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary">
                <MapIcon className="w-4 h-4" />
                Active Sectors
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-muted-foreground">Southeast Asia</span>
                   <span className="font-bold text-rose-500">CRITICAL</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500" style={{ width: '85%' }} />
                </div>
                <div className="flex justify-between text-xs pt-1">
                   <span className="text-muted-foreground">Eastern Europe</span>
                   <span className="font-bold text-amber-500">WARNING</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                   <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                </div>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from './ui/button';
