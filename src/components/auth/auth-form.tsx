'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Dirección de correo inválida.' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
});

const signupSchema = z.object({
  first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  email: z.string().email({ message: 'Dirección de correo inválida.' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
  password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Las contraseñas no coinciden.",
  path: ["password_confirmation"],
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === 'signup';
  const formSchema = isSignup ? signupSchema : loginSchema;

  const form = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isSignup ? {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    } : {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues | SignupFormValues) => {
    setIsLoading(true);
    try {
      if (isSignup) {
        const signupValues = values as SignupFormValues;
        
        // Primero, creamos el usuario en Firebase Authentication
        await createUserWithEmailAndPassword(
          auth,
          signupValues.email,
          signupValues.password
        );

        // Luego, preparamos el payload para tu API con la estructura solicitada
        const userPayload = {
          user: {
            email: signupValues.email,
            password: signupValues.password,
            password_confirmation: signupValues.password_confirmation,
            first_name: signupValues.first_name,
            last_name: signupValues.last_name,
          }
        };

        // Aquí puedes enviar los datos a tu API.
        // He descomentado y actualizado la línea de fetch.
        // Reemplaza '/api/your-endpoint' con la ruta real de tu API.
        /*
        const response = await fetch('/api/your-endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userPayload),
        });

        if (!response.ok) {
          // Si tu API falla, podrías querer manejar el error.
          // Por ejemplo, podrías eliminar el usuario recién creado de Firebase.
          throw new Error('Error al registrar el usuario en el sistema propio.');
        }
        */

        toast({
          title: '¡Cuenta creada!',
          description: 'Te has registrado exitosamente.',
        });
      } else {
        const loginValues = values as LoginFormValues;
        await signInWithEmailAndPassword(auth, loginValues.email, loginValues.password);
        toast({
          title: '¡Has iniciado sesión!',
          description: 'Bienvenido de nuevo.',
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error de Autenticación',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
       <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
              <Logo />
            </div>
            <CardTitle className="text-2xl">
              {isSignup ? 'Crea una Cuenta' : 'Bienvenido de Nuevo'}
            </CardTitle>
            <CardDescription>
              {isSignup
                ? 'Ingresa tus datos para registrarte.'
                : 'Ingresa tus credenciales para acceder a tu cuenta.'}
            </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isSignup && (
                <>
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input placeholder="Pérez" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tu@ejemplo.com"
                        {...field}
                        disabled={isLoading}
                      />
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
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isSignup && (
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSignup ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <>
                ¿No tienes una cuenta?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Regístrate
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Inicia Sesión
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
