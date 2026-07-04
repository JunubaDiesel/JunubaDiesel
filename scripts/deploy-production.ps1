# JUNUBA — Vercel production deploy (run after: npx vercel login)
# Usage: .\scripts\deploy-production.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

function Require-VercelAuth {
  if ($script:VercelToken) { return }
  if (-not (Test-Path "$env:USERPROFILE\.vercel\auth.json")) {
    Write-Host "Vercel login required. Run: npx vercel login" -ForegroundColor Yellow
    Write-Host "Or add VERCEL_TOKEN to .env.local (Vercel → Account → Tokens)" -ForegroundColor Yellow
    exit 1
  }
}

function Invoke-Vercel {
  param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$CliArgs
  )
  if ($script:VercelToken) {
    & npx vercel @CliArgs --token $script:VercelToken
  } else {
    & npx vercel @CliArgs
  }
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

function Read-EnvLocalValue([string]$Name) {
  if (-not (Test-Path ".env.local")) { return $null }
  foreach ($line in Get-Content ".env.local") {
    if ($line -match "^$Name=(.+)$") { return $matches[1].Trim().Trim('"') }
  }
  return $null
}

function Set-VercelEnvIfMissing([string]$Name, [string]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return }
  $existing = if ($script:VercelToken) {
    npx vercel env ls production --token $script:VercelToken 2>$null | Select-String $Name
  } else {
    npx vercel env ls production 2>$null | Select-String $Name
  }
  if ($existing) {
    Write-Host "  env $Name already set (skip)"
    return
  }
  if ($script:VercelToken) {
    $Value | npx vercel env add $Name production --force --token $script:VercelToken 2>&1 | Out-Null
  } else {
    $Value | npx vercel env add $Name production --force 2>&1 | Out-Null
  }
  Write-Host "  env $Name added"
}

$script:VercelToken = Read-EnvLocalValue "VERCEL_TOKEN"
if ($script:VercelToken) { $env:VERCEL_TOKEN = $script:VercelToken }

Require-VercelAuth

Write-Host "`n=== Link Vercel project ===" -ForegroundColor Cyan
if (-not (Test-Path ".vercel/project.json")) {
  Invoke-Vercel link --yes --project junuba-diesel
  if ($LASTEXITCODE -ne 0) {
    Invoke-Vercel link --yes
  }
}

Write-Host "`n=== Environment variables ===" -ForegroundColor Cyan
$adminPassword = Read-EnvLocalValue "ADMIN_PASSWORD"
if (-not $adminPassword) {
  $adminPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
  Write-Host "  Generated ADMIN_PASSWORD (save this): $adminPassword" -ForegroundColor Yellow
}
$geminiKey = Read-EnvLocalValue "GOOGLE_GENERATIVE_AI_API_KEY"
$blobToken = Read-EnvLocalValue "BLOB_READ_WRITE_TOKEN"

Set-VercelEnvIfMissing "ADMIN_PASSWORD" $adminPassword
Set-VercelEnvIfMissing "GOOGLE_GENERATIVE_AI_API_KEY" $geminiKey
Set-VercelEnvIfMissing "BLOB_READ_WRITE_TOKEN" $blobToken

Write-Host "`n=== Production deploy ===" -ForegroundColor Cyan
Invoke-Vercel deploy --prod --yes

Write-Host "`n=== Domains ===" -ForegroundColor Cyan
Invoke-Vercel domains add www.junubadiesel.com
Invoke-Vercel domains add junubadiesel.com

Write-Host @"

=== DNS (Squarespace / registrar) — keep MX records unchanged ===
  @   A     76.76.21.21
  www CNAME cname.vercel-dns.com

Remove old Squarespace A/CNAME for @ and www before adding the above.
Then set Primary domain to www.junubadiesel.com in Vercel → Settings → Domains.

"@ -ForegroundColor Green

Write-Host "Run verification: .\scripts\verify-production.ps1" -ForegroundColor Cyan
