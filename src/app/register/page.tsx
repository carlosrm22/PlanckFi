
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, writeBatch, doc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/icons';
import { initialCategoriesData } from '@/lib/data';

const registerSchema = z.object({
    email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

export default function RegisterPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        try {
            if (!auth || !db) {
                throw new Error("Firebase no está configurado.");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const batch = writeBatch(db);
            const categoriesCol = collection(db, 'users', user.uid, 'categories');
            initialCategoriesData.forEach(category => {
                const docRef = doc(categoriesCol); 
                batch.set(docRef, category);
            });
            await batch.commit();

            toast({
                title: '¡Cuenta creada con éxito!',
                description: 'Ya puedes iniciar sesión.',
            });

            router.push('/');
        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error al registrar',
                description: error.code === 'auth/email-already-in-use'
                ? 'Este correo electrónico ya está en uso.'
                : 'Ocurrió un error. Por favor, inténtalo de nuevo.',
            });
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
       <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Logo className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">PlanckFi</h1>
            </div>
          <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
          <CardDescription>Introduce tus datos para empezar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                 {form.formState.isSubmitting ? 'Creando...' : 'Crear Cuenta'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
