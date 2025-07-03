
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, ScanLine, Loader2, Upload } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAppData } from '@/context/app-data-context';
import { scanReceipt } from '@/ai/flows/scan-receipt-flow';

export default function ScanReceiptPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addTransaction } = useAppData();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'camera' | 'upload' | null>(null);

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
  }, []);

  const processReceipt = async (photoDataUri: string) => {
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
        description: 'No se pudo procesar el recibo. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }

  const handleScanReceipt = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoadingAction('camera');
    setIsLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) {
        setIsLoading(false);
        setLoadingAction(null);
        return;
    };
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL('image/jpeg');
    
    await processReceipt(photoDataUri);
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadingAction('upload');
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
        const photoDataUri = e.target?.result as string;
        if (!photoDataUri) {
            toast({
                variant: 'destructive',
                title: 'Error de archivo',
                description: 'No se pudo leer el archivo seleccionado.',
            });
            setIsLoading(false);
            setLoadingAction(null);
            return;
        }
        await processReceipt(photoDataUri);
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error de archivo',
            description: 'Hubo un problema al leer el archivo.',
        });
        setIsLoading(false);
        setLoadingAction(null);
    };
    reader.readAsDataURL(file);
    
    event.target.value = ''; 
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
              Apunta con tu cámara a un recibo o sube una imagen para añadir la transacción automáticamente.
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
                  <p className="text-center font-semibold">
                    {loadingAction === 'camera' ? 'Analizando recibo...' : 'Procesando imagen...'}
                  </p>
                  <p className="text-center text-sm">La IA está extrayendo los datos.</p>
                </div>
               )}
            </div>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                className="hidden" 
                accept="image/png, image/jpeg, image/webp" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Button 
                    onClick={handleScanReceipt} 
                    disabled={hasCameraPermission !== true || isLoading} 
                    className="w-full"
                    size="lg"
                >
                    {isLoading && loadingAction === 'camera' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Escaneando...
                        </>
                    ) : (
                         <>
                            <Camera className="mr-2 h-4 w-4" />
                            Escanear con Cámara
                        </>
                    )}
                </Button>
                 <Button 
                    onClick={handleUploadClick} 
                    disabled={isLoading} 
                    variant="outline"
                    className="w-full"
                    size="lg"
                >
                    {isLoading && loadingAction === 'upload' ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                        </>
                    ) : (
                         <>
                            <Upload className="mr-2 h-4 w-4" />
                            Subir Archivo
                        </>
                    )}
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
