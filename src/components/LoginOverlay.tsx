
"use client"

import React, { useState } from 'react';
import { Shield, Loader2, Lock, BadgeCheck, Mail } from 'lucide-react';
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
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

interface LoginOverlayProps {
  onLoginSuccess: (badgeId: string) => void;
}

export function LoginOverlay({ onLoginSuccess }: LoginOverlayProps) {
  const auth = useAuth();
  const db = getFirestore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [department, setDepartment] = useState('cyber');

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          badgeId,
          department,
          role: 'Officer'
        });
        toast({ title: "Registration Successful", description: "Officer credentials verified." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Authentication Verified", description: "Access granted to tactical core." });
      }
      onLoginSuccess(badgeId);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials."
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="w-full h-1 bg-primary/50 absolute animate-[scan_4s_linear_infinite]" />
      </div>

      <Card className="w-full max-w-md border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        {isVerifying && (
          <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-primary font-bold tracking-widest uppercase text-sm animate-pulse">Verifying Digital Signature...</p>
          </div>
        )}

        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">CrisisGuard Tactical Core</CardTitle>
          <CardDescription className="uppercase text-[10px] tracking-[0.2em] font-bold text-muted-foreground">
            Regional Security Protocol v4.0
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleAuthenticate}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Email Intel</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="officer@crisisguard.gov" 
                  className="pl-10 bg-secondary/30"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider">Secure Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 bg-secondary/30"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Officer Badge ID</Label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="GUARD-XXXX-X" 
                      className="pl-10 bg-secondary/30"
                      required
                      value={badgeId}
                      onChange={(e) => setBadgeId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-secondary/30">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent className="z-[150]">
                      <SelectItem value="cyber">Cyber Cell</SelectItem>
                      <SelectItem value="intel">Strategic Intelligence</SelectItem>
                      <SelectItem value="info-ops">Information Operations</SelectItem>
                      <SelectItem value="counter-disinfo">Counter-Disinformation</SelectItem>
                      <SelectItem value="signal">Signal Intelligence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pb-8">
            <Button 
              type="submit" 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              disabled={isVerifying}
            >
              {isRegistering ? "Register Officer" : "Authenticate Access"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="text-xs"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have access? Sign In" : "New Intelligence Officer? Register"}
            </Button>
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
