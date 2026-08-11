# Segurança e privacidade

## Identidade

- Senhas usam `scrypt` com salt aleatório, parâmetros registrados no próprio hash e comparação em tempo constante.
- O navegador recebe apenas um token de sessão aleatório. O banco armazena seu SHA-256, nunca o token reutilizável.
- Cookies são `HttpOnly`, `SameSite=Lax`, restritos a `/`, têm expiração e usam `Secure` em produção.
- A autorização segura ocorre próxima ao dado; esconder um botão nunca substitui RBAC no servidor.
- Mensagens de login não revelam se um e-mail está cadastrado.

## LGPD

- O cadastro registra finalidade e versão da política aceita.
- A faixa etária é opcional e não exige data de nascimento.
- O titular pode exportar dados ou solicitar exclusão na área de perfil.
- A solicitação de exclusão bloqueia a conta e revoga todas as sessões imediatamente; a anonimização definitiva deve respeitar a política de retenção operacional.
- Auditoria registra ação e alvo, sem senha, token ou conteúdo sensível.

## Limites conhecidos da Fase 1

- Recuperação e verificação de e-mail dependem da integração transacional futura.
- Rate limiting distribuído será ativado na Fase 8; até lá, a implantação pública deve aplicar limite no proxy de borda.
- Administradores ainda não possuem segundo fator; o CMS não deve ser liberado publicamente antes dessa proteção.
