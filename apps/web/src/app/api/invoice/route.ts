import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoiceData } from '@/types/invoice';
import { InvoiceDocument } from '@/components/invoice/InvoiceDocument';

export async function POST(req: NextRequest) {
  try {
    const data: InvoiceData = await req.json();

    if (!data || !data.orderRef) {
      return NextResponse.json({ error: 'Missing invoice order reference' }, { status: 400 });
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoiceDocument, { data })
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="impextech-invoice-${data.orderRef}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice PDF' },
      { status: 500 }
    );
  }
}
