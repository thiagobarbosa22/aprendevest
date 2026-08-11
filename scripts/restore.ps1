param(
  [Parameter(Mandatory = $true)] [string] $DatabaseUrl,
  [Parameter(Mandatory = $true)] [string] $BackupFile,
  [switch] $ConfirmRestore
)

$ErrorActionPreference = "Stop"
if (-not $ConfirmRestore) { throw "Use -ConfirmRestore após validar banco e arquivo alvo." }
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) { throw "DatabaseUrl é obrigatória." }
$backupPath = (Resolve-Path -LiteralPath $BackupFile -ErrorAction Stop).Path
if ([System.IO.Path]::GetExtension($backupPath) -ne ".dump") { throw "O arquivo deve ter extensão .dump." }
Get-Item -LiteralPath $backupPath | Format-List FullName, Length, LastWriteTime
& pg_restore --clean --if-exists --no-owner --no-privileges --dbname=$DatabaseUrl $backupPath
if ($LASTEXITCODE -ne 0) { throw "pg_restore falhou; interrompa a operação e preserve os logs." }
Write-Output "Restore concluído a partir de: $backupPath"
