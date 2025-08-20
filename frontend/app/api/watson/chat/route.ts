import { NextRequest, NextResponse } from 'next/server';
import { watsonOrchestrate } from '../../../_lib/watson-orchestrate-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userId, conversationId, metadata } = body;

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Mensagem e userId são obrigatórios' },
        { status: 400 }
      );
    }

    // Enviar mensagem para Watson Orchestrate
    const response = await watsonOrchestrate.sendMessage({
      message,
      userId,
      conversationId,
      channelId: 'caixa-sandbox-channel',
      metadata: {
        source: 'caixa-sandbox',
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    });

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error: unknown) {
    console.error('Erro na API Watson Chat:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        fallback: true 
      },
      { status: 500 }
    );
  }
}