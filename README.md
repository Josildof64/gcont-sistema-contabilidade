# Conta Clara

Sistema de regularidade contábil para MEI, ME e EPP de comércio e serviços.

## Conexão com Supabase

1. No projeto Supabase **Sistema Contabilidade**, abra o SQL Editor e execute `supabase/schema.sql`.
2. Em **Project Settings > API**, copie a Project URL e a anon key.
3. Crie o arquivo `.env.local` a partir de `.env.example` e preencha as duas variáveis.

As chaves reais não devem ser enviadas para o GitHub. O arquivo `.env.local` permanece local e as mesmas variáveis devem ser cadastradas no painel da Vercel.

## Publicação

1. Crie um repositório GitHub a partir desta pasta e envie o código.
2. Importe o repositório na Vercel.
3. Cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente da Vercel.
4. Faça o deploy.
