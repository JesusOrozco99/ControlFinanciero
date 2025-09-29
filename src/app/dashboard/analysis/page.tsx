'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { runAnalysis } from '@/lib/actions';
import type { TransactionSummaryOutput } from '@/ai/flows/transaction-summary-and-categorization';
import { AnalysisView } from '@/components/analysis/analysis-view';
import { useToast } from '@/hooks/use-toast';

export default function AnalysisPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<TransactionSummaryOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await runAnalysis();
      setAnalysisResult(result);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: e.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">AI-Powered Transaction Analysis</h1>
      
      {!analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Unlock Financial Insights</CardTitle>
            <CardDescription>
              Use the power of Generative AI to get a summary of your recent transactions, categorize your spending, and receive personalized suggestions for financial improvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAnalysis} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze My Transactions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Analysis Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <AnalysisView result={analysisResult} onReset={() => setAnalysisResult(null)} />
      )}
    </div>
  );
}
