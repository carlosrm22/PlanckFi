
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, PlusCircle, MoreHorizontal, Pencil, Trash2, Paperclip, Camera, Upload, XCircle, AlertCircle, FileSpreadsheet, Search, Plus } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useAppData } from '@/context/app-data-context';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';


const transactionFormSchema = z.object({
  description: z
    .string()
    .min(1, { message: 'La descripción es obligatoria.' }),
  amount: z.coerce
    .number({ required_error: 'El monto es obligatorio.' })
    .positive({ message: 'El monto debe ser un número positivo.' }),
  date: z.date({ required_error: 'La fecha es obligatoria.' }),
  category: z.string({ required_error: 'La categoría es obligatoria.' }),
  type: z.enum(['income', 'expense'], {
    required_error: 'El tipo es obligatorio.',
  }),
  receiptImageUrl: z.string().optional(),
});

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
});


export default function TransactionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { transactions, categories, addTransaction, editTransaction, deleteTransaction, addCategory, isDemoMode } = useAppData();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
        description: '',
        amount: '' as any,
        date: new Date(),
        type: 'expense',
        category: '',
        receiptImageUrl: undefined,
    },
  });

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const filteredTransactions = useMemo(() => {
    let transactionsToFilter = transactions;

    if (monthFilter !== 'all') {
      transactionsToFilter = transactionsToFilter.filter(t => 
        format(new Date(t.date), 'yyyy-MM') === monthFilter
      );
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      transactionsToFilter = transactionsToFilter.filter(t =>
        t.description.toLowerCase().includes(lowercasedQuery) ||
        t.category.toLowerCase().includes(lowercasedQuery)
      );
    }

    return transactionsToFilter;
  }, [transactions, monthFilter, searchQuery]);

  const monthOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Todos los meses' }];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
        const date = subMonths(today, i);
        const value = format(date, 'yyyy-MM');
        const label = format(date, 'MMMM yyyy', { locale: es });
        options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    return options;
  }, []);

  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        ...editingTransaction,
        amount: Math.abs(editingTransaction.amount),
        date: new Date(editingTransaction.date),
        receiptImageUrl: editingTransaction.receiptImageUrl || undefined,
      });
    } else {
        form.reset({
            description: '',
            amount: '' as any,
            date: new Date(),
            type: 'expense',
            category: '',
            receiptImageUrl: undefined,
        });
    }
  }, [editingTransaction, form]);


  const transactionType = form.watch('type');
  const expenseCategories = categories.filter((c) => c.name !== 'Ingresos');
  const incomeCategory = categories.find((c) => c.name === 'Ingresos');
  
  useEffect(() => {
    if (transactionType === 'income' && incomeCategory) {
      form.setValue('category', incomeCategory.name);
    } else if (transactionType === 'expense') {
      if(form.getValues('category') === incomeCategory?.name){
         form.setValue('category', '');
      }
    }
  }, [transactionType, incomeCategory, form]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
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
          description: 'Por favor, activa los permisos de la cámara para usar esta función.',
        });
      }
    };

    if (cameraOpen) {
      getCameraPermission();
    }
  
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [cameraOpen, toast]);


  function onSubmit(values: z.infer<typeof transactionFormSchema>) {
    const finalCategory = values.type === 'income' && incomeCategory ? incomeCategory.name : values.category;
    const transactionData = {
      description: values.description,
      amount:
        values.type === 'income'
          ? Math.abs(values.amount)
          : -Math.abs(values.amount),
      date: values.date.toISOString(),
      category: finalCategory,
      type: values.type,
      receiptImageUrl: values.receiptImageUrl,
    };

    if (editingTransaction) {
        editTransaction(editingTransaction.id, transactionData);
    } else {
        addTransaction(transactionData);
    }
    
    setDialogOpen(false);
    setEditingTransaction(null);
  }

  function onCategorySubmit(values: z.infer<typeof categoryFormSchema>) {
    addCategory(values.name);
    form.setValue("category", values.name);
    setCategoryDialogOpen(false);
    categoryForm.reset();
  }
  
  const openEditDialog = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  }

  const openDeleteDialog = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  }

  const handleDelete = () => {
    if(transactionToDelete) {
        deleteTransaction(transactionToDelete);
        setDeleteConfirmOpen(false);
        setTransactionToDelete(null);
    }
  }
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      form.setValue('receiptImageUrl', dataUri, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    form.setValue('receiptImageUrl', photoDataUri, { shouldValidate: true });
    setCameraOpen(false);
  };
  
  const handleExportCSV = () => {
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto'];
    const csvRows = [
      headers.join(','),
      ...filteredTransactions.map(t => {
        const date = format(new Date(t.date), 'yyyy-MM-dd');
        const description = `"${t.description.replace(/"/g, '""')}"`;
        const category = t.category;
        const type = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const amount = t.amount;
        return [date, description, category, type, amount].join(',');
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'PlanckFi_transacciones.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <AppShell>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="grid gap-1">
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>
                Una lista de tus transacciones recientes.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if(!open) setEditingTransaction(null); }}>
                <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Transacción
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                    <DialogTitle>{editingTransaction ? "Editar Transacción" : "Añadir Nueva Transacción"}</DialogTitle>
                    <DialogDescription>
                        {editingTransaction ? "Actualiza los detalles de tu transacción." : "Registra un nuevo ingreso o gasto."}
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto pr-2"
                    >
                        <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                            <FormLabel>Tipo</FormLabel>
                            <FormControl>
                                <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex space-x-4"
                                disabled={!!editingTransaction}
                                >
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="expense" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Gasto
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                    <RadioGroupItem value="income" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                    Ingreso
                                    </FormLabel>
                                </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej. Café" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Monto</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                placeholder="$5.00"
                                {...field}
                                value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        {transactionType === 'expense' ? (
                          <>
                            {expenseCategories.length === 0 && !isDemoMode && (
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>No tienes categorías de gastos</AlertTitle>
                                    <AlertDescription>
                                        Por favor, crea una nueva categoría para poder registrar tu gasto.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoría</FormLabel>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={expenseCategories.length === 0}
                                        >
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                            {expenseCategories.map((category) => (
                                                <SelectItem
                                                key={category.id}
                                                value={category.name}
                                                >
                                                {category.name}
                                                </SelectItem>
                                            ))}
                                            </SelectContent>
                                        </Select>
                                        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button type="button" variant="outline" size="icon" className="shrink-0">
                                                    <Plus className="h-4 w-4" />
                                                    <span className="sr-only">Añadir nueva categoría</span>
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Añadir Nueva Categoría</DialogTitle>
                                                    <DialogDescription>Crea una nueva categoría para seguir tus gastos.</DialogDescription>
                                                </DialogHeader>
                                                <Form {...categoryForm}>
                                                    <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 pt-4">
                                                        <FormField
                                                            control={categoryForm.control}
                                                            name="name"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Nombre de la Categoría</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Ej. Viajes" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <DialogFooter>
                                                            <Button type="submit">Guardar categoría</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </Form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                          </>
                        ) : (
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoría</FormLabel>
                                <FormControl>
                                    <Input disabled value={incomeCategory?.name || 'Ingresos'} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        )}

                        <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Fecha</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, 'dd MMMM, yyyy', { locale: es })
                                    ) : (
                                        <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                    date > new Date() || date < new Date('1900-01-01')
                                    }
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name="receiptImageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Recibo (Opcional)</FormLabel>
                            <FormControl>
                                <div>
                                {field.value ? (
                                    <div className="relative w-full h-40 border rounded-md">
                                    <Image src={field.value} alt="Vista previa del recibo" fill style={{ objectFit: 'contain' }} />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6 z-10"
                                        onClick={() => field.onChange(undefined)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                    <Button type="button" variant="outline" onClick={() => setCameraOpen(true)}>
                                        <Camera className="mr-2 h-4 w-4" />
                                        Tomar Foto
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Subir Archivo
                                    </Button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
                                    </div>
                                )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <DialogFooter className="pt-4">
                        <Button type="submit">{editingTransaction ? "Guardar Cambios" : "Guardar Transacción"}</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={handleExportCSV} className="w-full sm:w-auto">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar CSV
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por descripción o categoría..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-auto">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por mes" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border rounded-md overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Recibo</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                        <TableCell>
                            {format(new Date(transaction.date), 'dd MMMM, yyyy', {
                            locale: es,
                            })}
                        </TableCell>
                        <TableCell className="font-medium">
                            {transaction.description}
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>
                            {transaction.receiptImageUrl ? (
                                <a href={transaction.receiptImageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                <Paperclip className="h-5 w-5" />
                                </a>
                            ) : (
                                <span className="text-muted-foreground">-</span>
                            )}
                        </TableCell>
                        <TableCell
                            className={cn(
                            'text-right font-semibold',
                            transaction.amount > 0
                                ? 'text-accent'
                                : 'text-card-foreground'
                            )}
                        >
                            {transaction.amount > 0 ? '+' : ''}
                            {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'USD',
                            }).format(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Abrir menú</span>
                                        <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditDialog(transaction)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openDeleteDialog(transaction.id)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No se encontraron transacciones.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente la transacción.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setTransactionToDelete(null)}>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Capturar Recibo</DialogTitle>
                <DialogDescription>Apunta con la cámara al recibo y presiona "Capturar".</DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted mt-4">
                <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden"></canvas>
                {hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white p-4">
                        <Camera className="h-12 w-12 mb-4" />
                        <p className="text-center font-semibold">Acceso a la cámara denegado</p>
                    </div>
                )}
            </div>
             {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error de Permisos</AlertTitle>
                    <AlertDescription>
                        Por favor, permite el acceso a la cámara en tu navegador para usar esta función.
                    </AlertDescription>
                </Alert>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setCameraOpen(false)}>Cancelar</Button>
                <Button onClick={handleCapture} disabled={!hasCameraPermission}>Capturar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
