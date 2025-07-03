'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const planckQuotes = [
  {
    quote: "La mayor recompensa por nuestro trabajo no es lo que nos pagan por él, sino aquello en lo que nos convierte.",
    author: "- Planck el Bulldog, Filósofo Financiero"
  },
  {
    quote: "Un presupuesto le dice a tu dinero a dónde ir, en lugar de preguntarte a dónde se fue.",
    author: "- Planck el Bulldog, Consejero Canino"
  },
  {
    quote: "No ahorres lo que queda después de gastar, sino gasta lo que queda después de ahorrar. ¡Y guarda un hueso para un día lluvioso!",
    author: "- Planck el Bulldog, Experto en Huesos"
  },
  {
    quote: "El interés compuesto es la octava maravilla del mundo. El que lo entiende, lo gana... el que no, lo paga. Y yo entiendo de siestas compuestas.",
    author: "- Planck el Bulldog, Maestro Zen Financiero"
  },
  {
    quote: "Cuidado con los pequeños gastos; una pequeña fuga hundirá un gran barco. O masticará un gran sofá.",
    author: "- Planck el Bulldog, Guardián del Sofá"
  }
];

export function WelcomeBanner() {
  const [activeQuote, setActiveQuote] = useState(planckQuotes[0]);

  useEffect(() => {
    // Selecciona una cita aleatoria en el lado del cliente para evitar desajustes de hidratación
    const randomIndex = Math.floor(Math.random() * planckQuotes.length);
    setActiveQuote(planckQuotes[randomIndex]);
  }, []); // El array de dependencias vacío asegura que esto se ejecute una vez al montar

  return (
    <Card className="flex flex-col md:flex-row items-stretch overflow-hidden">
      <div className="p-6 flex-1">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-3xl">¡Bienvenido de nuevo!</CardTitle>
          <CardDescription>Aquí está Planck, ¡listo para ayudarte a organizar tus finanzas!</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <blockquote className="border-l-2 pl-6 italic">
            "{activeQuote.quote}"
          </blockquote>
           <p className="text-sm text-muted-foreground mt-2 text-right">{activeQuote.author}</p>
        </CardContent>
      </div>
      <div className="w-full md:w-1/3 md:max-w-sm h-48 md:h-auto relative">
        <Image
          src="/images/planck.jpg"
          alt="El famoso Bulldog Planck"
          fill
          className="object-cover object-top"
          data-ai-hint="bulldog"
        />
      </div>
    </Card>
  );
}
