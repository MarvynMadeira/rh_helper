import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Filter } from "lucide-react";
import type { Funcionario } from "@/types";

export default async function BuscaAvancadaPage({
  searchParams,
}: {
  searchParams: Promise<{
    nome?: string;
    cpf?: string;
    cargo?: string;
    disciplina?: string;
    matricula?: string;
    lotacao?: string;
  }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const filtros = {
    nome: params.nome || "",
    cpf: params.cpf || "",
    cargo: params.cargo || "",
    disciplina: params.disciplina || "",
    matricula: params.matricula || "",
    lotacao: params.lotacao || "",
  };

  const temFiltros = Object.values(filtros).some((v) => v !== "");

  let funcionarios: Funcionario[] = [];

  if (temFiltros) {
    let query = supabase
      .from("funcionarios")
      .select("*")
      .eq("desvinculado", false);

    if (filtros.nome) {
      query = query.ilike("nome_completo", `%${filtros.nome}%`);
    }
    if (filtros.cpf) {
      query = query.ilike("cpf", `%${filtros.cpf}%`);
    }
    if (filtros.cargo) {
      query = query.ilike("cargo_funcao", `%${filtros.cargo}%`);
    }
    if (filtros.disciplina) {
      query = query.ilike("disciplina", `%${filtros.disciplina}%`);
    }
    if (filtros.lotacao) {
      query = query.ilike("lotacao", `%${filtros.lotacao}%`);
    }
    if (filtros.matricula) {
      query = query.or(
        `matricula_1.ilike.%${filtros.matricula}%,matricula_2.ilike.%${filtros.matricula}%`
      );
    }

    const { data, error } = await query.order("nome_completo");

    if (!error && data) {
      funcionarios = data;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Busca Avançada</h1>
        <p className="text-gray-600 mt-1">
          Combine múltiplos filtros para encontrar funcionários específicos
        </p>
      </div>

      <form className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              defaultValue={filtros.nome}
              placeholder="Ex: Maria Silva"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cpf"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              defaultValue={filtros.cpf}
              placeholder="Ex: 123.456.789-00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="cargo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cargo/Função
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              defaultValue={filtros.cargo}
              placeholder="Ex: Professor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="disciplina"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Disciplina
            </label>
            <input
              type="text"
              id="disciplina"
              name="disciplina"
              defaultValue={filtros.disciplina}
              placeholder="Ex: Matemática"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="lotacao"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lotação
            </label>
            <input
              type="text"
              id="lotacao"
              name="lotacao"
              defaultValue={filtros.lotacao}
              placeholder="Ex: Secretaria de Educação"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="matricula"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Matrícula
            </label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              defaultValue={filtros.matricula}
              placeholder="Ex: 12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Busca em todas as matrículas cadastradas
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Search size={18} />
            Buscar
          </button>

          <Link
            href="/busca"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Limpar Filtros
          </Link>
        </div>
      </form>

      {temFiltros && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Resultados da Busca
            </h2>
            <span className="text-sm text-gray-600">
              {funcionarios.length} funcionário
              {funcionarios.length !== 1 ? "s" : ""} encontrado
              {funcionarios.length !== 1 ? "s" : ""}
            </span>
          </div>

          {funcionarios.length > 0 ? (
            <div className="space-y-3">
              {funcionarios.map((func) => (
                <Link
                  key={func.id}
                  href={`/funcionarios/${func.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {func.nome_completo}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        CPF: {func.cpf}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        {func.cargo_funcao && (
                          <span>Cargo: {func.cargo_funcao}</span>
                        )}
                        {func.disciplina && (
                          <span>Disciplina: {func.disciplina}</span>
                        )}
                        {func.lotacao && <span>Lotação: {func.lotacao}</span>}
                      </div>
                    </div>
                    <span className="text-sm text-blue-600">
                      Ver detalhes →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Filter size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-600">Tente ajustar os filtros da busca</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
