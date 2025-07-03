
'use server';

/**
 * @fileOverview Un agente de IA que escanea recibos y extrae información de transacciones.
 * 
 * - scanReceipt - Una función que procesa la imagen de un recibo y devuelve datos estructurados de la transacción.
 * - ScanReceiptInput - El tipo de entrada para la función scanReceipt.
 * - ScanReceiptOutput - El tipo de retorno para la función scanReceipt.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initialCategoriesData as appCategories } from '@/lib/data';

// Dynamically create category list for prompt and schema description
const expenseCategoriesList = appCategories
  .filter(c => c.name !== 'Ingresos')
  .map(c => c.name);
const promptCategoryList = [...expenseCategoriesList].join(', ');

const ScanReceiptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Una foto de un recibo, como un data URI que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanReceiptInput = z.infer<typeof ScanReceiptInputSchema>;

const ScanReceiptOutputSchema = z.object({
  description: z.string().describe('El nombre de la tienda o proveedor.'),
  amount: z.number().describe('El monto total de la transacción.'),
  date: z
    .string()
    .describe(
      'La fecha de la transacción en formato YYYY-MM-DD. Infiere el año actual si no está presente.'
    ),
  category: z
    .string()
    .describe(
      `Sugiere la categoría más apropiada de la siguiente lista: ${promptCategoryList}.`
    ),
});
export type ScanReceiptOutput = z.infer<typeof ScanReceiptOutputSchema>;

export async function scanReceipt(
  input: ScanReceiptInput
): Promise<ScanReceiptOutput> {
  return scanReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanReceiptPrompt',
  input: { schema: ScanReceiptInputSchema },
  output: { schema: ScanReceiptOutputSchema },
  prompt: `Eres un asistente financiero experto. Analiza la siguiente imagen de recibo y extrae la siguiente información:
- El nombre de la tienda o proveedor como 'description'.
- El monto total de la transacción como 'amount'.
- La fecha de la transacción en formato YYYY-MM-DD como 'date'. Si el año no está en el recibo, asume el año actual.
- Sugiere una categoría adecuada para esta compra de la siguiente lista como 'category': ${promptCategoryList}. Si ninguna categoría coincide, usa 'Otros'.

Imagen del Recibo: {{media url=photoDataUri}}`,
});

const scanReceiptFlow = ai.defineFlow(
  {
    name: 'scanReceiptFlow',
    inputSchema: ScanReceiptInputSchema,
    outputSchema: ScanReceiptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
