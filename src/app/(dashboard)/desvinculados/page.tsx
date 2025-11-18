import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { UserX, ArrowUpRight } from "lucide-react";
import type { Funcionario } from "@/types";

export default async function DesvinculadosPage() {
  const supabase = await createClient();

  const {
    data: funcionarios,
    error,
    count,
  } = await supabase
    .from("funcionarios")
    .select("*", { count: "exact" })
    .eq("desvinculado", true)
    .order("data_desvinculacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar desvinculados:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Funcionários Desvinculados
        </h1>
        <p className="text-gray-600 mt-1">
          {count} funcionário{count !== 1 ? "s" : ""} desvinculado
          {count !== 1 ? "s" : ""}
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Para vincular novamente:</strong> Pesquise o funcionário
            em{" "}
            <Link href="/editar" className="underline hover:text-blue-900">
              Alterar Dados do Cadastro
            </Link>{" "}
            e desmarque a opção: Marcar como desvinculado
          </p>
        </div>
      </div>

      {/* Lista */}
      {funcionarios && funcionarios.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Desvinculação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {funcionarios.map((func: Funcionario) => (
                <tr key={func.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {func.nome_completo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {func.cpf}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {func.cargo_funcao || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {func.data_desvinculacao
                      ? new Date(func.data_desvinculacao).toLocaleDateString(
                          "pt-BR"
                        )
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {func.motivo_desvinculacao || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/funcionarios/${func.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Ver detalhes
                      </Link>
                      <Link
                        href={`/editar?cpf=${func.cpf}`}
                        className="flex items-center gap-1 text-green-600 hover:text-green-900 text-sm"
                      >
                        Revincular
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <UserX size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum funcionário desvinculado
          </h3>
          <p className="text-gray-600">
            Quando você desvincular funcionários, eles aparecerão aqui
          </p>
        </div>
      )}
    </div>
  );
}
