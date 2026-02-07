
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Globe, Cpu, Zap, Loader2, Plus } from 'lucide-react';
import { improveThreatDetection } from '@/ai/flows/improve-threat-detection';
import { EMOTIONAL_KEYWORDS, CALL_TO_ACTION_KEYWORDS } from '@/lib/detection-constants';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface SettingsViewProps {
  badgeId?: string;
}

export function SettingsView({ badgeId }: SettingsViewProps) {
  const [isExpanding, setIsExpanding] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleExpandKeywords = async (type: 'Emotional Intensity' | 'Call to Action') => {
    setIsExpanding(true);
    try {
      const result = await improveThreatDetection({
        keywords: type === 'Emotional Intensity' ? EMOTIONAL_KEYWORDS : CALL_TO_ACTION_KEYWORDS,
        type
      });
      setSuggestions(result.suggestions);
      toast({ title: "Keywords Expanded", description: `Found ${result.suggestions.length} new tactical patterns.` });
    } catch (error) {
      toast({ variant: "destructive", title: "Expansion Failed", description: "AI core connectivity issues." });
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">System Configuration</h2>
          <p className="text-muted-foreground">Manage tactical intelligence parameters and AI calibration.</p>
        </div>
        <Badge variant="outline" className="h-8 gap-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
          <Cpu className="w-4 h-4" />
          Core: v4.2.0-Stable
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Officer Identity
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex flex-col items-center gap-4 py-4">
                    <div className="h-24 w-24 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center">
                       <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                       <p className="font-bold text-lg">Verified Officer</p>
                       <p className="text-xs text-muted-foreground font-mono">ID: {badgeId || 'SEC-0000'}</p>
                    </div>
                 </div>
                 <Button className="w-full" variant="outline">Update Bio-Signature</Button>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-500" />
                    Threat Expansion Agent
                 </CardTitle>
                 <CardDescription className="text-[10px]">AI-powered keyword discovery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                 <Button 
                   className="w-full gap-2 h-10" 
                   variant="secondary" 
                   disabled={isExpanding}
                   onClick={() => handleExpandKeywords('Call to Action')}
                 >
                   {isExpanding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
                   Expand CTA Library
                 </Button>
                 <Button 
                   className="w-full gap-2 h-10" 
                   variant="secondary"
                   disabled={isExpanding}
                   onClick={() => handleExpandKeywords('Emotional Intensity')}
                 >
                   {isExpanding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-blue-500" />}
                   Expand Emotional Intel
                 </Button>
              </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
           {suggestions.length > 0 && (
             <Card className="border-primary/20 bg-primary/5 animate-in slide-in-from-top-4">
               <CardHeader className="pb-2">
                 <CardTitle className="text-sm uppercase tracking-widest flex items-center justify-between">
                   AI Intelligence Suggestions
                   <Button variant="ghost" size="sm" onClick={() => setSuggestions([])} className="h-6 w-6 p-0">
                     <Plus className="w-4 h-4 rotate-45" />
                   </Button>
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="flex flex-wrap gap-2">
                   {suggestions.map((s, i) => (
                     <Badge key={i} variant="outline" className="bg-background/50 hover:bg-primary/10 cursor-pointer">
                       {s}
                     </Badge>
                   ))}
                 </div>
               </CardContent>
             </Card>
           )}

           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle>Autonomous Detection Engine</CardTitle>
                 <CardDescription>Configure prioritisation for tactical scanning.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-base">Real-time Global Scan</Label>
                       <p className="text-sm text-muted-foreground">Monitor high-traffic sectors autonomously.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <Separator className="bg-border/10" />
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-base">Visual AI Verification</Label>
                       <p className="text-sm text-muted-foreground">Trigger Genkit multimodal checks for context mismatches.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Tactical Notification Routing
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Intel Alert Recipient</Label>
                       <Input placeholder="officer@crisisguard.gov" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                       <Label>Regional Sector</Label>
                       <Input placeholder="Northern Sector 4" className="bg-background/50" />
                    </div>
                 </div>
                 <Button className="bg-primary hover:bg-primary/90">Commit Configuration</Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
