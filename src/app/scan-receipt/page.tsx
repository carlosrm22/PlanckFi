
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ScanLine, Loader2, PartyPopper } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAppData } from '@/context/app-data-context';
import { scanReceipt } from '@/ai/flows/scan-receipt-flow';

export default function ScanReceiptPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addTransaction } = useAppData();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Acceso a la cámara denegado',
          description: 'Por favor, activa los permisos de la cámara en la configuración de tu navegador para usar esta aplicación.',
        });
      }
    };
    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleScanReceipt = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    setScannedData(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await scanReceipt({ photoDataUri });
      addTransaction({
        ...result,
        amount: -Math.abs(result.amount),
        type: 'expense'
      });
      toast({
        title: '¡Éxito!',
        description: 'La transacción del recibo ha sido añadida.',
      });
      router.push('/transactions');
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error al escanear',
        description: 'No se pudo procesar el recibo. Por favor, inténtalo de nuevo con mejor iluminación.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-6 w-6" />
              Escanear Recibo
            </CardTitle>
            <CardDescription>
              Apunta con tu cámara a un recibo para añadir la transacción automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
              <canvas ref={canvasRef} className="hidden"></canvas>
              {hasCameraPermission === false && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                  <Camera className="h-12 w-12 mb-4" />
                  <p className="text-center font-semibold">Acceso a la cámara necesario</p>
                  <p className="text-center text-sm">Por favor, permite el acceso a la cámara para continuar.</p>
                </div>
              )}
               {isLoading && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4 backdrop-blur-sm">
                  <Loader2 className="h-12 w-12 animate-spin mb-4" />
                  <p className="text-center font-semibold">Analizando recibo...</p>
                  <p className="text-center text-sm">La IA está extrayendo los datos.</p>
                </div>
               )}
            </div>
             <Button 
                onClick={handleScanReceipt} 
                disabled={hasCameraPermission !== true || isLoading} 
                className="w-full"
                size="lg"
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Escaneando...
                    </>
                ) : (
                     <>
                        <Camera className="mr-2 h-4 w-4" />
                        Escanear Recibo
                    </>
                )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
