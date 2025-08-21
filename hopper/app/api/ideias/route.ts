import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const payload = {
    ...body,
    Title: "PROB-2025-" + Date.now(),
    Status: "Ativo",
    DataCriacao: new Date().toISOString(),
  };

  try {
    const res = await fetch("http://localhost:3000/mock-orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    // Type narrowing para acessar a propriedade message
    const errorMessage =
      err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
