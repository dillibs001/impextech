'use client';

import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { InvoiceData } from '@/types/invoice';

export interface DownloadInvoiceButtonProps {
  invoiceData: InvoiceData;
  className?: string;
}

export function DownloadInvoiceButton({
  invoiceData,
  className = '',
}: DownloadInvoiceButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch('/api/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate invoice (HTTP ${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `impextech-invoice-${invoiceData.orderRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      console.error('Download invoice error:', err);
      const msg = err instanceof Error ? err.message : 'Error generating invoice';
      setError(msg);
      alert('Unable to generate invoice at this time. Please try again or contact WhatsApp support.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        type="button"
        className={`inline-flex items-center justify-center gap-2 bg-[#2B2E35] hover:bg-[#1E2127] text-white text-xs font-bold py-3 px-6 rounded-xl border border-transparent hover:border-red-600 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group ${className}`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            <span>Generating Certificate...</span>
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 text-white group-hover:text-red-400 transition-colors" />
            <span>Download Invoice & Certificate</span>
          </>
        )}
      </button>
      {error && (
        <span className="text-red-500 text-[11px] mt-1.5">{error}</span>
      )}
    </div>
  );
}

export default DownloadInvoiceButton;
