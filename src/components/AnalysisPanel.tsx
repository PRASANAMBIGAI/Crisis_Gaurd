
"use client"

import React, { useState, useRef } from 'react';
import { 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Info,
  ChevronRight,
  Zap,
  Loader2,
  Activity,
  Shield,
  Image as ImageIcon,
  Film,
  Link as LinkIcon,
  UploadCloud,
  X,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskMeter } from "./RiskMeter";
import { EMOTIONAL_KEYWORDS, CALL_TO_ACTION_KEYWORDS, SAMPLE_CASES } from "@/lib/detection-constants";
import { summarizeRiskFactors } from "@/ai/flows/summarize-risk-factors";
import { toast } from "@/hooks/use-toast";
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  name: string;
}

export function AnalysisPanel() {
  const { user } = useUser();
  const db = getFirestore();
  const [message, setMessage] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [contextMismatch, setContextMismatch] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSourceTab, setActiveSourceTab] = useState('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [results, setResults] = useState<{
    score: number;
    emotionalScore: number;
    ctaScore: number;
    mismatchScore: number;
    aiSummary: string;
  } | null>(null);

  const calculateHarmScore = (text: string, isMismatch: boolean, attachmentCount: number) => {
    const lowerText = text.toLowerCase();
    const emotionalMatches = EMOTIONAL_KEYWORDS.filter(kw => lowerText.includes(kw.toLowerCase()));
    let emotionalScore = Math.min(100, emotionalMatches.length * 35);
    if (emotionalMatches.length === 1) emotionalScore = 40;
    else if (emotionalMatches.length >= 3) emotionalScore = 95;

    const ctaMatches = CALL_TO_ACTION_KEYWORDS.filter(kw => lowerText.includes(kw.toLowerCase()));
    let ctaScore = Math.min(100, ctaMatches.length * 40);
    if (ctaMatches.length === 1) ctaScore = 60;
    else if (ctaMatches.length >= 2) ctaScore = 100;

    const mismatchScore = isMismatch ? 100 : (attachmentCount > 0 ? 15 : 0);
    const finalScore = (emotionalScore * 0.30) + (ctaScore * 0.45) + (mismatchScore * 0.25);

    return { 
      emotionalScore: Math.round(emotionalScore), 
      ctaScore: Math.round(ctaScore), 
      mismatchScore: Math.round(mismatchScore), 
      finalScore: Math.min(100, Math.round(finalScore)) 
    };
  };

  const handleAnalyze = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({ title: "Incomplete Intelligence", description: "Provide text or media.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    const scores = calculateHarmScore(message, contextMismatch, attachments.length);

    try {
      const summaryResult = await summarizeRiskFactors({
        messageText: message || "Multimedia intake: " + attachments.map(a => a.name).join(', '),
        emotionalIntensity: scores.emotionalScore,
        callToAction: scores.ctaScore,
        contextMismatch: scores.mismatchScore
      });

      const analysisData = {
        id: Math.random().toString(36).substr(2, 9),
        text: message,
        emotionalIntensityScore: scores.emotionalScore,
        callToActionScore: scores.ctaScore,
        contextMismatchScore: scores.mismatchScore,
        harmScore: scores.finalScore,
        analysisDate: new Date().toISOString(),
        aiSummary: summaryResult.summary,
        officerId: user?.uid || 'anonymous',
        attachments: attachments.map(({type, url, name}) => ({type, url, name}))
      };

      // Save to persistent intelligence database (Firestore)
      setDoc(doc(db, 'socialMediaMessages', analysisData.id), analysisData);

      setResults({
        score: scores.finalScore,
        emotionalScore: scores.emotionalScore,
        ctaScore: scores.ctaScore,
        mismatchScore: scores.mismatchScore,
        aiSummary: summaryResult.summary
      });

      toast({ title: "Intelligence Saved", description: "Record archived in global threat log." });
    } catch (error) {
      toast({ variant: "destructive", title: "AI Analysis Failed", description: "Check tactical core connectivity." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAttachment: MediaAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          url: event.target?.result as string,
          name: file.name
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const addLinkAttachment = () => {
    if (!mediaUrl.trim()) return;
    const newAttachment: MediaAttachment = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'link',
      url: mediaUrl,
      name: mediaUrl.replace(/(^\w+:|^)\/\//, '').split('/')[0]
    };
    setAttachments(prev => [...prev, newAttachment]);
    setMediaUrl('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-7 space-y-6">
        <Card className="border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/10">
            <CardTitle className="text-xl font-bold">Intelligence Intake</CardTitle>
            <CardDescription>Calibrated with persistent pattern recognition.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Tabs value={activeSourceTab} onValueChange={setActiveSourceTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/30 mb-4">
                <TabsTrigger value="text" className="gap-2">Linguistic Analysis</TabsTrigger>
                <TabsTrigger value="media" className="gap-2">Multimodal Intake</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Paste suspicious content..."
                  className="min-h-[160px] bg-background/50 border-border p-4 text-base"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Social media link..." 
                      className="bg-background/50"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                    />
                    <Button onClick={addLinkAttachment} variant="secondary">Add Link</Button>
                  </div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Upload Evidence</p>
                    <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {attachments.map((file) => (
                  <div key={file.id} className="group relative rounded-lg border bg-secondary/20 overflow-hidden aspect-video">
                    {file.type === 'image' ? <img src={file.url} className="w-full h-full object-cover" /> : <Film className="m-auto w-6 h-6 text-primary" />}
                    <button onClick={() => setAttachments(p => p.filter(a => a.id !== file.id))} className="absolute top-1 right-1 p-1 bg-rose-500 rounded-full text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/20 border border-dashed">
              <Checkbox checked={contextMismatch} onCheckedChange={(c) => setContextMismatch(c === true)} />
              <label className="text-sm font-medium">Manual Context Mismatch <span className="text-muted-foreground">(Visual-Text Discrepancy)</span></label>
            </div>

            <Button className="w-full h-12 text-lg font-bold" disabled={isAnalyzing} onClick={handleAnalyze}>
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
              {isAnalyzing ? "Processing AI Verification..." : "Run Intelligence Check"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-5 space-y-6">
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <Card className="border-border/50 bg-card">
              <CardHeader><CardTitle>Threat Assessment</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <RiskMeter score={results.score} />
                <div className="grid gap-3">
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Emotional Intensity</span>
                    <Badge variant={results.emotionalScore > 50 ? "destructive" : "secondary"}>{results.emotionalScore}/100</Badge>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Call to Action (CTA)</span>
                    <Badge variant={results.ctaScore > 50 ? "destructive" : "secondary"}>{results.ctaScore}/100</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2"><CardTitle className="text-xs uppercase font-bold">AI Data Grounding</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{results.aiSummary}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
