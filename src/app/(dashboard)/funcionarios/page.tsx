import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Search } from "lucide-react";
import type { Funcionario } from "@/types";

export default async function FuncionariosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const supabase = await createClient();

  // ✅ Await searchParams
  const params = await searchParams;

  // Paginação
  const page = Number(params.page) || 1;
  const perPage = 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // Busca rápida
  const search = params.search || "";

  // Query
  let query = supabase
    .from("funcionarios")
    .select("*", { count: "exact" })
    .eq("desvinculado", false)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(
      `nome_completo.ilike.%${search}%,cpf.ilike.%${search}%,cargo_funcao.ilike.%${search}%`
    );
  }

  const { data: funcionarios, error, count } = await query;

  if (error) {
    console.error("Erro ao buscar funcionários:", error);
  }

  const totalPages = count ? Math.ceil(count / perPage) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lista de Funcionários
          </h1>
          <p className="text-gray-600 mt-1">
            {count} funcionário{count !== 1 ? "s" : ""} cadastrado
            {count !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/busca"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Search size={18} />
          Busca Avançada
        </Link>
      </div>

      {/* Busca Rápida */}
      <form className="flex gap-2">
        <input
          type="search"
          name="search"
          placeholder="Busca rápida por nome, CPF ou cargo..."
          defaultValue={search}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Tabela */}
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
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cadastro
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
                    <div>{func.telefone || "-"}</div>
                    <div className="text-xs text-gray-400">
                      {func.email || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(func.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/funcionarios/${func.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum funcionário encontrado
          </h3>
          <p className="text-gray-600">
            {search
              ? "Tente ajustar sua busca"
              : "Aguardando respostas do formulário"}
          </p>
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/funcionarios?page=${page - 1}${
                search ? `&search=${search}` : ""
              }`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Anterior
            </Link>
          )}

          <span className="px-4 py-2 text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={`/funcionarios?page=${page + 1}${
                search ? `&search=${search}` : ""
              }`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Próxima
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
