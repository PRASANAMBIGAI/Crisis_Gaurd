
"use client"

import React, { useState } from 'react';
import { Shield, Loader2, Lock, BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LoginOverlayProps {
  onLoginSuccess: () => void;
}

export function LoginOverlay({ onLoginSuccess }: LoginOverlayProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [badgeId, setBadgeId] = useState('');

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) return;

    setIsVerifying(true);
    
    // Simulate tactical authentication delay
    setTimeout(() => {
      setIsVerifying(false);
      setIsClosing(true);
      // Wait for fade-out animation
      setTimeout(onLoginSuccess, 500);
    }, 2000);
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 transition-opacity duration-500",
      "bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]",
      isClosing ? "opacity-0 pointer-events-none" : "opacity-100"
    )}>
      {/* Tactical scanner line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-1 bg-primary/50 absolute animate-[scan_4s_linear_infinite]" />
      </div>

      <Card className="w-full max-w-md border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {isVerifying && (
          <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <p className="text-primary font-bold tracking-widest uppercase text-sm animate-pulse">Verifying Credentials...</p>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase">Checking Global Guard Registry</p>
            </div>
          </div>
        )}

        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">CrisisGuard Auth</CardTitle>
          <CardDescription className="uppercase text-[10px] tracking-[0.2em] font-bold text-muted-foreground">
            Regional Security Protocol v4.0
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleAuthenticate}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="badge-id" className="text-xs uppercase tracking-wider">Officer Badge ID</Label>
              <div className="relative">
                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="badge-id" 
                  placeholder="GUARD-XXXX-X" 
                  className="pl-10 bg-secondary/30 border-primary/10 focus:border-primary/50"
                  required
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider">Secure Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-secondary/30 border-primary/10 focus:border-primary/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dept" className="text-xs uppercase tracking-wider">Department</Label>
              <Select defaultValue="cyber">
                <SelectTrigger className="bg-secondary/30 border-primary/10">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyber">Cyber Cell</SelectItem>
                  <SelectItem value="rapid">Rapid Action Force</SelectItem>
                  <SelectItem value="intel">Strategic Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
              disabled={isVerifying}
            >
              Authenticate Access
            </Button>
            <p className="text-rose-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">
              Restricted Access Only. Unauthorized attempts are logged.
            </p>
          </CardFooter>
        </form>
      </Card>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
