
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppData } from '@/context/app-data-context';

export function UserNav() {
  const { user, signOut } = useAppData();

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://firebasestorage.googleapis.com/v0/b/planckfi.firebasestorage.app/o/images%2FPlanckFi.jpg?alt=media&token=05df2e8d-44ed-4e3f-8c5a-661fbc8b81cf"
                alt="Avatar de invitado"
                data-ai-hint="bulldog"
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Modo de Prueba</p>
              <p className="text-xs leading-none text-muted-foreground">
                Los datos no se guardarán.
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/register">Registrarse</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'P';
    return email[0].toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-3 p-1 pr-2 h-auto rounded-lg focus-visible:ring-2 focus-visible:ring-ring">
            <div className="flex flex-col items-end">
                <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                </p>
            </div>
            <Avatar className="h-9 w-9">
                <AvatarImage
                src={user.photoURL ?? undefined}
                alt="Avatar de usuario"
                />
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || 'Usuario'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              Configuración
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Cerrar sesión
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
