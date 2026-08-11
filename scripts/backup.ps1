param(
  [Parameter(Mandatory = $true)] [string] $DatabaseUrl,
  [string] $Destination = "backups"
)

$ErrorActionPreference = "Stop"
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) { throw "DatabaseUrl é obrigatória." }
$destinationPath = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $Destination))
$workspacePath = [System.IO.Path]::GetFullPath((Get-Location).Path)
if (-not $destinationPath.StartsWith($workspacePath, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "O destino deve permanecer dentro do workspace."
}
New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
$output = Join-Path $destinationPath ("aprendevest-{0}.dump" -f (Get-Date -Format "yyyyMMdd-HHmmss"))
& pg_dump --format=custom --no-owner --no-privileges --file=$output $DatabaseUrl
if ($LASTEXITCODE -ne 0) { throw "pg_dump falhou." }
Get-FileHash -Algorithm SHA256 -LiteralPath $output | Format-List
Write-Output "Backup criado: $output"
