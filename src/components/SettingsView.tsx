
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, Globe, Cpu } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">System Configuration</h2>
        <p className="text-muted-foreground">Manage your intelligence officer profile and detection preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Profile
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex flex-col items-center gap-4 py-4">
                    <div className="h-24 w-24 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center">
                       <User className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                       <p className="font-bold text-lg">Intelligence Officer</p>
                       <p className="text-xs text-muted-foreground">ID: GUARD-9921-X</p>
                    </div>
                 </div>
                 <Button className="w-full" variant="outline">Update Avatar</Button>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Authentication
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 <p className="text-xs text-muted-foreground">Your session is secured with Grade-A encryption.</p>
                 <Button className="w-full" variant="secondary">Change Access Code</Button>
              </CardContent>
           </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle>Detection Engine Preferences</CardTitle>
                 <CardDescription>Configure how the AI prioritizes potential threats.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-base">Real-time Scanning</Label>
                       <p className="text-sm text-muted-foreground">Analyze messages as they appear on the global feed.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <Separator className="bg-border/10" />
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-base">Deep Context Verification</Label>
                       <p className="text-sm text-muted-foreground">Automatically trigger image-text cross-referencing AI.</p>
                    </div>
                    <Switch defaultChecked />
                 </div>
                 <Separator className="bg-border/10" />
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                       <Label className="text-base">Aggressive Threat Scoring</Label>
                       <p className="text-sm text-muted-foreground">Lower the threshold for High Priority alerts.</p>
                    </div>
                    <Switch />
                 </div>
              </CardContent>
           </Card>

           <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
              <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notification Routing
                 </CardTitle>
                 <CardDescription>Where should intelligence alerts be sent?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="intel-email">Primary Intel Email</Label>
                       <Input id="intel-email" placeholder="officer@crisisguard.gov" className="bg-background/50" />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="intel-freq">Alert Frequency</Label>
                       <Input id="intel-freq" placeholder="Immediate" className="bg-background/50" />
                    </div>
                 </div>
                 <Button className="bg-primary hover:bg-primary/90">Save Preferences</Button>
              </CardContent>
           </Card>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-blue-500/5 border-blue-500/10 p-4 flex items-center gap-4">
                 <Globe className="w-8 h-8 text-blue-500 opacity-50" />
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">API Status</p>
                    <p className="font-bold">Active Connect</p>
                 </div>
              </Card>
              <Card className="bg-emerald-500/5 border-emerald-500/10 p-4 flex items-center gap-4">
                 <Cpu className="w-8 h-8 text-emerald-500 opacity-50" />
                 <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">AI Core</p>
                    <p className="font-bold">v4.2.0-Stable</p>
                 </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
