
"use client"

import React from 'react';
import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
  className?: string;
}

export function RiskMeter({ score, className }: RiskMeterProps) {
  const getProgressColor = (val: number) => {
    if (val < 30) return "bg-emerald-500";
    if (val < 70) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getTextColor = (val: number) => {
    if (val < 30) return "text-emerald-500";
    if (val < 70) return "text-amber-500";
    return "text-rose-500";
  };

  const getRiskLabel = (val: number) => {
    if (val === 0 && score === 0) return "Scanning...";
    if (val < 30) return "Safe Corridor";
    if (val < 70) return "Warning Level";
    if (val < 85) return "Priority Threat";
    return "Lethal Incitement";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Harm Index</p>
          <h3 className={cn("text-5xl font-bold transition-colors duration-500", getTextColor(score))}>
            {Math.round(score)}
          </h3>
        </div>
        <div className="text-right">
          <p className={cn("text-lg font-bold transition-colors duration-500", getTextColor(score))}>
            {getRiskLabel(score)}
          </p>
        </div>
      </div>
      
      <div className="h-4 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000 ease-out", getProgressColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
        <span>Safe (0-29)</span>
        <span>Warning (30-69)</span>
        <span>Priority (70-84)</span>
        <span>Lethal (85+)</span>
      </div>
    </div>
  );
}
