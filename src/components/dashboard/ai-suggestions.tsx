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
    
    // Mock spending data and financial goals for the AI
    const mockSpendingData = `
      - Groceries: $450/month
      - Rent: $1200/month
      - Entertainment (Netflix, movies): $220/month
      - Transport (Gas, public transit): $135/month
      - Health (Gym, supplements): $75/month
    `;
    const mockFinancialGoals = "Save for a down payment on a house within 2 years.";

    try {
      const result = await getSavingsSuggestions({
        spendingData: mockSpendingData,
        financialGoals: mockFinancialGoals,
      });
      setSuggestions(result.suggestions);
    } catch (e) {
      setError("Failed to get suggestions. Please try again.");
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
          AI Savings Advisor
        </CardTitle>
        <CardDescription>Get personalized tips to reach your financial goals faster.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          !suggestions && (
            <div className="text-center text-sm text-muted-foreground p-4 bg-secondary rounded-lg">
                Click the button to get AI-powered savings suggestions based on your spending habits.
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
            <AlertTitle>Your Savings Plan</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {suggestions}
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={handleGetSuggestions} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? "Analyzing..." : "Get Savings Tips"}
        </Button>
      </CardContent>
    </Card>
  );
}
