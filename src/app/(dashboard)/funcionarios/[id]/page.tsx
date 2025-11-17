import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import type {
  Funcionario,
  HistoricoFuncional,
  AvaliacaoPeriodica,
  LicencaMedica,
} from "@/types";

export default async function FuncionarioDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();

  const { id } = await params;

  const { data: funcionario, error } = await supabase
    .from("funcionarios")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !funcionario) {
    notFound();
  }

  const func = funcionario as Funcionario;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/funcionarios"
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {func.nome_completo}
            </h1>
            {func.desvinculado && (
              <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Desvinculado
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/editar?cpf=${func.cpf}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Editar Cadastro
        </Link>
      </div>

      {/* Dados Básicos */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Pessoais
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">CPF</label>
            <p className="text-gray-900">{func.cpf}</p>
          </div>

          {func.email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900">{func.email}</p>
              </div>
            </div>
          )}

          {func.telefone && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Telefone
              </label>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-900">{func.telefone}</p>
              </div>
            </div>
          )}

          {func.data_nascimento && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Data de Nascimento
              </label>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <p className="text-gray-900">
                  {new Date(func.data_nascimento).toLocaleDateString("pt-BR", {
                    timeZone: "UTC", // Adicionado para evitar problemas de fuso
                  })}
                </p>
              </div>
            </div>
          )}

          {func.estado_civil && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Estado Civil
              </label>
              <p className="text-gray-900">{func.estado_civil}</p>
            </div>
          )}

          {func.logradouro && (
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">
                Endereço
              </label>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gray-400 mt-1" />
                <p className="text-gray-900">
                  {func.logradouro}, {func.numero}
                  {func.complemento && ` - ${func.complemento}`}
                  <br />
                  {func.bairro}, {func.cidade} - {func.estado}
                  <br />
                  CEP: {func.cep}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dados Profissionais */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Profissionais
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {func.cargo_funcao && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Cargo/Função
              </label>
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-gray-400" />
                <p className="text-gray-900">{func.cargo_funcao}</p>
              </div>
            </div>
          )}

          {func.disciplina && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Disciplina
              </label>
              <p className="text-gray-900">{func.disciplina}</p>
            </div>
          )}

          {func.lotacao && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Lotação
              </label>
              <p className="text-gray-900">{func.lotacao}</p>
            </div>
          )}

          {func.matricula_1 && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Matrícula 1
              </label>
              <p className="text-gray-900">{func.matricula_1}</p>
            </div>
          )}

          {func.matricula_2 && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Matrícula 2
              </label>
              <p className="text-gray-900">{func.matricula_2}</p>
            </div>
          )}

          {func.jornada_trabalho && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Jornada de Trabalho
              </label>
              <p className="text-gray-900">{func.jornada_trabalho}</p>
            </div>
          )}
        </div>
      </div>

      {/* Histórico Funcional */}
      {func.historico_funcional && func.historico_funcional.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Histórico Funcional
          </h2>
          <div className="space-y-3">
            {func.historico_funcional.map(
              (item: HistoricoFuncional, idx: number) => (
                <div
                  key={idx} // Idealmente, use um 'item.id' se existir
                  className="border-l-2 border-blue-500 pl-4 py-2"
                >
                  <p className="font-medium text-gray-900">
                    {item.tipo === "movimentacao"
                      ? "Movimentação"
                      : "Alteração de Carga Horária"}
                  </p>
                  {item.escola_setor_unidade && (
                    <p className="text-sm text-gray-600">
                      Local: {item.escola_setor_unidade}
                    </p>
                  )}
                  {item.de_horas && item.para_horas && (
                    <p className="text-sm text-gray-600">
                      De {item.de_horas}h para {item.para_horas}h semanais
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.data).toLocaleDateString("pt-BR", {
                      timeZone: "UTC",
                    })}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Status */}
      {(func.status_probatorio ||
        (func.avaliacoes_periodicas &&
          func.avaliacoes_periodicas.length > 0)) && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>

          {func.status_probatorio && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Estágio Probatório
              </label>
              <p className="text-gray-900">{func.status_probatorio}</p>
            </div>
          )}

          {func.avaliacoes_periodicas &&
            func.avaliacoes_periodicas.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-2">
                  Avaliações Periódicas
                </label>
                <div className="space-y-2">
                  {func.avaliacoes_periodicas.map(
                    (aval: AvaliacaoPeriodica, idx: number) => (
                      <div
                        key={idx} // Idealmente, use um 'aval.id' se existir
                        className="bg-gray-50 p-3 rounded"
                      >
                        <p className="text-sm text-gray-900">
                          {aval.descricao}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Resultado: {aval.resultado}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(aval.data).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Desvinculação */}
      {func.desvinculado && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-4">
            Desvinculação
          </h2>
          <div className="space-y-2">
            {func.data_desvinculacao && (
              <p className="text-sm text-red-800">
                <strong>Data:</strong>{" "}
                {new Date(func.data_desvinculacao).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </p>
            )}
            {func.motivo_desvinculacao && (
              <p className="text-sm text-red-800">
                <strong>Motivo:</strong> {func.motivo_desvinculacao}
              </p>
            )}
            {func.documento_desvinculacao_url && (
              // CORREÇÃO 3: Adicionada a tag <a>
              <a
                href={func.documento_desvinculacao_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Ver documento
              </a>
            )}
          </div>
        </div>
      )}

      {/* Licenças Médicas */}
      {func.licencas_medicas && func.licencas_medicas.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Licenças Médicas
          </h2>
          <div className="space-y-3">
            {func.licencas_medicas.map((lic: LicencaMedica, idx: number) => (
              <div
                key={idx} // Idealmente, use um 'lic.id' se existir
                className="border border-gray-200 rounded p-4"
              >
                <p className="text-sm font-medium text-gray-900">
                  {new Date(lic.data_inicio).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}{" "}
                  até{" "}
                  {new Date(lic.data_fim).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </p>
                <p className="text-sm text-gray-600 mt-1">{lic.motivo}</p>
                {lic.documento_url && (
                  // CORREÇÃO 4: Adicionada a tag <a>
                  <a
                    href={lic.documento_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline mt-2 inline-block"
                  >
                    Ver atestado
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info de Cadastro */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p>
          Cadastrado em: {new Date(func.created_at).toLocaleString("pt-BR")}
        </p>
        <p>
          Última atualização:{" "}
          {new Date(func.updated_at).toLocaleString("pt-BR")}
        </p>
      </div>
    </div>
  );
}
