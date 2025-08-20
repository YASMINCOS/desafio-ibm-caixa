import { NextRequest, NextResponse } from 'next/server';
import { watsonOrchestrate } from '../../../_lib/watson-orchestrate-api';

// GET - Listar canais
export async function GET() {
  try {
    const channels = await watsonOrchestrate.listChannels();
    
    return NextResponse.json({
      success: true,
      data: channels,
    });
  } catch (error: unknown) {
    console.error('Erro ao listar canais:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno' 
      },
      { status: 500 }
    );
  }
}

// POST - Criar canal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const channel = await watsonOrchestrate.createChannel(body);
    
    return NextResponse.json({
      success: true,
      data: channel,
    });
  } catch (error: unknown) {
    console.error('Erro ao criar canal:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno' 
      },
      { status: 500 }
    );
  }
}