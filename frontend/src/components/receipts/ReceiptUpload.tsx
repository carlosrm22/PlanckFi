import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Receipt, OCRData } from '../../types';

interface ReceiptUploadProps {
  onReceiptProcessed?: (receipt: Receipt) => void;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onReceiptProcessed }) => {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);

    try {
      for (const file of acceptedFiles) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          throw new Error('Solo se permiten archivos de imagen');
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('El archivo es demasiado grande (máximo 5MB)');
        }

        // Crear objeto de recibo
        const receipt: Receipt = {
          id: Date.now().toString(),
          userId: 'current-user', // TODO: Obtener del contexto
          filename: file.name,
          originalName: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          mimeType: file.type,
          status: 'pending',
          createdAt: new Date(),
        };

        setReceipts(prev => [...prev, receipt]);

        // Simular procesamiento OCR
        await processReceiptOCR(receipt, file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar archivos');
      console.warn('Error processing files:', err);
    } finally {
      setUploading(false);
    }
  }, []);

  const processReceiptOCR = async (receipt: Receipt, file: File) => {
    setProcessing(true);
    
    try {
      // Simular delay de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock OCR data
      const mockOCRData: OCRData = {
        merchant: 'Supermercado Ejemplo',
        total: 45.50,
        date: new Date(),
        items: [
          { name: 'Pan integral', price: 2.50, quantity: 1 },
          { name: 'Leche deslactosada', price: 3.20, quantity: 2 },
          { name: 'Manzanas', price: 1.80, quantity: 3 },
        ],
        confidence: 0.85,
        rawText: 'SUPERMERCADO EJEMPLO\nFecha: 15/12/2024\nPan integral: $2.50\nLeche: $6.40\nManzanas: $5.40\nTotal: $45.50',
      };

      const updatedReceipt: Receipt = {
        ...receipt,
        ocrData: mockOCRData,
        status: 'processed',
        processedAt: new Date(),
      };

      setReceipts(prev => 
        prev.map(r => r.id === receipt.id ? updatedReceipt : r)
      );

      onReceiptProcessed?.(updatedReceipt);
    } catch (err) {
      const failedReceipt: Receipt = {
        ...receipt,
        status: 'failed',
      };

      setReceipts(prev => 
        prev.map(r => r.id === receipt.id ? failedReceipt : r)
      );

      console.warn('Error processing OCR:', err);
    } finally {
      setProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: true,
    disabled: uploading || processing,
  });

  const removeReceipt = (receiptId: string) => {
    setReceipts(prev => prev.filter(r => r.id !== receiptId));
  };

  const getStatusIcon = (status: Receipt['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status: Receipt['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Subir Recibos
        </h2>
        <p className="text-gray-600">
          Sube fotos de tus recibos para extraer automáticamente la información
        </p>
      </div>

      {/* Área de Drop */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading || processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="text-6xl mb-4">📸</div>
        
        {isDragActive ? (
          <p className="text-lg text-blue-600">Suelta los archivos aquí...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Arrastra y suelta archivos aquí, o haz clic para seleccionar
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, GIF hasta 5MB
            </p>
          </div>
        )}

        {(uploading || processing) && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">
              {uploading ? 'Subiendo...' : 'Procesando OCR...'}
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de Recibos */}
      {receipts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recibos Procesados ({receipts.length})
          </h3>
          
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getStatusIcon(receipt.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {receipt.originalName}
                      </p>
                      <p className={`text-sm ${getStatusColor(receipt.status)}`}>
                        {receipt.status === 'pending' && 'Procesando...'}
                        {receipt.status === 'processed' && 'Procesado correctamente'}
                        {receipt.status === 'failed' && 'Error en el procesamiento'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {receipt.ocrData && (
                      <button
                        onClick={() => console.warn('Ver detalles:', receipt.ocrData)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Ver datos
                      </button>
                    )}
                    <button
                      onClick={() => removeReceipt(receipt.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Datos OCR */}
                {receipt.ocrData && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Comercio:</span> {receipt.ocrData.merchant}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ${receipt.ocrData.total}
                      </div>
                      <div>
                        <span className="font-medium">Fecha:</span> {receipt.ocrData.date.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Confianza:</span> {Math.round(receipt.ocrData.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 