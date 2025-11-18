import { createClient } from "@/lib/supabase/server";
import { EditarForm } from "./EditarForm";

export default async function EditarPage({
  searchParams,
}: {
  searchParams: Promise<{ cpf?: string; nome?: string; id?: string }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;

  let funcionario = null;

  // Buscar por CPF, nome ou ID
  if (params.cpf) {
    const { data } = await supabase
      .from("funcionarios")
      .select("*")
      .eq("cpf", params.cpf)
      .single();
    funcionario = data;
  } else if (params.nome) {
    const { data } = await supabase
      .from("funcionarios")
      .select("*")
      .ilike("nome_completo", `%${params.nome}%`)
      .single();
    funcionario = data;
  } else if (params.id) {
    const { data } = await supabase
      .from("funcionarios")
      .select("*")
      .eq("id", params.id)
      .single();
    funcionario = data;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Alterar Dados do Cadastro
        </h1>
        <p className="text-gray-600 mt-1">
          Busque por nome completo ou CPF para editar informações
        </p>
      </div>

      {/* Formulário de Busca */}
      {!funcionario && (
        <form className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Maria da Silva"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Buscar Funcionário
          </button>
        </form>
      )}

      {/* Formulário de Edição */}
      {funcionario && <EditarForm funcionario={funcionario} />}
    </div>
  );
}
