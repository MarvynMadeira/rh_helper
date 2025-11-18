import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const cpf = formData.get("cpf") as string;
    const tipo = formData.get("tipo") as string;

    if (!file || !cpf) {
      return NextResponse.json(
        { error: "Arquivo e CPF são obrigatórios" },
        { status: 400 }
      );
    }

    // Converter arquivo para base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Preparar metadados
    const fileName = `${tipo}_${Date.now()}_${file.name}`;
    const mimeType = file.type;

    // Enviar para Google Apps Script (que fará upload no Drive)
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL!;

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "uploadFile",
        cpf,
        fileName,
        mimeType,
        base64Data: base64,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer upload no Drive");
    }

    const data = await response.json();

    return NextResponse.json({
      url: data.fileUrl,
      fileName: data.fileName,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}
