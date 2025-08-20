import { NextRequest, NextResponse } from 'next/server';
import { watsonOrchestrate } from '../../../_lib/watson-orchestrate-api';

export async function GET() {
  try {
    const status = await watsonOrchestrate.getInstanceStatus();
    
    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error: unknown) {
    console.error('Erro ao verificar status Watson:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno',
        status: 'offline'
      },
      { status: 500 }
    );
  }
}
