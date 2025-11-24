# 🎯 RH Helper - Sistema de Gerenciamento de RH

Sistema privado de gerenciamento de dados de funcionários integrado com Google Forms e Supabase.

## 📋 Sobre o Projeto

Sistema desenvolvido para automatizar o gerenciamento de cadastros de funcionários, com integração direta entre Google Forms, Google Drive e um painel administrativo moderno.

### Funcionalidades Principais

- ✅ **Autenticação segura** - Login exclusivo para admin
- ✅ **Lista de funcionários** - Visualização completa com busca e paginação
- ✅ **Busca avançada** - Filtros combinados por múltiplos campos
- ✅ **Edição completa** - Atualização de todos os dados cadastrais
- ✅ **Campos extras opcionais** - Histórico funcional, avaliações, licenças médicas
- ✅ **Sistema de desvinculação** - Reversível, sem deletar dados
- ✅ **Upload de documentos** - Integrado com Google Drive
- ✅ **Integração automática** - Google Forms → Supabase em tempo real
- ✅ **Sincronização** - Importação de respostas antigas do formulário

## 🛠️ Stack Tecnológica

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL + Auth)
- **Storage**: Google Drive
- **Forms**: Google Forms + Apps Script
- **Styling**: Tailwind CSS
- **Deploy**: Vercel
- **Package Manager**: Yarn

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ e Yarn
- Conta Supabase
- Conta Google (para Forms e Drive)
- Conta Vercel (para deploy)

### Passo a Passo

```bash
# 1. Clonar repositório
git clone https://github.com/seu-usuario/rh-helper.git
cd rh-helper

# 2. Instalar dependências
yarn install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Rodar em desenvolvimento
yarn dev

# Acesse http://localhost:3000
```

## ⚙️ Configuração

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Execute o SQL em `supabase/migrations/001_initial_schema.sql`
3. Crie o usuário admin em Authentication > Users
4. Atualize a policy com o UUID do admin
5. Copie as credenciais para `.env.local`

### 2. Google Forms

1. Abra seu Google Form
2. Vá em Mais opções (...) > Editor de scripts
3. Cole o código de `google-apps-script/formHandler.js`
4. Configure as variáveis no `CONFIG`
5. Execute `setupTrigger()` uma vez
6. Execute `syncOldResponses()` para importar respostas antigas

### 3. Google Drive

1. Crie uma pasta principal para armazenar arquivos
2. Copie o ID da pasta (está na URL)
3. Configure no Apps Script

### 4. Deploy Vercel

```bash
# Via CLI
vercel --prod

# Ou conecte seu repositório GitHub no site da Vercel
```

Configure as variáveis de ambiente na Vercel (Settings > Environment Variables).

## 📁 Estrutura do Projeto

```
rh-helper/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Página de login
│   │   ├── (dashboard)/           # Páginas protegidas
│   │   │   ├── funcionarios/      # Lista e detalhes
│   │   │   ├── busca/             # Busca avançada
│   │   │   ├── editar/            # Edição de dados
│   │   │   └── desvinculados/     # Funcionários desvinculados
│   │   └── api/
│   │       ├── webhook/           # Recebe dados do Forms
│   │       ├── upload/            # Upload de arquivos
│   │       └── funcionarios/      # CRUD de funcionários
│   ├── components/
│   │   ├── ui/                    # Componentes base
│   │   └── FileUpload.tsx         # Upload de arquivos
│   ├── lib/
│   │   └── supabase/              # Clientes Supabase
│   └── types/
│       └── index.ts               # Tipos TypeScript
├── google-apps-script/
│   ├── formHandler.js             # Script do Google Forms
│   └── Code.gs                    # API de upload
├── supabase/
│   └── migrations/                # SQL do banco
└── public/
```

## 🔐 Segurança

- **RLS (Row Level Security)** no Supabase
- **Autenticação** obrigatória para todas as rotas
- **Webhook secret** para validar requisições do Forms
- **Service Role** apenas em APIs server-side
- **Sem rota de delete** - admin não pode deletar dados
- **Validação** de inputs em todos os formulários

## 🔄 Fluxo de Dados

```
Usuário preenche Google Forms
         ↓
Apps Script detecta submissão
         ↓
Upload de arquivos para Drive
         ↓
Webhook POST para Next.js API
         ↓
Validação e inserção no Supabase
         ↓
Dados aparecem no painel admin
```

## 📊 Banco de Dados

### Tabela: `funcionarios`

- **Dados pessoais**: nome, CPF, email, telefone, endereço
- **Dados profissionais**: cargo, disciplina, matrículas, carga horária
- **Campos extras**: histórico funcional (JSONB), avaliações, licenças
- **Desvinculação**: flag booleana, data, motivo, documento
- **Auditoria**: created_at, updated_at

## 🧪 Testes

```bash
# Executar testes (quando implementados)
yarn test

# Lint
yarn lint
```

### Testes Manuais Importantes

1. **Formulário → Banco**: Submeter form e verificar no Supabase
2. **Autenticação**: Login/logout
3. **CRUD**: Criar, ler, atualizar funcionários
4. **Busca**: Filtros combinados
5. **Upload**: Documentos no Drive

## 📝 Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Webhook
WEBHOOK_SECRET=

# Google Apps Script (para upload via API)
GOOGLE_APPS_SCRIPT_URL=
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
vercel --prod
```

### Outras Plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:

- Railway
- Fly.io
- AWS Amplify
- DigitalOcean App Platform

## 🔧 Desenvolvimento

```bash
# Desenvolvimento
yarn dev

# Build de produção
yarn build

# Rodar build localmente
yarn start

# Lint
yarn lint
```

## 📈 Melhorias Futuras

- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Dashboard com gráficos e estatísticas
- [ ] Histórico de alterações (audit log completo)
- [ ] Notificações por email
- [ ] Backup automático
- [ ] Validação de CPF em tempo real
- [ ] Upload de foto do funcionário
- [ ] PWA (Progressive Web App)
- [ ] Dark mode

## 🐛 Problemas Conhecidos

- Nenhum no momento

## 📄 Licença

Projeto privado - Uso pessoal apenas

## 👤 Autor

Desenvolvido para gerenciamento interno de RH

## 🤝 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação completa no tutorial
2. Confira os logs do Supabase e Vercel
3. Revise as configurações do Apps Script

---

**Última atualização**: Novembro 2025
**Versão**: 1.0.0
