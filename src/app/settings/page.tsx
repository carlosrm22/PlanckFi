
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAppData } from '@/context/app-data-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre es obligatorio." }),
});

export default function SettingsPage() {
  const { user, updateUserProfile, isDemoMode } = useAppData();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isDemoMode) {
      toast({
        title: "Modo de Prueba",
        description: "Inicia sesión para gestionar tu perfil.",
        variant: "default",
      });
      router.push('/login');
    }
  }, [isDemoMode, router, toast]);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
      });
    }
  }, [user, form]);
  
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user || !updateUserProfile) return;
    try {
      await updateUserProfile({ displayName: values.name });
      toast({
        title: '¡Éxito!',
        description: 'Tu perfil ha sido actualizado.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar tu perfil. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  if (isDemoMode || !user) {
      return (
          <AppShell>
              <div className="flex h-[50vh] w-full items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
          </AppShell>
      );
  }

  return (
    <AppShell>
      <div className="grid gap-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona la configuración de tu cuenta y de la aplicación.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>
                  Esta es la información asociada a tu cuenta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" value={user?.email || ''} disabled />
                </FormItem>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar Cambios
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Elige qué notificaciones quieres recibir. (Funcionalidad no implementada)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                <div className="w-full sm:w-auto">
                    <p className="font-medium">Resumen semanal</p>
                    <p className="text-sm text-muted-foreground">Recibe un resumen de tu actividad por correo.</p>
                </div>
                <Switch id="weekly-summary" disabled />
             </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
                <div className="w-full sm:w-auto">
                    <p className="font-medium">Alertas de pagos pendientes</p>
                    <p className="text-sm text-muted-foreground">Recibe un aviso cuando un pago esté por vencer.</p>
                </div>
                <Switch id="bill-alerts" defaultChecked disabled />
             </div>
          </CardContent>
          <CardFooter>
            <Button disabled>Guardar Preferencias</Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
