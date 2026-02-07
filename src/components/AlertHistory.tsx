
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert, CheckCircle2, MoreVertical, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";

const alerts = [
  { id: 'AL-1024', timestamp: '2 mins ago', message: 'Mass gathering detected near Sector 4.', score: 88, status: 'Critical' },
  { id: 'AL-1023', timestamp: '15 mins ago', message: 'Viral disinformation regarding water supply.', score: 45, status: 'Moderate' },
  { id: 'AL-1022', timestamp: '1 hour ago', message: 'Suspicious bot activity detected on Platform X.', score: 62, status: 'High' },
  { id: 'AL-1021', timestamp: '3 hours ago', message: 'Context verified: Misleading image flagged.', score: 91, status: 'Critical' },
  { id: 'AL-1020', timestamp: '5 hours ago', message: 'Regional instability rumors verified false.', score: 12, status: 'Low' },
];

export function AlertHistory() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Alert History</h2>
          <p className="text-muted-foreground">Review and manage past intelligence notifications.</p>
        </div>
        <Button variant="outline" className="gap-2">
          Export Intelligence Report
        </Button>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                <TableHead className="w-[120px]">Alert ID</TableHead>
                <TableHead>Message Summary</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Harm Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id} className="border-border/10">
                  <TableCell className="font-mono text-xs font-bold text-primary">{alert.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate font-medium">{alert.message}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{alert.timestamp}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                           className={`h-full ${alert.score > 70 ? 'bg-rose-500' : alert.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                           style={{ width: `${alert.score}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold">{alert.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`gap-1 ${
                        alert.status === 'Critical' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                        alert.status === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {alert.status === 'Critical' ? <ShieldAlert className="w-3 h-3" /> : alert.status === 'Low' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
