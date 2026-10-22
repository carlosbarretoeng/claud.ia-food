# Segurança

Este repositório é **público**.

## Regra de segredos

É proibido armazenar ou commitar, em qualquer arquivo, issue, PR, Wiki ou log:

- chaves de API (WhatsApp/Meta, IA, PIX, NFC-e, mapas);
- tokens de acesso, senhas e credenciais de banco de dados;
- certificado digital A1 (`.pfx`/`.p12`) e o CSC da NFC-e;
- dados reais de clientes (nome, telefone, endereço, conversas).

Segredos ficam apenas em variáveis de ambiente ou no gerenciador de segredos da hospedagem. O repositório terá só um `.env.example` com valores fictícios.

## Se um segredo vazar

1. Revogue e gere outro na origem imediatamente (apagar o commit não basta: o histórico e forks guardam o valor).
2. Remova do histórico e avise o responsável pelo projeto.

## Reportar uma vulnerabilidade

Não abra issue público. Use a aba **Security → Report a vulnerability** do repositório.
