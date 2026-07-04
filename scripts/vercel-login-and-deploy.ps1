# Wait for Vercel OAuth, then run production deploy.
# Usage: .\scripts\vercel-login-and-deploy.ps1

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path $PSScriptRoot -Parent
Set-Location $ProjectRoot

function Read-EnvLocalValue([string]$Name) {
  if (-not (Test-Path ".env.local")) { return $null }
  foreach ($line in Get-Content ".env.local") {
    if ($line -match "^$Name=(.+)$") { return $matches[1].Trim().Trim('"') }
  }
  return $null
}

$token = Read-EnvLocalValue "VERCEL_TOKEN"
if ($token) {
  $env:VERCEL_TOKEN = $token
  Write-Host "Using VERCEL_TOKEN from .env.local" -ForegroundColor Green
  & "$PSScriptRoot\deploy-production.ps1"
  exit $LASTEXITCODE
}

if (Test-Path "$env:USERPROFILE\.vercel\auth.json") {
  Write-Host "Vercel auth found." -ForegroundColor Green
  & "$PSScriptRoot\deploy-production.ps1"
  exit $LASTEXITCODE
}

Write-Host "`n=== Vercel login ===" -ForegroundColor Cyan
Write-Host "Open the URL below and approve with GitHub (JunubaDiesel)." -ForegroundColor Yellow
$login = Start-Process -FilePath "npx" -ArgumentList "vercel","login" -NoNewWindow -PassThru -RedirectStandardOutput "$env:TEMP\vercel-login-out.txt" -RedirectStandardError "$env:TEMP\vercel-login-err.txt"

Start-Sleep -Seconds 3
Get-Content "$env:TEMP\vercel-login-err.txt","$env:TEMP\vercel-login-out.txt" -ErrorAction SilentlyContinue | Select-String "user_code|Visit https"

$deadline = (Get-Date).AddMinutes(5)
while ((Get-Date) -lt $deadline) {
  if (Test-Path "$env:USERPROFILE\.vercel\auth.json") {
    Write-Host "`nLogin successful." -ForegroundColor Green
    try { Stop-Process -Id $login.Id -Force -ErrorAction SilentlyContinue } catch {}
    & "$PSScriptRoot\deploy-production.ps1"
    exit $LASTEXITCODE
  }
  Start-Sleep -Seconds 5
}

Write-Host "`nLogin timed out. Run manually:" -ForegroundColor Red
Write-Host "  npx vercel login" -ForegroundColor Yellow
Write-Host "  .\scripts\deploy-production.ps1" -ForegroundColor Yellow
exit 1
