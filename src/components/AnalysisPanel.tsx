"use client"

import React, { useState } from 'react';
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
  Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskMeter } from "./RiskMeter";
import { EMOTIONAL_KEYWORDS, CALL_TO_ACTION_KEYWORDS, SAMPLE_THREAT } from "@/lib/detection-constants";
import { summarizeRiskFactors } from "@/ai/flows/summarize-risk-factors";

export function AnalysisPanel() {
  const [message, setMessage] = useState('');
  const [contextMismatch, setContextMismatch] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    emotionalScore: number;
    ctaScore: number;
    mismatchScore: number;
    aiSummary: string;
  } | null>(null);

  const calculateHarmScore = (text: string, isMismatch: boolean) => {
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

    // Context Mismatch
    const mismatchScore = isMismatch ? 100 : 0;

    // Weighted Formula: (Emotional Intensity × 0.4) + (Call to Action × 0.4) + (Context Mismatch × 0.2)
    const finalScore = (emotionalScore * 0.4) + (ctaScore * 0.4) + (mismatchScore * 0.2);

    return { emotionalScore, ctaScore, mismatchScore, finalScore };
  };

  const handleAnalyze = async () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    const scores = calculateHarmScore(message, contextMismatch);

    try {
      const summary = await summarizeRiskFactors({
        messageText: message,
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
        aiSummary: "AI summary generation failed. Visual indicators show elevated threat levels based on linguistic markers."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = () => {
    setMessage(SAMPLE_THREAT.text);
    setContextMismatch(SAMPLE_THREAT.mismatch);
  };

  const reset = () => {
    setMessage('');
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
                <CardTitle className="text-xl">Analyze Suspicious Message</CardTitle>
                <CardDescription>Enter social media content for real-time risk assessment.</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSample}
                className="gap-2 text-xs h-8 border-primary/20 hover:bg-primary/10"
              >
                <Zap className="w-3 h-3 text-accent" />
                Load Sample Threat
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste suspicious text here..."
                className="min-h-[160px] resize-none bg-background/50 border-border focus:ring-primary/30 p-4 text-base"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded border">
                {message.length} characters
              </div>
            </div>

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
                  Context Mismatch <span className="text-muted-foreground font-normal">(Detected by Image Search)</span>
                </label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-2 text-xs text-muted-foreground hover:text-foreground"
                title="Use visual AI to verify context mismatch"
              >
                <Search className="w-3 h-3" />
                Verify with Image
              </Button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1 gap-2 h-12 text-lg font-bold shadow-lg shadow-primary/20" 
                disabled={!message.trim() || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Intelligence...
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    Calculate Harm Score
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
              <p className="text-sm text-muted-foreground">Submit a message to calculate its risk to real-world safety.</p>
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
                  Real-time Intelligence
                </div>
                <CardTitle>Threat Assessment Results</CardTitle>
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
                    <Badge variant={results.mismatchScore > 0 ? "destructive" : "secondary"}>
                      {results.mismatchScore === 100 ? "DETECTED" : "NONE"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm overflow-hidden bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-bottom-6">
              <CardHeader className="pb-2 bg-primary/5 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm uppercase tracking-wider font-bold">AI Risk Explanation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {results.aiSummary}
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Verified Analysis Engine
                  </div>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold gap-1 text-primary">
                    View Technical Details
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="border-border/50 bg-secondary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider">Detection Logic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">Harm Formula</p>
              <code className="block p-2 bg-background/80 rounded border font-code text-[10px]">
                Score = (Emotional × 0.4) + (CTA × 0.4) + (Context × 0.2)
              </code>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">Emotional Keys</p>
                <div className="flex flex-wrap gap-1">
                  {EMOTIONAL_KEYWORDS.slice(0, 4).map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-background border rounded">{k}</span>
                  ))}
                  <span>...</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium">CTA Keys</p>
                <div className="flex flex-wrap gap-1">
                  {CALL_TO_ACTION_KEYWORDS.slice(0, 4).map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-background border rounded">{k}</span>
                  ))}
                  <span>...</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
