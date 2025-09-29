'use client';

import type { TransactionSummaryOutput } from '@/ai/flows/transaction-summary-and-categorization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lightbulb, RotateCcw } from 'lucide-react';

type AnalysisViewProps = {
  result: TransactionSummaryOutput;
  onReset: () => void;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function AnalysisView({ result, onReset }: AnalysisViewProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold font-headline">Analysis Results</h2>
        <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Run New Analysis
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{result.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorized Insights</CardTitle>
          <CardDescription>Here's how your spending breaks down across different categories.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.categorizedInsights.map((category) => (
            <div key={category.category}>
              <div className="mb-2 flex justify-between">
                <p className="font-medium">{category.category}</p>
                <p className="text-muted-foreground">
                  {currencyFormatter.format(category.totalAmount)} ({category.percentageOfTotal.toFixed(1)}%)
                </p>
              </div>
              <Progress value={category.percentageOfTotal} className="h-2" />
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                {category.examples.slice(0, 2).map((example, i) => (
                    <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent bg-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground">
            <Lightbulb className="text-accent" />
            Suggestions for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                <span className="text-muted-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
