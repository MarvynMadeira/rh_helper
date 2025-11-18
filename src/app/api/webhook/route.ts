import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usar Service Role para bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // 1. VALIDAR SECRET DO WEBHOOK
    // ==========================================
    const secret = request.headers.get("X-Webhook-Secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      console.error("❌ Secret inválido");
      return NextResponse.json({ error: "Secret inválido" }, { status: 401 });
    }

    // ==========================================
    // 2. RECEBER E VALIDAR DADOS
    // ==========================================
    const data = await request.json();

    console.log("📥 Webhook recebido:", {
      nome: data.nome_completo,
      cpf: data.cpf,
      timestamp: data.timestamp,
    });

    // Validar dados mínimos obrigatórios
    const camposObrigatorios = [
      "nome_completo",
      "data_nascimento",
      "naturalidade",
      "cep",
      "logradouro",
      "numero",
      "bairro",
      "cidade",
      "estado",
      "cpf",
      "rg",
      "orgao_expedidor",
      "nome_mae",
      "nome_pai",
      "estado_civil",
      "titulo_eleitor_numero",
      "titulo_eleitor_zona",
      "titulo_eleitor_secao",
      "pis_pasep",
      "email",
      "telefone",
      "genero",
      "forma_ingresso",
      "numero_diario_oficial",
      "data_posse",
      "lotacao",
      "cargo_funcao",
      "matricula_1",
      "jornada_trabalho",
      "graduacao_nome",
      "graduacao_instituicao",
      "graduacao_data_conclusao",
    ];

    const camposFaltando = camposObrigatorios.filter((campo) => !data[campo]);

    if (camposFaltando.length > 0) {
      console.error("❌ Campos obrigatórios faltando:", camposFaltando);
      return NextResponse.json(
        {
          error: "Dados incompletos",
          campos_faltando: camposFaltando,
        },
        { status: 400 }
      );
    }

    // Limpar e validar CPF
    const cpfLimpo = data.cpf.replace(/\D/g, "");
    if (cpfLimpo.length !== 11) {
      console.error("❌ CPF inválido:", data.cpf);
      return NextResponse.json(
        { error: "CPF inválido (deve ter 11 dígitos)" },
        { status: 400 }
      );
    }

    // ==========================================
    // 3. VERIFICAR DUPLICATA
    // ==========================================
    const { data: existing } = await supabase
      .from("funcionarios")
      .select("id, nome_completo")
      .eq("cpf", cpfLimpo)
      .single();

    if (existing) {
      console.log("⚠️  Funcionário já cadastrado:", existing.nome_completo);
      return NextResponse.json({
        message: "Funcionário já cadastrado",
        id: existing.id,
        nome: existing.nome_completo,
      });
    }

    // ==========================================
    // 4. PREPARAR DADOS PARA INSERÇÃO
    // ==========================================
    const insertData = {
      // Dados Pessoais
      nome_completo: data.nome_completo,
      data_nascimento: formatarData(data.data_nascimento),
      naturalidade: data.naturalidade,

      // Endereço
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento || null,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      comprovante_residencia_url: extrairUrlArquivo(
        data,
        "comprovante_residencia"
      ),

      // Documentos
      cpf: cpfLimpo,
      rg: data.rg,
      rg_frente_verso_url: extrairUrlArquivo(data, "rg_frente_verso"),
      orgao_expedidor: data.orgao_expedidor,

      // Filiação
      nome_mae: data.nome_mae,
      nome_pai: data.nome_pai,

      // Estado Civil
      estado_civil: data.estado_civil,
      nome_conjuge: data.nome_conjuge || null,

      // Documentos adicionais
      titulo_eleitor_numero: data.titulo_eleitor_numero,
      titulo_eleitor_zona: data.titulo_eleitor_zona,
      titulo_eleitor_secao: data.titulo_eleitor_secao,
      pis_pasep: data.pis_pasep,

      // Contato
      email: data.email,
      telefone: data.telefone,

      // Gênero
      genero: data.genero,

      // Certificado de Reservista
      certificado_reservista_url: extrairUrlArquivo(
        data,
        "certificado_reservista"
      ),

      // Dependentes
      dependentes: data.dependentes || null,

      // Situação Funcional
      forma_ingresso: data.forma_ingresso,
      numero_diario_oficial: data.numero_diario_oficial,
      data_nomeacao: data.data_nomeacao
        ? formatarData(data.data_nomeacao)
        : null,
      data_posse: formatarData(data.data_posse),
      lotacao: data.lotacao,
      cargo_funcao: data.cargo_funcao,
      disciplina: data.disciplina || null,

      // Matrículas
      matricula_1: data.matricula_1,
      matricula_2: data.matricula_2 || null,
      matricula_2_descricao: data.matricula_2_descricao || null,

      // Jornada
      jornada_trabalho: data.jornada_trabalho,
      jornada_reduzida: data.jornada_reduzida || null,

      // Formação
      graduacao_nome: data.graduacao_nome,
      graduacao_instituicao: data.graduacao_instituicao,
      graduacao_data_conclusao: formatarData(data.graduacao_data_conclusao),
      graduacao_certificado_url: extrairUrlArquivo(
        data,
        "graduacao_certificado"
      ),
      pos_graduacao: data.pos_graduacao || null,
      mestrado_doutorado: data.mestrado_doutorado || null,
      outros_cursos: data.outros_cursos || null,

      // Responsável
      responsavel_nome: data.responsavel_nome || null,
      responsavel_data_preenchimento: data.responsavel_data_preenchimento
        ? formatarData(data.responsavel_data_preenchimento)
        : null,
      responsavel_assinatura_url: extrairUrlArquivo(
        data,
        "responsavel_assinatura"
      ),

      // Drive e backup
      drive_folder_url: data.drive_folder_url || null,
      form_data: data,

      desvinculado: false,
    };

    // ==========================================
    // 5. INSERIR NO BANCO
    // ==========================================
    const { data: inserted, error } = await supabase
      .from("funcionarios")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro ao inserir no Supabase:", error);
      return NextResponse.json(
        {
          error: "Erro ao salvar no banco de dados",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // ==========================================
    // 6. RESPOSTA DE SUCESSO
    // ==========================================
    console.log("✅ Funcionário cadastrado:", inserted.nome_completo);

    return NextResponse.json({
      success: true,
      id: inserted.id,
      nome: inserted.nome_completo,
      cpf: cpfLimpo,
      message: "Funcionário cadastrado com sucesso",
    });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// PERMITIR GET PARA TESTE
// ==========================================

export async function GET() {
  return NextResponse.json({
    message: "Webhook RH Helper (SMEBJ) está ativo",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function formatarData(data: string | Date): string | null {
  if (!data) return null;

  try {
    if (typeof data === "string" && data.match(/^\d{4}-\d{2}-\d{2}/)) {
      return data.split("T")[0];
    }

    const date = new Date(data);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return null;
  } catch (error) {
    console.error("Erro ao formatar data:", data, error);
    return null;
  }
}

function extrairUrlArquivo(
  data: Record<string, unknown>,
  campo: string
): string | null {
  const fileIds = data[`${campo}_file_ids`];

  if (!fileIds) return null;

  if (Array.isArray(fileIds) && fileIds.length > 0) {
    return `https://drive.google.com/file/d/${fileIds[0]}/view`;
  }

  if (typeof fileIds === "string") {
    return `https://drive.google.com/file/d/${fileIds}/view`;
  }

  return null;
}
