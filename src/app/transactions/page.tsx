
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, PlusCircle, MoreHorizontal, Pencil, Trash2, Paperclip, Camera, Upload, XCircle, AlertCircle, FileSpreadsheet, Search, Plus, FileUp, Loader2, FileDown, FileText, Trash } from 'lucide-react';

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
import { Checkbox } from '@/components/ui/checkbox';
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
  account: z.string().optional(),
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
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { transactions, categories, addTransaction, editTransaction, deleteTransaction, addCategory, isDemoMode, addMultipleTransactions, accounts, addAccount, deleteMultipleTransactions } = useAppData();

  const form = useForm<z.infer<typeof transactionFormSchema>>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
        description: '',
        amount: '' as any,
        date: new Date(),
        type: 'expense',
        category: '',
        account: undefined,
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
        t.category.toLowerCase().includes(lowercasedQuery) ||
        (t.account && accounts.find(a => a.name === t.account)?.name.toLowerCase().includes(lowercasedQuery))
      );
    }

    return transactionsToFilter;
  }, [transactions, monthFilter, searchQuery, accounts]);

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
        account: editingTransaction.account || undefined,
        receiptImageUrl: editingTransaction.receiptImageUrl || undefined,
      });
    } else {
        form.reset({
            description: '',
            amount: '' as any,
            date: new Date(),
            type: 'expense',
            category: '',
            account: undefined,
            receiptImageUrl: undefined,
        });
    }
  }, [editingTransaction, form]);
  
  useEffect(() => {
    setSelectedRows([]);
  }, [searchQuery, monthFilter]);


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
      account: values.account,
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

  const handleBulkDelete = async () => {
    if (selectedRows.length > 0) {
        await deleteMultipleTransactions(selectedRows);
        setBulkDeleteConfirmOpen(false);
        toast({
            title: "¡Éxito!",
            description: `${selectedRows.length} ${selectedRows.length > 1 ? 'transacciones eliminadas' : 'transacción eliminada'}.`
        });
        setSelectedRows([]);
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
    const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto', 'Cuenta'];
    const csvRows = [
      headers.join(','),
      ...filteredTransactions.map(t => {
        const date = format(new Date(t.date), 'dd-MM-yyyy');
        const description = `"${t.description.replace(/"/g, '""')}"`;
        const category = t.category;
        const type = t.type === 'income' ? 'Ingreso' : 'Gasto';
        const amount = t.amount;
        const accountName = t.account ? accounts.find(a => a.name === t.account)?.name || '' : '';
        const account = accountName ? `"${accountName.replace(/"/g, '""')}"` : '';
        return [date, description, category, type, amount, account].join(',');
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
  
  const handleImportClick = () => {
    importFileInputRef.current?.click();
  };
  
  const handleDownloadTemplate = () => {
    const headers = 'Fecha,Descripción,Categoría,Tipo,Monto,Cuenta';
    const exampleRows = [
      '26-07-2024,Compra en supermercado,Comestibles,Gasto,85.40,Cuenta de Prueba',
      '28-07-2024,Salario,Ingresos,Ingreso,2000.00,Cuenta de Prueba',
      '29-07-2024,Suscripción a Spotify,Entretenimiento,Gasto,10.99,Cuenta de Prueba'
    ];
    const csvContent = [headers, ...exampleRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'PlanckFi_plantilla_transacciones.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) {
        toast({
          variant: 'destructive',
          title: 'Error de archivo',
          description: 'No se pudo leer el archivo seleccionado.',
        });
        setIsImporting(false);
        return;
      }
      
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headerRow = rows.shift()?.trim() || '';
      // Handle potential BOM character in UTF-8 CSVs from Excel
      const header = headerRow.replace(/^\uFEFF/, '').split(',').map(h => h.trim());
      const expectedHeader = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto', 'Cuenta'];

      if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
         toast({
          variant: 'destructive',
          title: 'Formato de CSV incorrecto',
          description: `Las cabeceras deben ser: ${expectedHeader.join(', ')}.`,
        });
        setIsImporting(false);
        return;
      }

      const transactionsToImport: Omit<Transaction, 'id'>[] = [];
      let skippedRows = 0;
      let createdCategories = 0;
      let createdAccounts = 0;

      // Use Sets for efficient lookups and to track what's been created in this batch
      const existingCategoryNames = new Set(categories.map(c => c.name.toLowerCase()));
      const existingAccountNames = new Set(accounts.map(a => a.name.toLowerCase()));


      for (const row of rows) {
          const values = row.trim().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));
          if (values.length !== 6) {
              skippedRows++;
              continue;
          }

          const [dateStr, description, category, typeStr, amountStr, accountName] = values;
          
          const amount = parseFloat(amountStr);
          const dateParts = dateStr.trim().split('-');
          // Re-assemble as yyyy-mm-dd which is reliably parsed
          const date = dateParts.length === 3 ? new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`) : new Date(NaN);
        
          const type = typeStr.trim().toLowerCase() === 'ingreso' ? 'income' : 'expense';
          
          if ( isNaN(amount) || isNaN(date.getTime()) || !description || !category || !typeStr ) {
            skippedRows++;
            continue;
          }

          // Handle Category Creation
          if (type === 'expense' && !existingCategoryNames.has(category.toLowerCase())) {
            try {
              await addCategory(category);
              existingCategoryNames.add(category.toLowerCase());
              createdCategories++;
            } catch (error) {
              console.error(`Failed to create category "${category}":`, error);
              skippedRows++;
              continue; // Skip if we can't create the category
            }
          } else if (type === 'income' && category.toLowerCase() !== 'ingresos') {
            toast({
                title: 'Categoría Inválida',
                description: `La categoría para ingresos debe ser 'Ingresos'. Se ignoró la fila para '${description}'.`,
                variant: 'destructive'
            });
            skippedRows++;
            continue;
          }

          // Handle Account Creation
          if (accountName && !existingAccountNames.has(accountName.toLowerCase())) {
            try {
              await addAccount({
                name: accountName,
                type: 'Checking', // Default type
                provider: 'Importado de CSV',
                balance: 0,
                lastFour: '0000',
              });
              existingAccountNames.add(accountName.toLowerCase());
              createdAccounts++;
            } catch (error) {
              console.error(`Failed to create account "${accountName}":`, error);
            }
          }

          transactionsToImport.push({
              date: date.toISOString(),
              description: description,
              category,
              type,
              amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
              account: accountName || undefined,
          });
      }

      if (transactionsToImport.length > 0) {
        try {
          await addMultipleTransactions(transactionsToImport);
          let toastDescription = `Se importaron ${transactionsToImport.length} transacciones.`;
          const details = [];
          if (createdCategories > 0) details.push(`${createdCategories} ${createdCategories > 1 ? 'categorías nuevas' : 'categoría nueva'}`);
          if (createdAccounts > 0) details.push(`${createdAccounts} ${createdAccounts > 1 ? 'cuentas nuevas' : 'cuenta nueva'}`);
          
          if (details.length > 0) toastDescription += ` Se crearon ${details.join(' y ')}.`;
          if (skippedRows > 0) toastDescription += ` ${skippedRows} ${skippedRows > 1 ? 'filas fueron ignoradas' : 'fila fue ignorada'}.`;

          toast({
              title: "Importación Completada",
              description: toastDescription
          });
        } catch (error) {
           console.error("Error al importar transacciones", error);
            toast({
                variant: 'destructive',
                title: 'Error de importación',
                description: 'No se pudieron guardar las transacciones. Por favor, inténtalo de nuevo.',
            });
        }
      } else {
         toast({
            variant: 'destructive',
            title: 'Importación vacía',
            description: `No se encontraron transacciones válidas. Se ignoraron ${rows.length} filas.`,
        });
      }
      
      setIsImporting(false);
    };
    
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error de archivo',
            description: 'Hubo un problema al leer el archivo.',
        });
        setIsImporting(false);
    };
    
    reader.readAsText(file);
    event.target.value = '';
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
                                placeholder="5.00"
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
                          name="account"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cuenta (Opcional)</FormLabel>
                               <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                  defaultValue={field.value}
                                >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una cuenta" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts.map((account) => (
                                    <SelectItem
                                      key={account.id}
                                      value={account.name}
                                    >
                                      {account.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Fecha</FormLabel>
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                                    locale={es}
                                    required
                                    selected={field.value}
                                    onSelect={(date) => {
                                        field.onChange(date);
                                        setIsCalendarOpen(false);
                                    }}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
                    <Button variant="outline" onClick={handleImportClick} disabled={isImporting} className="w-full">
                        {isImporting ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importando...</>
                        ) : (
                            <><FileUp className="mr-2 h-4 w-4" /> Importar</>
                        )}
                    </Button>
                     <input
                        type="file"
                        ref={importFileInputRef}
                        onChange={handleImportCSV}
                        className="hidden"
                        accept=".csv"
                    />
                    <Button variant="outline" onClick={handleDownloadTemplate} className="w-full">
                        <FileDown className="mr-2 h-4 w-4" />
                        Plantilla
                    </Button>
                    <Button variant="outline" onClick={handleExportCSV} className="w-full">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <Alert className="mb-4">
                <FileText className="h-4 w-4" />
                <AlertTitle>¿Quieres importar transacciones?</AlertTitle>
                <AlertDescription>
                    Usa un archivo CSV con las columnas: Fecha (en formato DD-MM-AAAA), Descripción, Categoría, Tipo, Monto, Cuenta. Descarga nuestra plantilla para asegurar el formato correcto.
                </AlertDescription>
            </Alert>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por descripción, categoría o cuenta..."
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
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-3 rounded-md border bg-secondary/50">
                <p className="text-sm font-medium flex-1">{selectedRows.length} de {filteredTransactions.length} seleccionadas</p>
                <Button variant="destructive" onClick={() => setBulkDeleteConfirmOpen(true)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar Seleccionadas
                </Button>
            </div>
          )}
          <div className="border rounded-md overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[40px]">
                        <Checkbox
                            checked={filteredTransactions.length > 0 && selectedRows.length === filteredTransactions.length}
                            onCheckedChange={(checked) => {
                                setSelectedRows(checked ? filteredTransactions.map((t) => t.id) : []);
                            }}
                            aria-label="Seleccionar todo"
                        />
                    </TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead>Recibo</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => {
                       const accountName = transaction.account ? accounts.find(a => a.name === transaction.account)?.name || transaction.account : '';
                       return (
                        <TableRow key={transaction.id} data-state={selectedRows.includes(transaction.id) ? "selected" : ""}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedRows.includes(transaction.id)}
                                    onCheckedChange={(checked) => {
                                        setSelectedRows((prev) =>
                                            checked ? [...prev, transaction.id] : prev.filter((id) => id !== transaction.id)
                                        );
                                    }}
                                    aria-label="Seleccionar fila"
                                />
                            </TableCell>
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
                            {accountName || <span className="text-muted-foreground">-</span>}
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
                                {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
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
                       )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
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

       <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                      Esta acción no se puede deshacer. Esto eliminará permanentemente {selectedRows.length} transacciones.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete}>Eliminar</AlertDialogAction>
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

    
