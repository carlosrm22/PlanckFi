'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";

export function BudgetExplanation() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="font-semibold">¿Qué es un presupuesto y por qué lo necesito?</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 text-muted-foreground p-2">
          <p>
            Un presupuesto es simplemente un plan para tu dinero. Te ayuda a controlar tus finanzas, en lugar de que ellas te controlen a ti.
          </p>
          <h4 className="font-semibold text-card-foreground">¿Para qué sirve?</h4>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Tomar el control:</strong> Saber a dónde va tu dinero te da poder sobre tus decisiones financieras.</li>
            <li><strong>Alcanzar metas:</strong> Ya sea ahorrar para un viaje, un auto nuevo o el pago inicial de una casa, un presupuesto es tu hoja de ruta.</li>
            <li><strong>Evitar deudas:</strong> Al planificar tus gastos, es menos probable que gastes más de lo que ganas y recurras a créditos.</li>
            <li><strong>Reducir el estrés:</strong> La incertidumbre financiera es una gran fuente de estrés. Un presupuesto te da claridad y tranquilidad.</li>
          </ul>
           <h4 className="font-semibold text-card-foreground">¿Cómo empiezo?</h4>
           <ol className="list-decimal pl-6 space-y-1">
            <li><strong>Calcula tus ingresos:</strong> Suma todo el dinero que recibes cada mes (salario, trabajos extra, etc.).</li>
            <li><strong>Registra tus gastos:</strong> Durante un mes, anota cada gasto. Usa esta app para que sea más fácil.</li>
            <li><strong>Clasifica y analiza:</strong> Agrupa tus gastos en categorías (Comida, Transporte, Ocio) para ver a dónde se va el dinero.</li>
            <li><strong>Establece metas de gasto:</strong> Define un límite de gasto para cada categoría. ¡Sé realista!</li>
            <li><strong>Revisa y ajusta:</strong> Tu presupuesto no está escrito en piedra. Revísalo cada mes y ajústalo según tus necesidades.</li>
           </ol>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
