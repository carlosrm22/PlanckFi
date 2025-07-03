
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2 } from "lucide-react";
import { getSavingsSuggestions } from "@/ai/flows/savings-suggestions";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AISuggestions() {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    
    const mockSpendingData = `
      - Comestibles: $450 MXN/mes
      - Alquiler: $1200 MXN/mes
      - Entretenimiento (Netflix, cine): $220 MXN/mes
      - Transporte (Gasolina, transporte público): $135 MXN/mes
      - Salud (Gimnasio, suplementos): $75 MXN/mes
    `;
    const mockFinancialGoals = "Ahorrar para el pago inicial de una casa en 2 años.";

    try {
      const result = await getSavingsSuggestions({
        spendingData: mockSpendingData,
        financialGoals: mockFinancialGoals,
      });
      setSuggestions(result.suggestions);
    } catch (e) {
      setError("No se pudieron obtener las sugerencias. Por favor, inténtalo de nuevo.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Asesor de Ahorros con IA
        </CardTitle>
        <CardDescription>Obtén consejos personalizados para alcanzar tus metas financieras más rápido.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          !suggestions && (
            <div className="text-center text-sm text-muted-foreground p-4 bg-secondary rounded-lg">
                Haz clic en el botón para obtener sugerencias de ahorro personalizadas por IA basadas en tus hábitos de gasto.
            </div>
          )
        )}
        
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestions && (
          <Alert>
            <AlertTitle>Tu Plan de Ahorro</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {suggestions}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? "Analizando..." : "Obtener Consejos de Ahorro"}
        </Button>
      </CardContent>
    </Card>
  );
}
