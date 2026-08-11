# Operação, observabilidade e recuperação

## Sinais essenciais

- `GET /api/v1/health` informa prontidão do processo e do PostgreSQL sem revelar conexão.
- Cada resposta recebe `x-request-id`; o mesmo identificador segue nos headers internos para correlação de logs.
- Alertar por taxa de `5xx`, latência p95, indisponibilidade do health check, falhas de migração e crescimento de `429`.
- Logs não podem conter senha, token de sessão, redação, resposta privada ou URL assinada.

## Backup

```powershell
./scripts/backup.ps1 -DatabaseUrl $env:DATABASE_URL -Destination backups
```

Guarde o `.dump` e seu SHA-256 em armazenamento criptografado fora do servidor. Execute diariamente e teste restauração trimestralmente em banco isolado.

## Restore controlado

O restore usa `--clean` e altera todo o banco de destino. Valide nome/host, mantenha um backup anterior e use somente em ambiente isolado ou janela de incidente aprovada.

```powershell
./scripts/restore.ps1 -DatabaseUrl $env:RESTORE_DATABASE_URL -BackupFile ./backups/aprendevest-AAAAMMDD-HHMMSS.dump -ConfirmRestore
```

Depois execute health check, smoke E2E e reconcilie auditoria/arquivos externos.

## Incidente

1. Confirmar impacto e registrar horário/request IDs sem copiar dados sensíveis.
2. Conter o componente afetado por rollback ou feature flag.
3. Preservar evidências, comunicar responsáveis e titulares quando exigido.
4. Recuperar, executar migrações/smoke tests e monitorar recorrência.
5. Documentar causa, janela, dados afetados e ações preventivas.
