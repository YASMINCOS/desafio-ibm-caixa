import { NextRequest, NextResponse } from 'next/server';
import { watsonOrchestrate } from '../../../_lib/watson-orchestrate-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaText, userId, conversationId } = body;

    if (!ideaText || !userId) {
      return NextResponse.json(
        { error: 'Texto da ideia e userId são obrigatórios' },
        { status: 400 }
      );
    }

    // Analisar ideia com Watson Orchestrate
    const analysis = await watsonOrchestrate.analyzeIdeaWithSkills(
      ideaText, 
      userId, 
      conversationId
    );

    return NextResponse.json({
      success: true,
      data: analysis,
    });

  } catch (error: unknown) {
    console.error('Erro na análise Watson:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
