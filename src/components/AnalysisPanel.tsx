
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
  Plus,
  MapPin,
  Crosshair,
  SearchCode
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskMeter } from "./RiskMeter";
import { EMOTIONAL_KEYWORDS, CALL_TO_ACTION_KEYWORDS, SAMPLE_CASES } from "@/lib/detection-constants";
import { summarizeRiskFactors, type SummarizeRiskFactorsOutput } from "@/ai/flows/summarize-risk-factors";
import { toast } from "@/hooks/use-toast";
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSourceTab, setActiveSourceTab] = useState('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [results, setResults] = useState<{
    score: number;
    emotionalScore: number;
    ctaScore: number;
    mismatchScore: number;
    aiData: SummarizeRiskFactorsOutput;
  } | null>(null);

  const calculateHarmScore = (text: string, isMismatch: boolean, attachmentCount: number) => {
    const lowerText = text.toLowerCase();
    
    // Parse text for rage/fear (Emotional Intensity)
    const emotionalMatches = EMOTIONAL_KEYWORDS.filter(kw => lowerText.includes(kw.toLowerCase()));
    let emotionalScore = Math.min(100, emotionalMatches.length * 35);
    if (emotionalMatches.length === 1) emotionalScore = 40;
    else if (emotionalMatches.length >= 3) emotionalScore = 100;

    // Identify commands like 'gather' or 'attack' (Call to Action)
    const ctaMatches = CALL_TO_ACTION_KEYWORDS.filter(kw => lowerText.includes(kw.toLowerCase()));
    let ctaScore = Math.min(100, ctaMatches.length * 40);
    if (ctaMatches.length === 1) ctaScore = 60;
    else if (ctaMatches.length >= 2) ctaScore = 100;

    // Recycled media flag (Context Mismatch)
    const mismatchScore = isMismatch ? 100 : (attachmentCount > 0 ? 20 : 0);
    
    // DECISION LOGIC: Harm Score = (Emotional Intensity × 0.4) + (Call to Action × 0.4) + (Context Mismatch × 0.2)
    const finalScore = (emotionalScore * 0.40) + (ctaScore * 0.40) + (mismatchScore * 0.20);

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
      const aiResult = await summarizeRiskFactors({
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
        aiSummary: aiResult.summary,
        causalReasoning: aiResult.causalReasoning,
        detectedCodedLanguage: aiResult.detectedCodedLanguage || [],
        officerId: user?.uid || 'anonymous',
        locationName: locationName || 'Unknown Sector',
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        attachments: attachments.map(({type, url, name}) => ({type, url, name}))
      };

      setDoc(doc(db, 'socialMediaMessages', analysisData.id), analysisData);

      setResults({
        score: scores.finalScore,
        emotionalScore: scores.emotionalScore,
        ctaScore: scores.ctaScore,
        mismatchScore: scores.mismatchScore,
        aiData: aiResult
      });

      if (scores.finalScore >= 70) {
        toast({ 
          title: "PRIORITY ALERT TRIGGERED", 
          description: "Harm Index exceeds 70. Immediate tactical response requested.",
          variant: "destructive"
        });
      } else {
        toast({ title: "Intelligence Saved", description: "Record archived and plotted on tactical grid." });
      }
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

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude.toFixed(4));
        setLongitude(position.coords.longitude.toFixed(4));
        toast({ title: "GPS Locked", description: "Coordinates synced from local sensor." });
      });
    } else {
      toast({ variant: "destructive", title: "GPS Error", description: "Local sensors unavailable." });
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-7 space-y-6">
        <Card className="border-border/50 shadow-sm bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/10">
            <CardTitle className="text-xl font-bold">Intelligence Intake</CardTitle>
            <CardDescription>Calibrated with 40/40/20 weighted decision logic.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Tabs value={activeSourceTab} onValueChange={setActiveSourceTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/30 mb-4">
                <TabsTrigger value="text" className="gap-2">Linguistic Analysis</TabsTrigger>
                <TabsTrigger value="media" className="gap-2">Multimodal Intake</TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <Textarea
                  placeholder="Paste suspicious content (X, WhatsApp, Telegram)..."
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

            <div className="space-y-4 p-4 rounded-xl bg-secondary/10 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs font-black uppercase tracking-[0.15em] text-primary flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Geospatial Intelligence
                </Label>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={useCurrentLocation}>
                  <Crosshair className="w-3 h-3" />
                  Auto-Locate
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Regional Sector / City</Label>
                  <Input 
                    placeholder="e.g. New Delhi" 
                    className="h-9 bg-background/50" 
                    value={locationName} 
                    onChange={(e) => setLocationName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Latitude</Label>
                    <Input 
                      placeholder="0.0000" 
                      className="h-9 bg-background/50 font-mono text-xs" 
                      value={latitude} 
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Longitude</Label>
                    <Input 
                      placeholder="0.0000" 
                      className="h-9 bg-background/50 font-mono text-xs" 
                      value={longitude} 
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-xl bg-secondary/20 border border-dashed border-primary/20">
              <Checkbox checked={contextMismatch} onCheckedChange={(c) => setContextMismatch(c === true)} />
              <label className="text-sm font-medium">Manual Context Mismatch <span className="text-muted-foreground">(Visual-Text Discrepancy)</span></label>
            </div>

            <Button className="w-full h-12 text-lg font-bold" disabled={isAnalyzing} onClick={handleAnalyze}>
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Shield className="w-5 h-5 mr-2" />}
              {isAnalyzing ? "Processing AI Causal Reasoning..." : "Run Intelligence Check"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-5 space-y-6">
        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <Card className="border-border/50 bg-card">
              <CardHeader><CardTitle>Harm Index Assessment</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <RiskMeter score={results.score} />
                <div className="grid gap-3">
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Emotional Volatility (40%)</span>
                    <Badge variant={results.emotionalScore >= 70 ? "destructive" : "secondary"}>{results.emotionalScore}/100</Badge>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">CTA Intensity (40%)</span>
                    <Badge variant={results.ctaScore >= 70 ? "destructive" : "secondary"}>{results.ctaScore}/100</Badge>
                  </div>
                  <div className="flex justify-between p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Context Mismatch (20%)</span>
                    <Badge variant={results.mismatchScore >= 70 ? "destructive" : "secondary"}>{results.mismatchScore}/100</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase font-black tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Tactical Causal Reasoning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Impact Summary</Label>
                  <p className="text-sm leading-relaxed">{results.aiData.summary}</p>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">Reasoning Analysis</Label>
                  <p className="text-sm italic leading-relaxed text-foreground/80">{results.aiData.causalReasoning}</p>
                </div>
                {results.aiData.detectedCodedLanguage && results.aiData.detectedCodedLanguage.length > 0 && (
                  <div className="pt-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground block mb-2 flex items-center gap-1">
                      <SearchCode className="w-3 h-3" />
                      Detected Dog-Whistles
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {results.aiData.detectedCodedLanguage.map((code, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] bg-background font-mono">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
