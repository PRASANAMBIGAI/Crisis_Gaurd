
"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, AlertTriangle, CheckCircle2, Eye, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

export function AlertHistory() {
  const db = useFirestore();
  const messagesQuery = React.useMemo(() => query(collection(db, 'socialMediaMessages'), orderBy('analysisDate', 'desc')), [db]);
  const { data: alerts, isLoading } = useCollection(messagesQuery as any);

  const exportReport = () => {
    if (!alerts || alerts.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Summary,Date,Score,Status"].join(",") + "\n"
      + alerts.map(a => `${a.id},"${a.text.slice(0, 50)}...",${a.analysisDate},${a.harmScore},${a.harmScore > 60 ? 'High' : 'Low'}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "crisisguard_intel_report.csv");
    document.body.appendChild(link);
    link.click();
    toast({ title: "Intelligence Exported", description: "CSV tactical briefing generated." });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Intelligence Log</h2>
          <p className="text-muted-foreground">Historical records archived in the tactical cloud database.</p>
        </div>
        <Button onClick={exportReport} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/10">
          <Download className="w-4 h-4" />
          Export Intelligence Briefing
        </Button>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/20">
                <TableHead className="w-[120px] text-[10px] font-bold">Intel ID</TableHead>
                <TableHead className="text-[10px] font-bold">Summary</TableHead>
                <TableHead className="text-[10px] font-bold">Timestamp</TableHead>
                <TableHead className="text-[10px] font-bold">Harm Index</TableHead>
                <TableHead className="text-[10px] font-bold">Threat Level</TableHead>
                <TableHead className="text-right text-[10px] font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Accessing Encrypted Records...</TableCell></TableRow>
              ) : alerts?.map((alert) => (
                <TableRow key={alert.id} className="border-border/10 hover:bg-secondary/10">
                  <TableCell className="font-mono text-[10px] font-bold text-primary">{alert.id}</TableCell>
                  <TableCell className="max-w-[300px] truncate font-medium text-sm">{alert.text}</TableCell>
                  <TableCell className="text-[10px] text-muted-foreground">{new Date(alert.analysisDate).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full ${alert.harmScore > 85 ? 'bg-rose-600' : alert.harmScore > 60 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${alert.harmScore}%` }} />
                      </div>
                      <span className="text-[10px] font-bold">{alert.harmScore}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`h-6 text-[9px] uppercase ${alert.harmScore > 85 ? 'bg-rose-600 text-white' : alert.harmScore > 60 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {alert.harmScore > 85 ? <ShieldAlert className="w-3 h-3 mr-1" /> : alert.harmScore > 60 ? <AlertTriangle className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {alert.harmScore > 85 ? 'Critical' : alert.harmScore > 60 ? 'High' : 'Low'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
