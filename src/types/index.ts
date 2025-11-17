// src/types/index.ts

// ==========================================
// TIPOS PRINCIPAIS
// ==========================================

export interface Funcionario {
  id: string;
  created_at: string;
  updated_at: string;

  // Dados Pessoais
  nome_completo: string;
  data_nascimento: string;
  naturalidade: string;

  // Endereço
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  comprovante_residencia_url?: string;

  // Documentos
  cpf: string;
  rg: string;
  rg_frente_verso_url?: string;
  orgao_expedidor: string;

  // Filiação
  nome_mae: string;
  nome_pai: string;

  // Estado Civil
  estado_civil: EstadoCivil;
  nome_conjuge?: string;

  // Documentos adicionais
  titulo_eleitor_numero: string;
  titulo_eleitor_zona: string;
  titulo_eleitor_secao: string;
  pis_pasep: string;

  // Contato
  email: string;
  telefone: string;

  // Gênero
  genero: Genero;

  // Certificado de Reservista
  certificado_reservista_url?: string;

  // Dependentes
  dependentes?: string;

  // Situação Funcional
  forma_ingresso: FormaIngresso;
  numero_diario_oficial: string;
  data_nomeacao?: string;
  data_posse: string;
  lotacao: string;
  cargo_funcao: string;
  disciplina?: string;

  // Matrículas
  matricula_1: string;
  matricula_2?: string;
  matricula_2_descricao?: string;

  // Jornada
  jornada_trabalho: string;
  jornada_reduzida?: string;

  // Títulos e Formações
  graduacao_nome: string;
  graduacao_instituicao: string;
  graduacao_data_conclusao: string;
  graduacao_certificado_url?: string;
  pos_graduacao?: string;
  mestrado_doutorado?: string;
  outros_cursos?: string;

  // Responsável
  responsavel_nome?: string;
  responsavel_data_preenchimento?: string;
  responsavel_assinatura_url?: string;

  // Campos Extras (Admin)
  historico_funcional?: HistoricoFuncional[];
  status_probatorio?: string;
  avaliacoes_periodicas?: AvaliacaoPeriodica[];

  // Desvinculação
  desvinculado: boolean;
  data_desvinculacao?: string;
  motivo_desvinculacao?: string;
  documento_desvinculacao_url?: string;

  // Licenças
  licencas_medicas?: LicencaMedica[];

  // Drive
  drive_folder_url?: string;

  // Backup
  form_data?: Record<string, unknown>;
}

// ==========================================
// ENUMS E TIPOS FIXOS
// ==========================================

export type EstadoCivil =
  | "Solteiro(a)"
  | "Casado(a)"
  | "Divorciado(a)"
  | "Viúvo(a)";

export type Genero =
  | "Homem Cis"
  | "Mulher Cis"
  | "Homem Trans"
  | "Mulher Trans"
  | "Não me identifico com nenhum desses"
  | "Outro";

export type FormaIngresso = "Concurso Público" | "Processo Seletivo" | "Outro";

// ==========================================
// TIPOS AUXILIARES
// ==========================================

export interface HistoricoFuncional {
  tipo: "movimentacao" | "carga_horaria";
  escola_setor_unidade?: string;
  data: string;
  de_horas?: number;
  para_horas?: number;
  descricao?: string;
}

export interface AvaliacaoPeriodica {
  descricao: string;
  resultado: string;
  data: string;
}

export interface LicencaMedica {
  data_inicio: string;
  data_fim: string;
  motivo: string;
  documento_url?: string;
}

export interface FiltrosBusca {
  nome?: string;
  cpf?: string;
  cargo?: string;
  disciplina?: string;
  lotacao?: string;
  matricula?: string;
  estado_civil?: string;
  genero?: string;
  forma_ingresso?: string;
}

export interface Estatisticas {
  total_funcionarios: number;
  ativos: number;
  desvinculados: number;
  professores: number;
  concursados: number;
  processo_seletivo: number;
}

// ==========================================
// TIPOS PARA FORMULÁRIOS
// ==========================================

export interface FormularioCadastro {
  // Dados Pessoais
  nome_completo: string;
  data_nascimento: string;
  naturalidade: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  comprovante_residencia?: File;

