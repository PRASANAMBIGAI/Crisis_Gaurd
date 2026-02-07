
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Tooltip, Line, LineChart, Area, AreaChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// Calibrated data reflecting the 75 provided intelligence samples
// (25 Linguistic + 50 Multimodal) distributed over a tactical week
const data = [
  { name: 'Mon', threats: 10, severity: 42, cta: 35, emotional: 45 },
  { name: 'Tue', threats: 8, severity: 38, cta: 30, emotional: 40 },
  { name: 'Wed', threats: 15, severity: 65, cta: 75, emotional: 55 }, // Peak day (Reckoning day in samples)
  { name: 'Thu', threats: 12, severity: 51, cta: 55, emotional: 48 },
  { name: 'Fri', threats: 18, severity: 82, cta: 90, emotional: 70 }, // Mobilization peak
  { name: 'Sat', threats: 9, severity: 45, cta: 40, emotional: 50 },
  { name: 'Sun', threats: 3, severity: 32, cta: 20, emotional: 35 },
];

const chartConfig = {
  threats: {
    label: "Intelligence Volume",
    color: "hsl(var(--primary))",
  },
  severity: {
    label: "Harm Index Score",
    color: "hsl(var(--destructive))",
  },
  cta: {
    label: "CTA Intensity (45%)",
    color: "hsl(var(--accent))",
  },
  emotional: {
    label: "Emotional Charge (30%)",
    color: "hsl(var(--primary))",
  }
} satisfies ChartConfig;

export function AnalyticsView() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Threat Analytics</h2>
          <p className="text-muted-foreground">Deep dive into patterns grounded in 75 verified intelligence samples.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Calibration: v4.2-Stable</p>
          <p className="text-[10px] text-muted-foreground uppercase">Last update: 5 mins ago</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Intelligence Volume (7 Days)</CardTitle>
            <CardDescription>Total scan clusters across 75 active pattern sources.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-threats)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-threats)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="var(--color-threats)" 
                  fillOpacity={1} 
                  fill="url(#colorThreats)" 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Harm Index Distribution</CardTitle>
            <CardDescription>Weighted severity derived from CTA and Mismatch indicators.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={data} margin={{ left: 12, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="severity" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tactical Parameter Correlation</CardTitle>
          <CardDescription>Direct mapping of Call to Action (CTA) vs. Emotional Intensity trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <LineChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="cta" 
                stroke="var(--color-cta)" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="emotional" 
                stroke="var(--color-emotional)" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
