// src/components/dashboard/financial-chart.tsx
"use client";

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { HistoricalDataPoint } from '@/types/game';
import { format, parseISO } from 'date-fns';

interface FinancialChartProps {
  data: HistoricalDataPoint[];
  title: string;
  description: string;
  dataKey: keyof HistoricalDataPoint; // 'netWorth', 'cash', etc.
  color: string; // HSL color string for the chart
}

export function FinancialChart({ data, title, description, dataKey, color }: FinancialChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1), // Capitalize (e.g. netWorth -> NetWorth)
      color: color,
    },
  } satisfies ChartConfig;

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Not enough data to display chart.</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedData = data.map(item => ({
    ...item,
    // Format date for XAxis tick display, e.g., 'Jan 24'
    date: format(parseISO(item.date), 'MMM yy'), 
  }));


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 5,
                right: 20,
                left: -10, // Adjust to make Y-axis labels visible
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} // Format as $10k, $20k
                domain={['auto', 'auto']} // Auto scale based on data
              />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" hideLabel />}
              />
              <Area
                dataKey={dataKey as string} // Recharts expects string here
                type="natural"
                fill={`hsl(var(--chart-1))`} // Use a chart color from theme
                fillOpacity={0.3}
                stroke={`hsl(var(--chart-1))`}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
