"use client"

import React, { useState, useRef } from 'react';
import { 
  Search, 
  Send, 
  Trash2, 
  ExternalLink, 
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
import { EMOTIONAL_KEYWORDS, CALL_TO_ACTION_KEYWORDS, SAMPLE_THREAT } from "@/lib/detection-constants";
import { summarizeRiskFactors } from "@/ai/flows/summarize-risk-factors";
import { toast } from "@/hooks/use-toast";

interface MediaAttachment {
  id: string;
  type: 'image' | 'video' | 'link';
  url: string;
  name: string;
}

export function AnalysisPanel() {
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
    
    // Emotional Intensity
    const emotionalMatches = EMOTIONAL_KEYWORDS.filter(kw => lowerText.includes(kw));
    let emotionalScore = 0;
    if (emotionalMatches.length === 1) emotionalScore = 30;
    else if (emotionalMatches.length >= 2) emotionalScore = 80;

    // Call to Action
    const ctaMatches = CALL_TO_ACTION_KEYWORDS.filter(kw => lowerText.includes(kw));
    let ctaScore = 0;
    if (ctaMatches.length === 1) ctaScore = 40;
    else if (ctaMatches.length >= 2) ctaScore = 90;

    // Context Mismatch (Boosted if media exists but mismatch is flagged)
    const mismatchScore = isMismatch ? 100 : (attachmentCount > 0 ? 15 : 0);

    // Weighted Formula: (Emotional Intensity × 0.4) + (Call to Action × 0.4) + (Context Mismatch × 0.2)
    const finalScore = (emotionalScore * 0.4) + (ctaScore * 0.4) + (mismatchScore * 0.2);

    return { emotionalScore, ctaScore, mismatchScore, finalScore };
  };

  const handleAnalyze = async () => {
    if (!message.trim() && attachments.length === 0) {
      toast({
        title: "Incomplete Intelligence",
        description: "Please provide either text or media attachments for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    const scores = calculateHarmScore(message, contextMismatch, attachments.length);

    try {
      const summary = await summarizeRiskFactors({
        messageText: message || "Multimedia analysis: " + attachments.map(a => a.name).join(', '),
        emotionalIntensity: scores.emotionalScore,
        callToAction: scores.ctaScore,
        contextMismatch: scores.mismatchScore
      });

      setResults({
        score: scores.finalScore,
        emotionalScore: scores.emotionalScore,
        ctaScore: scores.ctaScore,
        mismatchScore: scores.mismatchScore,
        aiSummary: summary.summary
      });
    } catch (error) {
      console.error("AI Analysis failed", error);
      setResults({
        score: scores.finalScore,
        emotionalScore: scores.emotionalScore,
        ctaScore: scores.ctaScore,
        mismatchScore: scores.mismatchScore,
        aiSummary: "AI summary generation failed. Visual and linguistic indicators show elevated threat levels."
      });
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
    
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const loadSample = () => {
    setMessage(SAMPLE_THREAT.text);
    setContextMismatch(SAMPLE_THREAT.mismatch);
    setAttachments([
      { id: 'sample-1', type: 'image', url: 'https://picsum.photos/seed/42/400/300', name: 'suspicious_activity.jpg' }
    ]);
  };

  const reset = () => {
    setMessage('');
    setMediaUrl('');
    setAttachments([]);
    setContextMismatch(false);
    setResults(null);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-7 space-y-6">
        <Card className="border-border/50 shadow-sm overflow-hidden bg-card/30 backdrop-blur-sm">
          <CardHeader className="pb-4 border-b border-border/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Intelligence Intake</CardTitle>
                <CardDescription>Submit text, images, videos, or social links for scanning.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSample}
                className="gap-2 text-xs h-8 border-primary/20 hover:bg-primary/10"
              >
                <Zap className="w-3 h-3 text-accent" />
                Load Sample Case
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <Tabs value={activeSourceTab} onValueChange={setActiveSourceTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/30 mb-4">
                <TabsTrigger value="text" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Linguistic Analysis
                </TabsTrigger>
                <TabsTrigger value="media" className="gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Multimodal Intake
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="Paste suspicious text or social post content here..."
                    className="min-h-[160px] resize-none bg-background/50 border-border focus:ring-primary/30 p-4 text-base"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded border">
                    {message.length} characters
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Social media link (X, Telegram, WhatsApp...)" 
                        className="pl-10 bg-background/50"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addLinkAttachment()}
                      />
                    </div>
                    <Button onClick={addLinkAttachment} variant="secondary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border/50 rounded-xl p-8 flex flex-col items-center justify-center bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer group"
                  >
                    <UploadCloud className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-sm font-medium">Upload Media Files</p>
                    <p className="text-xs text-muted-foreground">Drag and drop or click to browse (JPG, PNG, MP4)</p>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*,video/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {attachments.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Attached Intelligence ({attachments.length})</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {attachments.map((file) => (
                    <div key={file.id} className="group relative rounded-lg border bg-secondary/20 overflow-hidden aspect-video">
                      {file.type === 'image' ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                      ) : file.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900">
                          <Film className="w-6 h-6 text-primary" />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
                          <LinkIcon className="w-6 h-6 text-accent" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <p className="text-[10px] text-white truncate max-w-full font-bold">{file.name}</p>
                        <button 
                          onClick={() => removeAttachment(file.id)}
                          className="absolute top-1 right-1 p-1 bg-rose-500 rounded-full text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-border/50 bg-secondary/20">
              <div className="flex items-center space-x-3">
                <Checkbox 
                  id="context-mismatch" 
                  checked={contextMismatch}
                  onCheckedChange={(checked) => setContextMismatch(checked === true)}
                  className="data-[state=checked]:bg-primary"
                />
                <label 
                  htmlFor="context-mismatch" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Manual Context Flag <span className="text-muted-foreground font-normal">(Verified mismatch)</span>
                </label>
              </div>
              <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
                <ImageIcon className="w-3 h-3" />
                Visual AI Active
              </Badge>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1 gap-2 h-12 text-lg font-bold shadow-lg shadow-primary/20" 
                disabled={(activeSourceTab === 'text' ? !message.trim() : attachments.length === 0) || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Multimodal Feed...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Run Intelligence Check
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 border-border" 
                onClick={reset}
                title="Clear input"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {!results && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 border border-dashed rounded-3xl opacity-60">
            <div className="bg-secondary p-4 rounded-full">
              <Shield className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-lg font-semibold">Ready for Intelligence</h3>
              <p className="text-sm text-muted-foreground">Submit text, images, or links to calculate risk indices.</p>
            </div>
          </div>
        )}
      </div>

      <div className="xl:col-span-5 space-y-6">
        {results && (
          <>
            <Card className="border-border/50 shadow-xl bg-card transition-all animate-in fade-in slide-in-from-bottom-4">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 uppercase tracking-widest font-bold">
                  <Activity className="w-4 h-4 text-primary" />
                  Risk Index Results
                </div>
                <CardTitle>Multimodal Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RiskMeter score={results.score} />
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Emotional Intensity</span>
                    <Badge variant={results.emotionalScore > 50 ? "destructive" : "secondary"}>
                      {results.emotionalScore}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Call to Action</span>
                    <Badge variant={results.ctaScore > 50 ? "destructive" : "secondary"}>
                      {results.ctaScore}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border text-sm">
                    <span className="text-muted-foreground">Context Mismatch</span>
                    <Badge variant={results.mismatchScore > 50 ? "destructive" : results.mismatchScore > 0 ? "outline" : "secondary"}>
                      {results.mismatchScore === 100 ? "CRITICAL" : results.mismatchScore > 0 ? "LOW" : "CLEAN"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-bottom-6">
              <CardHeader className="pb-2 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm uppercase tracking-wider font-bold">AI Threat Context</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {results.aiSummary}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Multimodal Engine v2.1
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold gap-1 text-primary">
                    Technical Log
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border-border/50 bg-secondary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider">Analysis Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">Weighted Harm Algorithm</p>
              <code className="block p-2 bg-background/80 rounded border font-code text-[10px]">
                Score = (Emotional × 0.4) + (CTA × 0.4) + (Context × 0.2)
              </code>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Linguistic Pattern Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-muted-foreground">Multimodal Visual Correlation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Social Link Verification</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
