# GCONT — Assessoria Contábil

Sistema de regularidade contábil para MEI, ME e EPP de comércio e serviços.

## Conexão com Supabase

1. No projeto Supabase **Sistema Contabilidade**, abra o SQL Editor e execute `supabase/schema.sql`.
2. Em **Project Settings > API**, copie a Project URL e a chave pública.
3. Crie o arquivo `.env.local` a partir de `.env.example` e preencha as duas variáveis.

As chaves reais não devem ser enviadas para o GitHub. O arquivo `.env.local` permanece local e as mesmas variáveis devem ser cadastradas no painel da Vercel.

## Publicação

1. O repositório `Josildof64/gcont-sistema-contabilidade` está conectado à Vercel.
2. Cadastre `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` nas variáveis de ambiente da Vercel.
3. Cada novo commit na branch `main` inicia uma nova publicação automaticamente.
