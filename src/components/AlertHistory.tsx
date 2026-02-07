"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, CheckCircle2, MoreVertical, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Intelligence alerts derived from the 75 provided samples (25 Linguistic + 50 Multimodal)
const alerts = [
  { id: 'INT-048', timestamp: '1 min ago', message: 'THE SILENCE BEFORE THE STORM. Final preparations detected (Multimodal).', score: 98, status: 'Critical' },
  { id: 'INT-026', timestamp: '12 mins ago', message: 'CRITICAL MISMATCH: Peaceful park text vs. Militant riot gear visual.', score: 92, status: 'Critical' },
  { id: 'INT-016', timestamp: '45 mins ago', message: 'High Intensity: Infiltration warning - "Cleanse the system".', score: 85, status: 'High' },
  { id: 'INT-034', timestamp: '2 hours ago', message: 'MISMATCH DETECTED: Family camping vs. Explosives manufacturing.', score: 89, status: 'Critical' },
  { id: 'INT-022', timestamp: '4 hours ago', message: 'Threat Mobilization: "The Purge is coming. No mercy for the enemy".', score: 78, status: 'High' },
  { id: 'INT-005', timestamp: '6 hours ago', message: 'Mental Health Support: Community positive sentiment verified.', score: 8, status: 'Low' },
  { id: 'INT-001', timestamp: 'Yesterday', message: 'Normal Activity: Kindness campaign spread detected on X.', score: 5, status: 'Low' },
];

export function AlertHistory() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Intelligence Log</h2>
          <p className="text-muted-foreground">Historical records calibrated against 75 verified threat patterns.</p>
        </div>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10">
          Export Intelligence Report
        </Button>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                <TableHead className="w-[120px] uppercase tracking-tighter font-bold text-[10px]">Intel ID</TableHead>
                <TableHead className="uppercase tracking-tighter font-bold text-[10px]">Summary of Finding</TableHead>
                <TableHead className="uppercase tracking-tighter font-bold text-[10px]">Detection Time</TableHead>
                <TableHead className="uppercase tracking-tighter font-bold text-[10px]">Harm Index</TableHead>
                <TableHead className="uppercase tracking-tighter font-bold text-[10px]">Threat Level</TableHead>
                <TableHead className="text-right uppercase tracking-tighter font-bold text-[10px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="border-border/10 group hover:bg-secondary/10 transition-colors">
                  <TableCell className="font-mono text-[10px] font-bold text-primary">{alert.id}</TableCell>
                  <TableCell className="max-w-[400px] truncate font-medium text-sm">{alert.message}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground font-medium">{alert.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                           className={`h-full transition-all duration-1000 ${
                             alert.score > 85 ? 'bg-rose-600 shadow-[0_0_8px_rgba(225,29,72,0.5)]' : 
                             alert.score > 60 ? 'bg-rose-500' : 
                             alert.score > 30 ? 'bg-amber-500' : 
                             'bg-emerald-500'
                           }`} 
                           style={{ width: `${alert.score}%` }} 
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${
                        alert.score > 85 ? 'text-rose-600' : 
                        alert.score > 60 ? 'text-rose-500' : 
                        alert.score > 30 ? 'text-amber-500' : 
                        'text-emerald-500'
                      }`}>{alert.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`gap-1 h-6 text-[9px] uppercase font-bold tracking-widest ${
                        alert.status === 'Critical' ? 'bg-rose-600 text-white border-transparent' : 
                        alert.status === 'High' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        alert.status === 'Low' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}
                    >
                      {alert.status === 'Critical' ? <ShieldAlert className="w-3 h-3" /> : alert.status === 'Low' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border/50 bg-secondary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
             <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">Calibration Active</p>
            <p className="text-[10px] text-muted-foreground uppercase font-medium">Log sync grounded in 75 localized patterns.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-[10px] font-bold">25 Linguistic Cases</Badge>
          <Badge variant="secondary" className="text-[10px] font-bold">50 Multimodal Cases</Badge>
        </div>
      </div>
    </div>
  );
}
