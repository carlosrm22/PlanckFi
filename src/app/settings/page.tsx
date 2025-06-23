import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="grid gap-8 max-w-2xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona la configuración de tu cuenta y de la aplicación.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Esta información se mostrará públicamente.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" defaultValue="Usuario" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="usuario@example.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Guardar Cambios</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Elige qué notificaciones quieres recibir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Resumen semanal</p>
                    <p className="text-sm text-muted-foreground">Recibe un resumen de tu actividad por correo.</p>
                </div>
                <Switch id="weekly-summary" />
             </div>
             <div className="flex items-center justify-between">
                <div>
                    <p className="font-medium">Alertas de facturas</p>
                    <p className="text-sm text-muted-foreground">Recibe un aviso cuando una factura esté por vencer.</p>
                </div>
                <Switch id="bill-alerts" defaultChecked/>
             </div>
          </CardContent>
          <CardFooter>
            <Button>Guardar Preferencias</Button>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  );
}
