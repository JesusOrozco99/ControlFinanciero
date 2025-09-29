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
      setError(e.message || 'Ocurrió un error inesperado.');
      toast({
        variant: 'destructive',
        title: 'Falló el Análisis',
        description: e.message || 'Ocurrió un error inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Análisis de Transacciones con IA</h1>
      
      {!analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>Desbloquea Información Financiera</CardTitle>
            <CardDescription>
              Usa el poder de la IA Generativa para obtener un resumen de tus transacciones recientes, categorizar tus gastos y recibir sugerencias personalizadas para mejorar tus finanzas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAnalysis} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analizar Mis Transacciones
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">Error de Análisis</CardTitle>
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
