import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function WelcomeBanner() {
  return (
    <Card className="flex flex-col md:flex-row items-stretch overflow-hidden">
      <div className="p-6 flex-1">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-3xl">¡Bienvenido de nuevo!</CardTitle>
          <CardDescription>Aquí está Planck, ¡listo para ayudarte a organizar tus finanzas!</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <blockquote className="border-l-2 pl-6 italic">
            "La mayor recompensa por nuestro trabajo no es lo que nos pagan por él, sino aquello en lo que nos convierte."
          </blockquote>
           <p className="text-sm text-muted-foreground mt-2 text-right">- Planck el Bulldog, Filósofo Financiero</p>
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