  cpf: string;
  rg: string;
  rg_frente_verso?: File;
  orgao_expedidor: string;

  nome_mae: string;
  nome_pai: string;
  estado_civil: EstadoCivil;
  nome_conjuge?: string;

  titulo_eleitor_numero: string;
  titulo_eleitor_zona: string;
  titulo_eleitor_secao: string;
  pis_pasep: string;

  email: string;
  telefone: string;
  genero: Genero;
  certificado_reservista?: File;
  dependentes?: string;

  // Situação Funcional
  forma_ingresso: FormaIngresso;
  numero_diario_oficial: string;
  data_nomeacao?: string;
  data_posse: string;
  lotacao: string;
  cargo_funcao: string;
  disciplina?: string;

  matricula_1: string;
  matricula_2?: string;
  matricula_2_descricao?: string;

  jornada_trabalho: string;
  jornada_reduzida?: string;

  // Formação
  graduacao_nome: string;
  graduacao_instituicao: string;
  graduacao_data_conclusao: string;
  graduacao_certificado?: File;
  pos_graduacao?: string;
  mestrado_doutorado?: string;
  outros_cursos?: string;

  // Responsável
  responsavel_nome?: string;
  responsavel_data_preenchimento?: string;
  responsavel_assinatura?: File;
}

// ==========================================
// CONSTANTES
// ==========================================

export const OPCOES_ESTADO_CIVIL: EstadoCivil[] = [
  "Solteiro(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viúvo(a)",
];

export const OPCOES_GENERO: Genero[] = [
  "Homem Cis",
  "Mulher Cis",
  "Homem Trans",
  "Mulher Trans",
  "Não me identifico com nenhum desses",
  "Outro",
];

export const OPCOES_FORMA_INGRESSO: FormaIngresso[] = [
  "Concurso Público",
  "Processo Seletivo",
  "Outro",
];

export const ESTADOS_BRASIL = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

// ==========================================
// TIPOS DE RESPOSTA DA API
// ==========================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ==========================================
// TIPOS PARA WEBHOOK
// ==========================================

export interface WebhookPayload {
  // Dados do formulário mapeados
  nome_completo: string;
  cpf: string;
  email: string;
  timestamp: string;
  respondent_email?: string;
  drive_folder_url?: string;
  [key: string]: string | undefined;
}

// ==========================================
// VALIDAÇÕES
// ==========================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidation {
  isValid: boolean;
  errors: ValidationError[];
}

// ==========================================
// TIPOS PARA AUDITORIA (FUTURO)
// ==========================================

export interface AuditLog {
  id: string;
  created_at: string;
  user_id: string;
  action: "create" | "update" | "desvincular" | "revincular";
  table_name: string;
  record_id: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  ip_address?: string;
}

// ==========================================
// HELPERS DE TIPO
// ==========================================

// Tipo parcial para updates
export type FuncionarioUpdate = Partial<
  Omit<Funcionario, "id" | "created_at" | "cpf">
>;

// Tipo apenas com campos obrigatórios
export type FuncionarioObrigatorio = Pick<
  Funcionario,
  | "nome_completo"
  | "data_nascimento"
  | "naturalidade"
  | "cep"
  | "logradouro"
  | "numero"
  | "bairro"
  | "cidade"
  | "estado"
  | "cpf"
  | "rg"
  | "orgao_expedidor"
  | "nome_mae"
  | "nome_pai"
  | "estado_civil"
  | "titulo_eleitor_numero"
  | "titulo_eleitor_zona"
  | "titulo_eleitor_secao"
  | "pis_pasep"
  | "email"
  | "telefone"
  | "genero"
  | "forma_ingresso"
  | "numero_diario_oficial"
  | "data_posse"
  | "lotacao"
  | "cargo_funcao"
  | "matricula_1"
  | "jornada_trabalho"
  | "graduacao_nome"
  | "graduacao_instituicao"
  | "graduacao_data_conclusao"
>;

// Tipo para listagem (campos reduzidos)
export type FuncionarioListagem = Pick<
  Funcionario,
  | "nome_completo"
  | "cpf"
  | "cargo_funcao"
  | "lotacao"
  | "telefone"
  | "email"
  | "desvinculado"
>;
