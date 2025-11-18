"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, CheckCircle, XCircle } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import type {
  Funcionario,
  HistoricoFuncional,
  AvaliacaoPeriodica,
  LicencaMedica,
} from "@/types";

export function EditarForm({ funcionario }: { funcionario: Funcionario }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Estados dos campos extras
  const [historico, setHistorico] = useState<HistoricoFuncional[]>(
    funcionario.historico_funcional || []
  );
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoPeriodica[]>(
    funcionario.avaliacoes_periodicas || []
  );
  const [licencas, setLicencas] = useState<LicencaMedica[]>(
    funcionario.licencas_medicas || []
  );

  // Estado de desvinculação
  const [desvinculado, setDesvinculado] = useState(funcionario.desvinculado);

  // ✅ Estados para arquivos
  const [arquivoDesvinculacao, setArquivoDesvinculacao] = useState<File | null>(
    null
  );
  const [arquivosLicenca, setArquivosLicenca] = useState<{
    [key: number]: File | null;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      // ✅ 1. Upload de arquivo de desvinculação (se houver)
      let urlDesvinculacao = funcionario.documento_desvinculacao_url;

      if (arquivoDesvinculacao) {
        const uploadForm = new FormData();
        uploadForm.append("file", arquivoDesvinculacao);
        uploadForm.append("cpf", funcionario.cpf);
        uploadForm.append("tipo", "desvinculacao");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          urlDesvinculacao = uploadData.url;
        }
      }

      // ✅ 2. Upload de arquivos de licenças médicas (se houver)
      const licencasComArquivos = await Promise.all(
        licencas.map(async (lic, index) => {
          let documentoUrl = lic.documento_url;

          if (arquivosLicenca[index]) {
            const uploadForm = new FormData();
            uploadForm.append("file", arquivosLicenca[index]!);
            uploadForm.append("cpf", funcionario.cpf);
            uploadForm.append("tipo", `licenca_medica_${index}`);

            const uploadRes = await fetch("/api/upload", {
              method: "POST",
              body: uploadForm,
            });

            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              documentoUrl = uploadData.url;
            }
          }

          return {
            ...lic,
            documento_url: documentoUrl,
          };
        })
      );

      // ✅ 3. Montar objeto de atualização
      const updates = {
        nome_completo: formData.get("nome_completo"),
        email: formData.get("email"),
        telefone: formData.get("telefone"),
        data_nascimento: formData.get("data_nascimento") || null,
        estado_civil: formData.get("estado_civil"),
        lotacao: formData.get("lotacao"),
        cargo_funcao: formData.get("cargo_funcao"),
        disciplina: formData.get("disciplina"),
        matricula_1: formData.get("matricula_1"),
        matricula_2: formData.get("matricula_2"),
        jornada_trabalho: formData.get("jornada_trabalho"),

        // Campos extras
        historico_funcional: historico,
        status_probatorio: formData.get("status_probatorio"),
        avaliacoes_periodicas: avaliacoes,
        licencas_medicas: licencasComArquivos, // ✅ Com URLs dos arquivos

        // Desvinculação
        desvinculado,
        data_desvinculacao: desvinculado
          ? formData.get("data_desvinculacao") || new Date().toISOString()
          : null,
        motivo_desvinculacao: desvinculado
          ? formData.get("motivo_desvinculacao")
          : null,
        documento_desvinculacao_url: desvinculado ? urlDesvinculacao : null, // ✅ Com URL do arquivo
      };

      // ✅ 4. Enviar atualização
      const response = await fetch(`/api/funcionarios/${funcionario.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Dados atualizados com sucesso!" });
        setTimeout(() => {
          router.push(`/funcionarios/${funcionario.id}`);
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: "error", text: "Erro ao atualizar dados" });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: "error", text: "Erro ao processar arquivos" });
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciar histórico funcional
  const adicionarMovimentacao = () => {
    setHistorico([
      ...historico,
      {
        tipo: "movimentacao",
        escola_setor_unidade: "",
        data: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const adicionarCargaHoraria = () => {
    setHistorico([
      ...historico,
      {
        tipo: "carga_horaria",
        de_horas: 0,
        para_horas: 0,
        data: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removerHistorico = (index: number) => {
    setHistorico(historico.filter((_, i) => i !== index));
  };

  // Funções para avaliações
  const adicionarAvaliacao = () => {
    setAvaliacoes([
      ...avaliacoes,
      {
        descricao: "",
        resultado: "",
        data: new Date().toISOString().split("T")[0],
      },
    ]);
  };

  const removerAvaliacao = (index: number) => {
    setAvaliacoes(avaliacoes.filter((_, i) => i !== index));
  };

  // Funções para licenças
  const adicionarLicenca = () => {
    setLicencas([
      ...licencas,
      {
        data_inicio: new Date().toISOString().split("T")[0],
        data_fim: new Date().toISOString().split("T")[0],
        motivo: "",
      },
    ]);
  };

  const removerLicenca = (index: number) => {
    setLicencas(licencas.filter((_, i) => i !== index));
    // Remove também o arquivo associado
    const novosArquivos = { ...arquivosLicenca };
    delete novosArquivos[index];
    setArquivosLicenca(novosArquivos);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensagem de feedback */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Dados Básicos */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Básicos
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              name="nome_completo"
              required
              defaultValue={funcionario.nome_completo}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF (não editável)
            </label>
            <input
              type="text"
              value={funcionario.cpf}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              defaultValue={funcionario.email || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              defaultValue={funcionario.telefone || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Nascimento
            </label>
            <input
              type="date"
              name="data_nascimento"
              defaultValue={funcionario.data_nascimento || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado Civil
            </label>
            <select
              name="estado_civil"
              defaultValue={funcionario.estado_civil}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Solteiro(a)">Solteiro(a)</option>
              <option value="Casado(a)">Casado(a)</option>
              <option value="Divorciado(a)">Divorciado(a)</option>
              <option value="Viúvo(a)">Viúvo(a)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dados Profissionais */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dados Profissionais
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lotação
            </label>
            <input
              type="text"
              name="lotacao"
              defaultValue={funcionario.lotacao || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo/Função
            </label>
            <input
              type="text"
              name="cargo_funcao"
              defaultValue={funcionario.cargo_funcao || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disciplina
            </label>
            <input
              type="text"
              name="disciplina"
              defaultValue={funcionario.disciplina || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula 1
            </label>
            <input
              type="text"
              name="matricula_1"
              defaultValue={funcionario.matricula_1 || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matrícula 2
            </label>
            <input
              type="text"
              name="matricula_2"
              defaultValue={funcionario.matricula_2 || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jornada de Trabalho
            </label>
            <input
              type="text"
              name="jornada_trabalho"
              defaultValue={funcionario.jornada_trabalho || ""}
              placeholder="Ex: 40h"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Histórico Funcional (OPCIONAL) */}
      <details className="bg-white rounded-lg shadow">
        <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          Histórico Funcional (Opcional)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          {historico.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => removerHistorico(index)}
                className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>

              {item.tipo === "movimentacao" ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Movimentação</h4>
                  <input
                    type="text"
                    value={item.escola_setor_unidade || ""}
                    onChange={(e) => {
                      const newHistorico = [...historico];
                      newHistorico[index] = {
                        ...item,
                        escola_setor_unidade: e.target.value,
                      };
                      setHistorico(newHistorico);
                    }}
                    placeholder="Escola/Setor/Unidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={item.data}
                    onChange={(e) => {
                      const newHistorico = [...historico];
                      newHistorico[index] = { ...item, data: e.target.value };
                      setHistorico(newHistorico);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    Alteração de Carga Horária
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={item.de_horas || 0}
                      onChange={(e) => {
                        const newHistorico = [...historico];
                        newHistorico[index] = {
                          ...item,
                          de_horas: Number(e.target.value),
                        };
                        setHistorico(newHistorico);
                      }}
                      placeholder="De (horas)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      value={item.para_horas || 0}
                      onChange={(e) => {
                        const newHistorico = [...historico];
                        newHistorico[index] = {
                          ...item,
                          para_horas: Number(e.target.value),
                        };
                        setHistorico(newHistorico);
                      }}
                      placeholder="Para (horas)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="date"
                    value={item.data}
                    onChange={(e) => {
                      const newHistorico = [...historico];
                      newHistorico[index] = { ...item, data: e.target.value };
                      setHistorico(newHistorico);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={adicionarMovimentacao}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus size={18} />
              Adicionar Movimentação
            </button>

            <button
              type="button"
              onClick={adicionarCargaHoraria}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Plus size={18} />
              Adicionar Alteração de Carga
            </button>
          </div>
        </div>
      </details>

      {/* Avaliações Periódicas (OPCIONAL) */}
      <details className="bg-white rounded-lg shadow">
        <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          Avaliações Periódicas (Opcional)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          {avaliacoes.map((aval, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => removerAvaliacao(index)}
                className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-3">
                <textarea
                  value={aval.descricao}
                  onChange={(e) => {
                    const newAvaliacoes = [...avaliacoes];
                    newAvaliacoes[index] = {
                      ...aval,
                      descricao: e.target.value,
                    };
                    setAvaliacoes(newAvaliacoes);
                  }}
                  placeholder="Descrição da avaliação"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={aval.resultado}
                  onChange={(e) => {
                    const newAvaliacoes = [...avaliacoes];
                    newAvaliacoes[index] = {
                      ...aval,
                      resultado: e.target.value,
                    };
                    setAvaliacoes(newAvaliacoes);
                  }}
                  placeholder="Resultado (Ex: Aprovado, Satisfatório...)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={aval.data}
                  onChange={(e) => {
                    const newAvaliacoes = [...avaliacoes];
                    newAvaliacoes[index] = { ...aval, data: e.target.value };
                    setAvaliacoes(newAvaliacoes);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarAvaliacao}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus size={18} />
            Adicionar Avaliação
          </button>
        </div>
      </details>

      {/* ✅ Licenças Médicas COM UPLOAD */}
      <details className="bg-white rounded-lg shadow">
        <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          Licenças Médicas (Opcional)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          {licencas.map((lic, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <button
                type="button"
                onClick={() => removerLicenca(index)}
                className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Início
                    </label>
                    <input
                      type="date"
                      value={lic.data_inicio}
                      onChange={(e) => {
                        const newLicencas = [...licencas];
                        newLicencas[index] = {
                          ...lic,
                          data_inicio: e.target.value,
                        };
                        setLicencas(newLicencas);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={lic.data_fim}
                      onChange={(e) => {
                        const newLicencas = [...licencas];
                        newLicencas[index] = {
                          ...lic,
                          data_fim: e.target.value,
                        };
                        setLicencas(newLicencas);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo
                  </label>
                  <textarea
                    value={lic.motivo}
                    onChange={(e) => {
                      const newLicencas = [...licencas];
                      newLicencas[index] = { ...lic, motivo: e.target.value };
                      setLicencas(newLicencas);
                    }}
                    placeholder="Descreva o motivo da licença"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ✅ UPLOAD DE ATESTADO */}
                <FileUpload
                  onFileSelect={(file) => {
                    setArquivosLicenca({ ...arquivosLicenca, [index]: file });
                  }}
                  currentUrl={lic.documento_url}
                  label="Atestado Médico (Opcional)"
                  accept=".pdf,image/*"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={adicionarLicenca}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Plus size={18} />
            Adicionar Licença Médica
          </button>
        </div>
      </details>

      {/* Status Probatório */}
      <details className="bg-white rounded-lg shadow">
        <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          Status (Opcional)
        </summary>
        <div className="px-6 pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estágio Probatório
          </label>
          <select
            name="status_probatorio"
            defaultValue={funcionario.status_probatorio || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Aprovado">Aprovado</option>
            <option value="Reprovado">Reprovado</option>
          </select>
        </div>
      </details>

      {/* ✅ Desvincular Funcionário COM UPLOAD */}
      <details className="bg-white rounded-lg shadow">
        <summary className="px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:bg-gray-50">
          Desvincular Funcionário (Opcional - Reversível)
        </summary>
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <input
              type="checkbox"
              id="desvinculado"
              checked={desvinculado}
              onChange={(e) => setDesvinculado(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="desvinculado"
              className="text-sm font-medium text-gray-900 cursor-pointer"
            >
              Marcar como desvinculado
            </label>
          </div>

          {desvinculado && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Desvinculação
                </label>
                <input
                  type="date"
                  name="data_desvinculacao"
                  defaultValue={
                    funcionario.data_desvinculacao
                      ? new Date(funcionario.data_desvinculacao)
                          .toISOString()
                          .split("T")[0]
                      : new Date().toISOString().split("T")[0]
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo da Desvinculação
                </label>
                <textarea
                  name="motivo_desvinculacao"
                  rows={3}
                  defaultValue={funcionario.motivo_desvinculacao || ""}
                  placeholder="Descreva brevemente o motivo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ✅ UPLOAD DE DOCUMENTO DE DESVINCULAÇÃO */}
              <FileUpload
                onFileSelect={setArquivoDesvinculacao}
                currentUrl={funcionario.documento_desvinculacao_url}
                label="Documento de Desvinculação (Opcional)"
                accept=".pdf,.doc,.docx,image/*"
              />
            </div>
          )}
        </div>
      </details>

      {/* Botões de Ação */}
      <div className="flex gap-3 justify-end pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
